package http

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/kudarap/ratatxt/ratatxt"
)

func handleCurrentUser(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		userID := userIDFrom(r.Context())

		o, err := core.User(userID)
		if err != nil {
			return err
		}

		respondOK(w, o)
		return nil
	}

	return handleWithError(fn)
}

func handleUserList(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		opts, err := searchOptsFromURL(r.URL, &ratatxt.UserFilter{})
		if err != nil {
			return err
		}

		l, meta, err := core.SearchUsers(opts)
		if err != nil {
			return err
		}

		respondOK(w, newListWithMeta(l, meta))
		return nil
	}

	return handleWithError(fn)
}

func handleUserDetails(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		o, err := core.User(ratatxt.ID(chi.URLParam(r, "id")))
		if err != nil {
			return err
		}

		respondOK(w, o)
		return nil
	}

	return handleWithError(fn)
}
