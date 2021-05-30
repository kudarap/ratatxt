package http

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/kudarap/ratatxt/ratatxt"
)

func handleWebhookList(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		opts, err := searchOptsFromURL(r.URL, &ratatxt.WebhookFilter{})
		if err != nil {
			return err
		}
		opts.UserID = userIDFrom(r.Context())

		l, meta, err := core.SearchWebhooks(opts)
		if err != nil {
			return err
		}

		respondOK(w, newListWithMeta(l, meta))
		return nil
	}

	return handleWithError(fn)
}

func handleWebhookDetails(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var f = ratatxt.WebhookFilter{}
		if err := searchOptsFilter(r.URL, &f); err != nil {
			return err
		}
		f.ID = ratatxt.ID(chi.URLParam(r, "id"))
		f.UserID = userIDFrom(r.Context())

		o, err := core.Webhook(f)
		if err != nil {
			return err
		}

		respondOK(w, o)
		return nil
	}

	return handleWithError(fn)
}

func handleWebhookCreate(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.WebhookCreateParam
		if err := parseForm(r, &p); err != nil {
			return err
		}
		p.UserID = userIDFrom(r.Context())

		o, err := core.CreateWebhook(p)
		if err != nil {
			return err
		}

		respond(w, http.StatusCreated, o)
		return nil
	}

	return handleWithError(fn)
}

func handleWebhookUpdate(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.WebhookUpdateParam
		if err := parseForm(r, &p); err != nil {
			return err
		}
		p.ID = ratatxt.ID(chi.URLParam(r, "id"))
		p.UserID = userIDFrom(r.Context())

		o, err := core.UpdateWebhook(p)
		if err != nil {
			return err
		}

		respondOK(w, o)
		return nil
	}

	return handleWithError(fn)
}

func handleWebhookDelete(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.WebhookDeleteParam
		p.ID = ratatxt.ID(chi.URLParam(r, "id"))
		p.UserID = userIDFrom(r.Context())

		if err := core.DeleteWebhook(p); err != nil {
			return err
		}

		respondOK(w, newMsg("webhook deleted"))
		return nil
	}

	return handleWithError(fn)
}
