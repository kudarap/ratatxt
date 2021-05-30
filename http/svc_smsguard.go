package http

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/kudarap/ratatxt/ratatxt"
	"github.com/kudarap/ratatxt/smsguard"
)

type smsGuardResp struct {
	Code string    `json:"code"`
	Expr time.Time `json:"expiration"`
}

func handleSMSGuardCreate(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.SMSGuardCreateParam
		if err := parseForm(r, &p); err != nil {
			return err
		}
		p.UserID = userIDFrom(r.Context())

		code, expr, err := core.SendSMSGuard(p)
		if err != nil {
			return err
		}

		respondOK(w, smsGuardResp{code, expr})
		return nil
	}

	return handleWithError(fn)
}

func handleSMSGuardCheck() http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		code := chi.URLParam(r, "code")
		uid := userIDFrom(r.Context())
		isValid := smsguard.IsValid(code, uid.String())

		respondOK(w, struct {
			IsValid bool `json:"is_valid"`
		}{isValid})
		return nil
	}

	return handleWithError(fn)
}
