package http

import "github.com/go-chi/chi"

func (s *Server) setPublicEndpoints(r chi.Router) {
	r.Group(func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/register", handleAuthRegister(s.core))
			r.Post("/verify", handleAuthVerify(s.core))
			r.Post("/login", handleAuthLogin(s.core))
			r.Post("/renew", handleAuthRenew(s.core))
			r.Post("/revoke", handleAuthRevoke(s.core))
		})
	})

	r.Get("/version", handleInfo(s.version))
	r.NotFound(handle404())
	r.MethodNotAllowed(handle405())
}

func (s *Server) setPrivateEndpoints(r chi.Router) {
	r.Group(func(r chi.Router) {
		r.Use(s.authorizer)
		r.Get("/me", handleCurrentUser(s.core))
		r.Route("/devices", func(r chi.Router) {
			r.Post("/", handleDeviceCreate(s.core))
			r.Get("/", handleDeviceList(s.core))
			r.Get("/{id}", handleDeviceDetails(s.core))
			r.Patch("/{id}", handleDeviceUpdate(s.core))
		})
		r.Route("/messages", func(r chi.Router) {
			r.Get("/", handleMessageList(s.core))
			r.Get("/{id}", handleMessageDetails(s.core))
		})
		r.Route("/inbox", func(r chi.Router) {
			r.Post("/", handleInboxCreate(s.core))
			r.Get("/{id}", handleMessageDetails(s.core))
		})
		r.Route("/outbox", func(r chi.Router) {
			r.Post("/", handleOutboxCreate(s.core))
			r.Get("/{id}", handleMessageDetails(s.core))
			r.Patch("/{id}", handleOutboxUpdate(s.core))
		})
		r.Route("/webhooks", func(r chi.Router) {
			r.Post("/", handleWebhookCreate(s.core))
			r.Get("/", handleWebhookList(s.core))
			r.Get("/{id}", handleWebhookDetails(s.core))
			r.Patch("/{id}", handleWebhookUpdate(s.core))
			r.Delete("/{id}", handleWebhookDelete(s.core))
		})
		r.Route("/appkeys", func(r chi.Router) {
			r.Post("/", handleAppKeyCreate(s.core))
			r.Get("/", handleAppKeyList(s.core))
			r.Get("/{id}", handleAppKeyDetails(s.core))
			r.Delete("/{id}", handleAppKeyDelete(s.core))
		})
		r.Route("/smsguard", func(r chi.Router) {
			r.Post("/", handleSMSGuardCreate(s.core))
			r.Get("/{code}", handleSMSGuardCheck())
		})
		r.Route("/stats", func(r chi.Router) {
			r.Get("/score/{scope}", handleStatsMessageScore(s.core))
			r.Get("/messages/{scope}", handleStatsMessageGraph(s.core))
			r.Get("/outbox/{scope}", handleStatsOutboxGraph(s.core))
		})
	})
}
