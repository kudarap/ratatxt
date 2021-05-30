package ratatxt

import (
	"strings"
	"time"
)

const (
	AppKeyPrefix       = "ak_"
	appKeyLimitPerUser = 25 // Maximum number of app-keys per user.
)

// AppKey errors types.
const (
	AppKeyErrNotFound Errors = iota + 2100
	AppKeyErrRequiredID
	AppKeyErrRequiredUserID
	AppKeyErrLimit
)

// AppKey error definition
func init() {
	errorsText[AppKeyErrNotFound] = "app-key not found"
	errorsText[AppKeyErrRequiredID] = "app-key id is required"
	errorsText[AppKeyErrRequiredUserID] = "app-key user_id is required"
	errorsText[AppKeyErrLimit] = "app-key reached max of 5 limit"
}

// AppKey represents a limited but long-lived access token.
// Primary used for mobile app client and server applications.
type AppKey struct {
	ID        ID         `json:"id" gorm:"primaryKey;type:CHAR(20)"`
	UserID    ID         `json:"user_id"`
	Token     string     `json:"token"`
	Note      string     `json:"note"`
	LastUsed  *time.Time `json:"last_used"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

func (k AppKey) setDefaults() *AppKey {
	k.Token = AppKeyPrefix + generateSha1()
	return &k
}

func (k AppKey) updateLastUsed() *AppKey {
	now := time.Now()
	k.LastUsed = &now
	return &k
}

// AppKeyFilter represents app-keys query filter.
type AppKeyFilter struct {
	ID     ID     `db:"id,omitempty"`
	UserID ID     `db:"user_id,omitempty"`
	Token  string `db:"token,omitempty"`
	Note   string `db:"note,omitempty"`
}

// AppKeys returns a list of app-keys by filter.
func (c *Core) AppKeys(f *AppKeyFilter) ([]*AppKey, error) {
	var list []*AppKey
	if err := c.store.List(&list, f); err != nil {
		return nil, err
	}

	return list, nil
}

// AppKey returns appKey details by filter and returns error if no result.
func (c *Core) AppKey(f AppKeyFilter) (*AppKey, error) {
	list, err := c.AppKeys(&f)
	if err != nil {
		return nil, err
	}
	if len(list) == 0 {
		return nil, AppKeyErrNotFound
	}
	return list[0], nil
}

// AppKeyAuthFrom returns auth details from app-key token.
//
// It will also update app-key last used field.
func (c *Core) AppKeyAuthFrom(token string) (*Auth, error) {
	ak, err := c.AppKey(AppKeyFilter{Token: token})
	if err != nil {
		return nil, err
	}

	go func() {
		ak = ak.updateLastUsed()
		if err = c.store.Update(ak); err != nil {
			c.logger.Error("could not update app-key last used:", err)
		}
	}()

	return c.Auth(AuthFilter{UserID: ak.UserID})
}

// AppKeyCreateParam represents parameters to create app-key.
type AppKeyCreateParam struct {
	UserID ID     `json:"user_id"`
	Note   string `json:"note"`
}

func (p *AppKeyCreateParam) validate() error {
	if p.UserID.IsEmpty() {
		return AppKeyErrRequiredUserID
	}

	p.Note = strings.TrimSpace(p.Note)
	return nil
}

// CreateAppKey create new app-keys to datastore.
func (c Core) CreateAppKey(p AppKeyCreateParam) (*AppKey, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	// Check max appKey entries.
	list, err := c.AppKeys(&AppKeyFilter{UserID: p.UserID})
	if err != nil {
		return nil, err
	}
	if len(list) >= appKeyLimitPerUser {
		return nil, AppKeyErrLimit
	}

	// Set default values and create new app-keys record.
	ak := &AppKey{
		UserID: p.UserID,
		Note:   p.Note,
	}
	ak = ak.setDefaults()
	if err = c.store.Create(ak); err != nil {
		return nil, err
	}

	return ak, nil
}

// AppKeyDeleteParam represents parameters to delete app-keys.
type AppKeyDeleteParam struct {
	ID     ID `json:"ID"`
	UserID ID `json:"user_id"`
}

func (p *AppKeyDeleteParam) validate() error {
	if p.UserID.IsEmpty() {
		return AppKeyErrRequiredUserID
	}

	if p.ID.IsEmpty() {
		return AppKeyErrRequiredID
	}

	return nil
}

// DeleteAppKey permanently deletes existing app-keys on datastore.
func (c *Core) DeleteAppKey(p AppKeyDeleteParam) error {
	if err := p.validate(); err != nil {
		return err
	}

	ak := &AppKey{
		ID:     p.ID,
		UserID: p.UserID,
	}
	return c.store.Delete(ak)
}

var appKeySearchKeywordFields = []string{"id", "note"}

// SearchAppKeys returns a list of app-Keys and metadata base on search options.
func (c *Core) SearchAppKeys(opts *SearchOpts) ([]*AppKey, *SearchMetadata, error) {
	if opts != nil {
		opts.KeywordFields = appKeySearchKeywordFields
	}

	var list []*AppKey
	meta, err := c.store.Search(&list, opts)
	if err != nil {
		return nil, nil, err
	}

	// Redact app key actual tokens.
	for _, ak := range list {
		ak.Token = ""
	}

	return list, meta, nil
}
