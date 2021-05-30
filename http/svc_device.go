package http

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/kudarap/ratatxt/ratatxt"
)

func handleDeviceList(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		opts, err := searchOptsFromURL(r.URL, &ratatxt.DeviceFilter{})
		if err != nil {
			return err
		}
		opts.UserID = userIDFrom(r.Context())

		l, meta, err := core.SearchDevices(opts)
		if err != nil {
			return err
		}

		respondOK(w, newListWithMeta(l, meta))
		return nil
	}

	return handleWithError(fn)
}

func handleDeviceDetails(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var f ratatxt.DeviceFilter
		if err := searchOptsFilter(r.URL, &f); err != nil {
			return err
		}
		f.ID = ratatxt.ID(chi.URLParam(r, "id"))
		f.UserID = userIDFrom(r.Context())

		o, err := core.Device(f)
		if err != nil {
			return err
		}

		respondOK(w, o)
		return nil
	}

	return handleWithError(fn)
}

func handleDeviceCreate(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.DeviceCreateParam
		if err := parseForm(r, &p); err != nil {
			return err
		}
		p.UserID = userIDFrom(r.Context())

		o, err := core.CreateDevice(p)
		if err != nil {
			return err
		}

		respond(w, http.StatusCreated, o)
		return nil
	}

	return handleWithError(fn)
}

func handleDeviceUpdate(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		var p ratatxt.DeviceUpdateParam
		if err := parseForm(r, &p); err != nil {
			return err
		}
		p.ID = ratatxt.ID(chi.URLParam(r, "id"))
		p.UserID = userIDFrom(r.Context())

		o, err := core.UpdateDevice(p)
		if err != nil {
			return err
		}

		respondOK(w, o)
		return nil
	}

	return handleWithError(fn)
}
