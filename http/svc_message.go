package http

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/kudarap/ratatxt/ratatxt"
)

func handleMessageList(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		opts, err := searchOptsFromURL(r.URL, &ratatxt.MessageFilter{})
		if err != nil {
			return err
		}
		opts.UserID = userIDFrom(r.Context())

		l, meta, err := core.SearchMessages(opts)
		if err != nil {
			return err
		}

		respondOK(w, newListWithMeta(l, meta))
		return nil
	}

	return handleWithError(fn)
}

func handleMessageDetails(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var f ratatxt.MessageFilter
		if err := searchOptsFilter(r.URL, &f); err != nil {
			return err
		}
		f.ID = ratatxt.ID(chi.URLParam(r, "id"))
		f.UserID = userIDFrom(r.Context())

		o, err := core.Message(f)
		if err != nil {
			return err
		}

		respondOK(w, o)
		return nil
	}

	return handleWithError(fn)
}

func handleInboxCreate(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.MessageCreateParam
		if err := parseForm(r, &p); err != nil {
			return err
		}
		p.UserID = userIDFrom(r.Context())

		o, err := core.PushInbox(p)
		if err != nil {
			return err
		}

		respond(w, http.StatusCreated, o)
		return nil
	}

	return handleWithError(fn)
}

func handleOutboxCreate(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.MessageCreateParam
		if err := parseForm(r, &p); err != nil {
			return err
		}
		p.UserID = userIDFrom(r.Context())

		d, err := core.SendOutbox(p)
		if err != nil {
			return err
		}

		respond(w, http.StatusCreated, d)
		return nil
	}

	return handleWithError(fn)
}

func handleOutboxUpdate(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.OutboxUpdateParam
		if err := parseForm(r, &p); err != nil {
			return err
		}
		p.ID = ratatxt.ID(chi.URLParam(r, "id"))
		p.UserID = userIDFrom(r.Context())

		d, err := core.UpdateOutbox(p)
		if err != nil {
			return err
		}

		respondOK(w, d)
		return nil
	}

	return handleWithError(fn)
}
