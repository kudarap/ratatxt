package ui

import (
	"embed"
	"html/template"
	"log"
	"mime"
	"net/http"
	"strings"

	"github.com/sirupsen/logrus"
)

const (
	Root        = "build"
	Index       = Root + "/index.html"
	DefaultAddr = ":8080"
)

//go:embed build/*
var content embed.FS

// Run console ui server.
func Run(addr, publicURL, apiHost string, logger *logrus.Logger) {
	if strings.TrimSpace(apiHost) == "" {
		panic("UI server missing apiHost")
	}

	// Setup server settings.
	var server = http.Server{
		Addr:    DefaultAddr,
		Handler: handler{publicURL, apiHost},
	}
	if addr != "" {
		server.Addr = addr
	}

	logger.Println("UI server running on", server.Addr)
	if err := server.ListenAndServe(); err != nil {
		logger.Fatal(err)
	}
}

type handler struct {
	PublicURL string
	ApiHost   string
}

// ServeHTTP serves react app files.
func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// If static files exist serve it as it is.
	static, err := content.ReadFile(Root + r.URL.Path)
	if err == nil {
		ss := strings.Split(r.URL.Path, ".")
		m := mime.TypeByExtension("." + ss[len(ss)-1])
		if m != "" {
			w.Header().Set("content-type", m)
		}
		if _, err = w.Write(static); err != nil {
			errorResp(w, err)
		}
		return
	}

	// Else route everything to index.html
	t, err := template.ParseFS(content, Index)
	if err != nil {
		errorResp(w, err)
		return
	}
	if err = t.Execute(w, h); err != nil {
		errorResp(w, err)
		return
	}
}

func errorResp(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	if _, wErr := w.Write([]byte(err.Error())); wErr != nil {
		log.Println("could not write response:", wErr)
	}
}
