package http

import (
	"fmt"
	"net/http"
	"reflect"

	jsoniter "github.com/json-iterator/go"
	"github.com/kudarap/ratatxt/errors"
	"github.com/kudarap/ratatxt/ratatxt"
)

var json = jsoniter.ConfigFastest

type httpMsg struct {
	Error bool   `json:"error,omitempty"`
	Typ   string `json:"type,omitempty"`
	Msg   string `json:"message"`
}

func newMsg(msg string) httpMsg {
	return httpMsg{Msg: msg}
}

func newError(err error) interface{} {
	m := httpMsg{}
	m.Error = true
	m.Msg = err.Error()
	return m
}

func handleWithError(h func(w http.ResponseWriter, r *http.Request) error) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := h(w, r); err != nil {
			respondError(w, err)
			return
		}
	}
}

const respContentType = "application/json"

func respond(w http.ResponseWriter, code int, body interface{}) {
	w.Header().Set("Content-Type", respContentType)
	w.WriteHeader(code)

	// Check for string response body.
	if s, ok := body.(string); ok {
		_, _ = w.Write([]byte(s))
		return
	}

	// Generate the response
	enc := json.NewEncoder(w)
	if err := enc.Encode(body); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(fmt.Sprintf("could not encode body into JSON: %s", err)))
	}
}

func respondOK(w http.ResponseWriter, body interface{}) {
	respond(w, http.StatusOK, body)
}

func respondError(w http.ResponseWriter, err error) {
	var body interface{}
	status := http.StatusBadRequest

	// Try to parse handled errors.
	cErr, ok := errors.Parse(err)
	if ok {
		if cErr.Fatal {
			status = http.StatusInternalServerError
		} else if cErr.IsEqual(ratatxt.AuthErrNoAccess) {
			status = http.StatusUnauthorized
		}

		body = httpMsg{true, cErr.Type.String(), err.Error()}

	} else {
		// Use generic error message
		body = newError(err)
	}

	respond(w, status, body)
}

func handle404() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		respond(w, http.StatusNotFound, newError(fmt.Errorf("resource not found")))
	}
}

func handle405() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		respond(w, http.StatusMethodNotAllowed, newError(fmt.Errorf("method not allowed")))
	}
}

type listWithMeta struct {
	Data        interface{} `json:"data"`
	ResultCount int         `json:"result_count"`
	TotalCount  int         `json:"total_count"`
}

func newListWithMeta(data interface{}, m *ratatxt.SearchMetadata) listWithMeta {
	if reflect.ValueOf(data).IsNil() {
		data = []struct{}{}
	}

	return listWithMeta{data, m.ResultCount, m.TotalCount}
}
