package http

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/kudarap/ratatxt/gokit/http/jwt"
	"github.com/kudarap/ratatxt/ratatxt"
)

const defaultTokenExpiration = time.Minute * 5

func handleAuthRegister(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.RegisterAccountParam
		if err := parseForm(r, &p); err != nil {
			return err
		}

		au, err := core.RegisterAccount(p)
		if err != nil {
			return err
		}

		respond(w, http.StatusCreated, newMsg(fmt.Sprintf("verification code will send to %s", au.Username)))
		return nil
	}

	return handleWithError(fn)
}

func handleAuthVerify(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.VerifyParams
		if err := parseForm(r, &p); err != nil {
			return err
		}

		au, err := core.VerifyAuth(p)
		if err != nil {
			return err
		}

		ac, err := newAccessFrom(au)
		if err != nil {
			return err
		}

		respondOK(w, ac)
		return nil
	}

	return handleWithError(fn)
}

func handleAuthLogin(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.LoginParams
		if err := parseForm(r, &p); err != nil {
			return err
		}

		au, err := core.LoginAuth(p)
		if err != nil {
			return err
		}

		ac, err := newAccessFrom(au)
		if err != nil {
			return err
		}

		respondOK(w, ac)
		return nil
	}

	return handleWithError(fn)
}

func handleAuthRenew(core *ratatxt.Core) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ac := &access{}
		if err := parseForm(r, ac); err != nil {
			respondError(w, err)
			return
		}

		au, err := core.AuthByRefreshToken(ac.RefreshToken)
		if err != nil {
			respond(w, http.StatusUnauthorized, newError(err))
			return
		}

		// Override token expiration for testing.
		exprMin, _ := strconv.Atoi(r.URL.Query().Get("t_min"))
		ac, err = refreshJWT(au, time.Minute*time.Duration(exprMin))
		if err != nil {
			respond(w, http.StatusInternalServerError, newError(err))
			return
		}

		respondOK(w, ac)
	}
}

func handleAuthRevoke(core *ratatxt.Core) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var ac access
		if err := parseForm(r, &ac); err != nil {
			respondError(w, err)
			return
		}

		if err := core.RevokeRefreshToken(ac.RefreshToken); err != nil {
			respondError(w, err)
			return
		}

		respondOK(w, newMsg("refresh token successfully revoked"))
	}
}

type access struct {
	UserID       ratatxt.ID        `json:"user_id,omitempty"`
	Level        ratatxt.AuthLevel `json:"level,omitempty"`
	RefreshToken string            `json:"refresh_token,omitempty"`
	Token        string            `json:"token"`
	ExpiresAt    time.Time         `json:"expires_at"`
}

func newAccessFrom(au *ratatxt.Auth) (*access, error) {
	ac, err := refreshJWT(au, 0)
	if err != nil {
		return nil, err
	}

	ac.UserID = au.UserID
	ac.Level = au.Level
	ac.RefreshToken = au.RefreshToken
	return ac, nil
}

func refreshJWT(au *ratatxt.Auth, d time.Duration) (*access, error) {
	now := time.Now()
	ac := &access{
		UserID:    au.UserID,
		Level:     au.Level,
		ExpiresAt: now.Add(defaultTokenExpiration),
	}
	if d != 0 {
		ac.ExpiresAt = now.Add(d)
	}

	t, err := jwt.New(au.UserID.String(), au.Level.String(), ac.ExpiresAt)
	if err != nil {
		return nil, err
	}

	ac.Token = t
	return ac, nil
}
