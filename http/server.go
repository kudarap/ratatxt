package http

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/kudarap/ratatxt/gokit/http/jwt"
	gokitMw "github.com/kudarap/ratatxt/gokit/http/middleware"
	"github.com/kudarap/ratatxt/gokit/version"
	"github.com/kudarap/ratatxt/ratatxt"
	"github.com/sirupsen/logrus"
)

const (
	defaultAddr     = ":7100"
	shutdownTimeout = 10 * time.Second
)

type Server struct {
	// Server settings.
	Addr    string
	handler http.Handler
	// Service core.
	core *ratatxt.Core

	logger  *logrus.Logger
	version version.Version
}

func NewServer(sigKey string, core *ratatxt.Core, l *logrus.Logger, v version.Version) *Server {
	jwt.SigKey = sigKey
	return &Server{core: core, logger: l, version: v}
}

func (s *Server) setup() {
	r := chi.NewRouter()

	// A good base middleware stack
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(NewStructuredLogger(s.logger))
	r.Use(gokitMw.CORS)
	r.Use(middleware.Recoverer)

	// Set routes handler.
	s.setPublicEndpoints(r)
	s.setPrivateEndpoints(r)

	// Set default address.
	if s.Addr == "" {
		s.Addr = defaultAddr
	}

	s.handler = r
}

func (s *Server) Run() error {
	s.setup()

	// Setup http router.
	srv := &http.Server{
		Addr:    s.Addr,
		Handler: s.handler,
	}

	// Handle error on server start.
	errCh := make(chan error, 1)
	go func() {
		s.logger.Infoln("server running on", s.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errCh <- err
		}
	}()

	// Handle quit on SIGINT (CTRL-C).
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)

	// Force server shutdown after shutdownTimeout and this was added because of SSE's opened connection.
	ctx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()

	select {
	case err := <-errCh:
		return err
	case <-quit:
		s.logger.Infoln("server shutting down...")
		if err := srv.Shutdown(ctx); err != nil {
			s.logger.Error("server shutdown error", err)
		}
		s.logger.Infoln("server stopped!")
		return nil
	}
}

func NewStructuredLogger(l *logrus.Logger) func(next http.Handler) http.Handler {
	return middleware.RequestLogger(&middleware.DefaultLogFormatter{Logger: l})
}
