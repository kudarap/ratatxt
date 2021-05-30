package ratatxt

import (
	"fmt"
	"regexp"
	"strings"
	"time"
)

// User errors types.
const (
	UserErrNotFound Errors = iota + 1000
	UserErrRequiredID
	UserErrRequiredFields
)

// User errors  definition.
func init() {
	errorsText[UserErrNotFound] = "user not found"
	errorsText[UserErrRequiredID] = "user_id is required"
	errorsText[UserErrRequiredFields] = "user first_name, last_name, email, and password are required"
}

// User represents user account information.
type User struct {
	ID        ID        `json:"id" gorm:"primaryKey;type:CHAR(20)"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// UserFilter represents search filter for user list.
type UserFilter struct {
	ID        ID     `db:"id,omitempty"`
	FirstName string `db:"first_name,omitempty"`
	LastName  string `db:"last_name,omitempty"`
	Email     string `db:"email,omitempty"`
}

// Users returns a list of users base on user filter.
func (c *Core) Users(f *UserFilter) ([]*User, error) {
	var list []*User
	if err := c.store.List(&list, f); err != nil {
		return nil, err
	}

	return list, nil
}

// User returns user details base on user id.
func (c *Core) User(id ID) (*User, error) {
	if id.IsEmpty() {
		return nil, UserErrRequiredID
	}

	var u User
	if err := c.store.Get(&u, id); err != nil {
		return nil, err
	}

	return &u, nil
}

// UserCreateParam represents user params for create operation.
type UserCreateParam struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
}

func (p UserCreateParam) validate() error {
	p.FirstName = strings.TrimSpace(p.FirstName)
	p.LastName = strings.TrimSpace(p.LastName)
	p.Email = strings.TrimSpace(p.Email)
	if p.FirstName == "" || p.LastName == "" || p.Email == "" {
		return fmt.Errorf("first_name, last_name, email are required")
	}

	if err := validateEmail(p.Email); err != nil {
		return err
	}

	return nil
}

// CreateUser creates new user to datastore.
func (c *Core) CreateUser(p UserCreateParam) (*User, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	u := &User{
		FirstName: p.FirstName,
		LastName:  p.LastName,
		Email:     p.Email,
	}
	if err := c.store.Create(u); err != nil {
		return nil, err
	}

	return u, nil
}

func validateEmail(email string) error {
	re := regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	if !re.MatchString(email) {
		return fmt.Errorf("invalid email address")
	}

	return nil
}

var userSearchKeywordFields = []string{"id", "first_name", "last_name", "email"}

// SearchUsers returns a list of users and metadata base on search options.
func (c *Core) SearchUsers(opts *SearchOpts) ([]*User, *SearchMetadata, error) {
	if opts != nil {
		opts.KeywordFields = userSearchKeywordFields
	}

	var list []*User
	meta, err := c.store.Search(&list, opts)
	if err != nil {
		return nil, nil, err
	}
	return list, meta, nil
}
