package ratatxt

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const (
	webhookLimitPerUser  = 5 // Max number of webhook per user.
	webhookRetryLimit    = 3 // Max number of POST requests when responded by code 4xx or 5xx.
	webhookRetryInterval = time.Millisecond * 500
)

// Webhook errors types.
const (
	WebhookErrNotFound Errors = iota + 5000
	WebhookErrRequiredID
	WebhookErrRequiredUserID
	WebhookErrLimit
)

// Webhook error definition
func init() {
	errorsText[WebhookErrNotFound] = "webhook not found"
	errorsText[WebhookErrRequiredID] = "webhook id is required"
	errorsText[WebhookErrRequiredUserID] = "webhook user_id is required"
	errorsText[WebhookErrLimit] = "webhook reached max of 5 limit"
}

// Webhook represents user webhook for message updates.
// Sends POST request to registered payload url.
type Webhook struct {
	ID           ID         `json:"id" gorm:"primaryKey;type:CHAR(20)"`
	UserID       ID         `json:"user_id"`
	PayloadURL   string     `json:"payload_url"`
	Secret       string     `json:"secret"`
	Active       *bool      `json:"active"`
	LastRespCode int        `json:"last_resp_code"`
	LastUsed     *time.Time `json:"last_used"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

func (w Webhook) setDefaults() *Webhook {
	if w.Active == nil {
		b := true
		w.Active = &b
	}

	return &w
}

func (w Webhook) updateLastUsed() *Webhook {
	now := time.Now()
	w.LastUsed = &now
	return &w
}

func (w Webhook) toPayload(m Message) WebhookPayload {
	var wp WebhookPayload
	wp.ID = w.ID
	wp.PayloadURL = w.PayloadURL
	wp.Secret = w.Secret
	wp.Message = m
	return wp
}

// WebhookPayload represents webhook payload that will be POST to url.
type WebhookPayload struct {
	ID         ID      `json:"webhook_id"`
	PayloadURL string  `json:"payload_url"`
	Secret     string  `json:"secret"`
	Message    Message `json:"message"`
}

// shootWebhooks send POST requests to all active webhooks.
func (c *Core) shootWebhooks(msg Message) []error {
	var errs []error

	activePtr := true
	hooks, err := c.Webhooks(&WebhookFilter{UserID: msg.UserID, Active: &activePtr})
	if err != nil {
		errs = append(errs, err)
	}

	// Send payloads to active webhooks.
	for _, hook := range hooks {
		var code int
		// Retry to send payload when failed.
		for i := 0; i < webhookRetryLimit; i++ {
			code, err = c.webhook.Post(hook.PayloadURL, hook.toPayload(msg))
			if err != nil {
				errs = append(errs, err)
				break
			}

			if code == http.StatusOK || code == http.StatusAccepted {
				break
			}

			time.Sleep(webhookRetryInterval)
		}

		hook.LastRespCode = code
		hook = hook.updateLastUsed()
		if err = c.store.Update(hook); err != nil {
			errs = append(errs, err)
		}
	}

	return errs
}

// WebhookFilter represents webhook query filter.
type WebhookFilter struct {
	ID           ID     `db:"id,omitempty"`
	UserID       ID     `db:"user_id,omitempty"`
	PayloadURL   string `db:"payload_url,omitempty"`
	Secret       string `db:"secret,omitempty"`
	Active       *bool  `db:"active,omitempty"`
	LastRespCode int    `db:"last_resp_code,omitempty"`
}

// Webhooks returns a list of webhooks by filter.
func (c *Core) Webhooks(f *WebhookFilter) ([]*Webhook, error) {
	var list []*Webhook
	if err := c.store.List(&list, f); err != nil {
		return nil, err
	}

	return list, nil
}

// Webhook returns webhook details by filter and returns error if no result.
func (c *Core) Webhook(f WebhookFilter) (*Webhook, error) {
	list, err := c.Webhooks(&f)
	if err != nil {
		return nil, err
	}
	if len(list) == 0 {
		return nil, WebhookErrNotFound
	}
	return list[0], nil
}

// WebhookCreateParam represents parameters to create webhook.
type WebhookCreateParam struct {
	UserID     ID     `json:"user_id"`
	PayloadURL string `json:"payload_url"`
	Secret     string `json:"secret"`
	Active     *bool  `json:"active,omitempty"`
}

func (p *WebhookCreateParam) validate() error {
	if p.UserID.IsEmpty() {
		return WebhookErrRequiredUserID
	}

	p.PayloadURL = strings.TrimSpace(p.PayloadURL)
	p.Secret = strings.TrimSpace(p.Secret)
	// Validate payload URL.
	if p.PayloadURL == "" {
		return fmt.Errorf("payload_url is required")
	}
	if _, err := url.ParseRequestURI(p.PayloadURL); err != nil {
		return err
	}

	return nil
}

// CreateWebhook create new webhook to datastore.
func (c Core) CreateWebhook(p WebhookCreateParam) (*Webhook, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	if _, err := c.testWebhookPayloadURL(p.PayloadURL); err != nil {
		return nil, err
	}

	// Check max webhook entries.
	list, err := c.Webhooks(&WebhookFilter{UserID: p.UserID})
	if err != nil {
		return nil, err
	}
	if len(list) >= webhookLimitPerUser {
		return nil, WebhookErrLimit
	}

	// Set default values and create new webhook record.
	wh := &Webhook{
		UserID:     p.UserID,
		PayloadURL: p.PayloadURL,
		Secret:     p.Secret,
		Active:     p.Active,
	}
	wh = wh.setDefaults()
	if err = c.store.Create(wh); err != nil {
		return nil, err
	}

	return wh, nil
}

// WebhookUpdateParam represents parameters to create webhook.
type WebhookUpdateParam struct {
	ID         ID     `json:"ID"`
	UserID     ID     `json:"user_id"`
	PayloadURL string `json:"payload_url"`
	Secret     string `json:"secret"`
	Active     *bool  `json:"active,omitempty"`
}

func (p *WebhookUpdateParam) validate() error {
	if p.UserID.IsEmpty() {
		return WebhookErrRequiredUserID
	}

	if p.ID.IsEmpty() {
		return WebhookErrRequiredID
	}

	p.PayloadURL = strings.TrimSpace(p.PayloadURL)
	p.Secret = strings.TrimSpace(p.Secret)
	// Validate payload URL.
	_, err := url.ParseRequestURI(p.PayloadURL)
	if p.PayloadURL != "" && err != nil {
		return err
	}

	return nil
}

// UpdateWebhook updates existing webhook to datastore.
func (c *Core) UpdateWebhook(p WebhookUpdateParam) (*Webhook, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	// Check webhook ownership.
	wh, err := c.Webhook(WebhookFilter{ID: p.ID, UserID: p.UserID})
	if err != nil {
		return nil, err
	}
	if wh == nil {
		return nil, WebhookErrNotFound
	}

	if p.PayloadURL != wh.PayloadURL {
		if _, err = c.testWebhookPayloadURL(p.PayloadURL); err != nil {
			return nil, err
		}
	}

	// Update webhook record.
	wh = &Webhook{
		ID:         p.ID,
		PayloadURL: p.PayloadURL,
		Secret:     p.Secret,
		Active:     p.Active,
	}
	if err = c.store.Update(wh); err != nil {
		return nil, err
	}

	return wh, nil
}

func (c *Core) testWebhookPayloadURL(url string) (code int, err error) {
	return c.webhook.Post(url, struct {
		Message string `json:"message"`
	}{"pre webhook test"})
}

// WebhookDeleteParam represents parameters to delete webhook.
type WebhookDeleteParam struct {
	ID     ID `json:"ID"`
	UserID ID `json:"user_id"`
}

func (p *WebhookDeleteParam) validate() error {
	if p.UserID.IsEmpty() {
		return WebhookErrRequiredUserID
	}

	if p.ID.IsEmpty() {
		return WebhookErrRequiredID
	}

	return nil
}

// DeleteWebhook permanently deletes existing webhook on datastore.
func (c *Core) DeleteWebhook(p WebhookDeleteParam) error {
	if err := p.validate(); err != nil {
		return err
	}

	wh := &Webhook{
		ID:     p.ID,
		UserID: p.UserID,
	}
	return c.store.Delete(wh)
}

var webhookSearchKeywordFields = []string{"id", "payload_url", "last_resp_code"}

// SearchWebhooks returns a list of webhooks and metadata base on search options.
func (c *Core) SearchWebhooks(opts *SearchOpts) ([]*Webhook, *SearchMetadata, error) {
	if opts != nil {
		opts.KeywordFields = webhookSearchKeywordFields
	}

	var list []*Webhook
	meta, err := c.store.Search(&list, opts)
	if err != nil {
		return nil, nil, err
	}
	return list, meta, nil
}
