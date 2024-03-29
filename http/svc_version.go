package http

import (
	"net/http"

	"github.com/kudarap/ratatxt/gokit/version"
)

func handleInfo(v version.Version) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		respondOK(w, v)
	}
}
