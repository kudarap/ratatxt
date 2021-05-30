package http

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/kudarap/ratatxt/ratatxt"
)

func handleStatsMessageScore(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		f := &ratatxt.MessageFilter{UserID: userIDFrom(r.Context())}
		l, err := core.MessageScore(chi.URLParam(r, "scope"), f)
		if err != nil {
			return err
		}

		respondOK(w, newStatsResponse(l))
		return nil
	}

	return handleWithError(fn)
}

func handleStatsMessageGraph(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		f := &ratatxt.MessageFilter{UserID: userIDFrom(r.Context())}
		l, err := core.MessageGraph(chi.URLParam(r, "scope"), f)
		if err != nil {
			return err
		}

		respondOK(w, newStatsResponse(l))
		return nil
	}

	return handleWithError(fn)
}

func handleStatsOutboxGraph(core *ratatxt.Core) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) error {
		f := &ratatxt.MessageFilter{UserID: userIDFrom(r.Context())}
		l, err := core.OutboxGraph(chi.URLParam(r, "scope"), f)
		if err != nil {
			return err
		}

		respondOK(w, newStatsResponse(l))
		return nil
	}

	return handleWithError(fn)
}

func newStatsResponse(data interface{}) interface{} {
	return map[string]interface{}{
		"data":       data,
		"updated_at": time.Now(),
	}
}
