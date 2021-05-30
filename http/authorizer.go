package http

import (
	"net/http"
	"strings"

	"github.com/kudarap/ratatxt/errors"
	"github.com/kudarap/ratatxt/gokit/http/jwt"
	"github.com/kudarap/ratatxt/ratatxt"
)

func (s *Server) authorizer(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check for app-key token authentication.
		au := authFromAppKey(r, s.core)
		if au == nil {
			// Check for JWT authentication and validate token from header.
			c, err := jwt.ParseFromHeader(r.Header)
			if err != nil {
				respondError(w, errors.New(ratatxt.AuthErrNoAccess, err))
				return
			}

			au = &ratatxt.Auth{UserID: ratatxt.ID(c.UserID)}
		}

		// Checks auth level required.

		// Inject auth details to context that will later be use as
		// context user and authorizer level.
		ctx := ratatxt.AuthToContext(r.Context(), au)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func authFromAppKey(r *http.Request, core *ratatxt.Core) *ratatxt.Auth {
	tok, ok := appKeyFrom(r)
	if !ok {
		return nil
	}

	au, _ := core.AppKeyAuthFrom(tok)
	return au
}

func appKeyFrom(r *http.Request) (appKey string, ok bool) {
	appKey, _, ok = r.BasicAuth()
	if !ok {
		return "", false
	}

	if !strings.HasPrefix(appKey, ratatxt.AppKeyPrefix) {
		return "", false
	}

	return appKey, true
}
