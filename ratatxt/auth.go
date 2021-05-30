package ratatxt

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"
	"time"
)

// Auth errors types.
const (
	AuthErrNoAccess Errors = iota + 2000
	AuthErrNotFound
	AuthErrRequiredID
	AuthErrRequiredUserID
	AuthErrVerificationReqFields
	AuthErrLoginReqFields
	AuthErrNotUsernameUsed
	AuthErrInvalidRefreshToken
	AuthErrInvalidLogin
)

// Auth errors definition.
func init() {
	errorsText[AuthErrNoAccess] = "authorization no access"
	errorsText[AuthErrNotFound] = "auth not found"
	errorsText[AuthErrRequiredID] = "auth id is required"
	errorsText[AuthErrRequiredUserID] = "auth user_id is required"
	errorsText[AuthErrVerificationReqFields] = "username and verification code are required"
	errorsText[AuthErrLoginReqFields] = "username and password are required"
	errorsText[AuthErrNotUsernameUsed] = "auth username already used"
	errorsText[AuthErrInvalidRefreshToken] = "invalid refresh token"
	errorsText[AuthErrInvalidLogin] = "invalid username or password"
}

// Auth levels.
const (
	AuthLevelPending  AuthLevel = 10 // Default auth level
	AuthLevelVerified AuthLevel = 20
	AuthLevelAdmin    AuthLevel = 90
)

// Auth represents user account access information.
type Auth struct {
	ID               ID         `json:"id" gorm:"primaryKey;type:CHAR(20)"`
	UserID           ID         `json:"user_id"`
	Username         string     `json:"username"`
	Password         string     `json:"-"`
	RefreshToken     string     `json:"refresh_token"`
	Level            AuthLevel  `json:"level"`
	VerificationCode string     `json:"-"`
	VerifiedAt       *time.Time `json:"verified_at"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at"`
}

// IsVerified returns if account is verified.
func (a Auth) IsVerified() bool {
	return a.Level == AuthLevelVerified
}

func (a Auth) setDefaults() *Auth {
	if a.Level == 0 {
		a.Level = AuthLevelPending
	}
	a.RefreshToken = generateSha1()
	return a.hashPassword()
}

func (a Auth) hashPassword() *Auth {
	a.Password = hashPassword(a.UserID, a.Password)
	return &a
}

type AuthLevel uint

var authLevelText = map[AuthLevel]string{
	AuthLevelPending:  "PENDING",
	AuthLevelVerified: "VERIFIED",
	AuthLevelAdmin:    "ADMIN",
}

// String returns string value of auth level.
func (l AuthLevel) String() string {
	return authLevelText[l]
}

type AuthFilter struct {
	ID               ID        `db:"id,omitempty"`
	UserID           ID        `db:"user_id,omitempty"`
	Username         string    `db:"username,omitempty"`
	Password         string    `db:"password,omitempty"`
	RefreshToken     string    `db:"refresh_token,omitempty"`
	Level            AuthLevel `db:"level,omitempty"`
	VerificationCode string    `db:"verification_code,omitempty"`
}

// Auths returns a list of auths base on filter.
func (c *Core) Auths(f *AuthFilter) ([]*Auth, error) {
	var list []*Auth
	if err := c.store.List(&list, f); err != nil {
		return nil, err
	}

	return list, nil
}

// Auth returns auth details base on filter.
func (c *Core) Auth(f AuthFilter) (*Auth, error) {
	list, err := c.Auths(&f)
	if err != nil {
		return nil, err
	}
	if len(list) == 0 {
		return nil, AuthErrNotFound
	}
	return list[0], nil
}

// RegisterAccountParam represents parameters to create operation.
type RegisterAccountParam struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

func (p RegisterAccountParam) validate() error {
	p.FirstName = strings.TrimSpace(p.FirstName)
	p.LastName = strings.TrimSpace(p.LastName)
	p.Email = strings.TrimSpace(p.Email)
	p.Password = strings.TrimSpace(p.Password)
	if p.FirstName == "" || p.LastName == "" || p.Email == "" || p.Password == "" {
		return fmt.Errorf("first_name, last_name, email, and password are required")
	}

	if err := validateEmail(p.Email); err != nil {
		return err
	}

	return nil
}

// RegisterAccount creates new user account and access data.
func (c *Core) RegisterAccount(p RegisterAccountParam) (*Auth, error) {
	// Check for existing account.
	cur, _ := c.LoginAuth(LoginParams{p.Email, p.Password})
	if cur != nil {
		return nil, AuthErrNotUsernameUsed
	}

	u, err := c.CreateUser(UserCreateParam{
		FirstName: p.FirstName,
		LastName:  p.LastName,
		Email:     p.Email,
	})
	if err != nil {
		return nil, err
	}

	au, err := c.CreateAuth(authCreateParam{
		u.ID,
		u.Email,
		p.Password,
	})
	if err != nil {
		return nil, err
	}

	if err = c.sendVerificationCode(u.Email, au.ID); err != nil {
		return nil, err
	}

	return au, nil
}

func (c *Core) sendVerificationCode(email string, authID ID) error {
	if email == "" {
		return fmt.Errorf("email is required to send verification code")
	}

	// Generate and set verification code.
	au := &Auth{ID: authID, VerificationCode: generateVerifyCode()}
	if err := c.store.Update(au); err != nil {
		return err
	}

	go func() {
		err := c.mail.SendHTML(
			[]string{email},
			mailVerfCodeSubj,
			mailVerfCodeTmpl,
			map[string]interface{}{
				"code": au.VerificationCode,
			},
		)
		if err != nil {
			c.logger.Errorln("could not send verification code:", err)
		}
	}()
	return nil
}

// VerifyParams represents parameters to verify an account.
type VerifyParams struct {
	Username string `json:"username"`
	Code     string `json:"code"`
}

func (p VerifyParams) validate() error {
	p.Username = strings.TrimSpace(p.Username)
	p.Code = strings.TrimSpace(p.Code)
	if p.Username == "" || p.Code == "" {
		return AuthErrVerificationReqFields
	}

	return nil
}

// VerifyAuth verifies account ownership by code.
func (c *Core) VerifyAuth(p VerifyParams) (*Auth, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	// Find existence if username and verification code.
	au, err := c.Auth(AuthFilter{
		Username:         p.Username,
		VerificationCode: p.Code,
		Level:            AuthLevelPending,
	})
	if err != nil {
		return nil, err
	}

	// Verifies auth access and updates to datastore.
	n := time.Now()
	au.Level = AuthLevelVerified
	au.VerifiedAt = &n
	if err = c.store.Update(au); err != nil {
		return nil, err
	}

	// TODO remove all other existing email.

	return au, nil
}

// AuthByRefreshToken returns auth details by refresh token.
//
// Invalid token or empty token returns AuthErrInvalidRefreshToken error.
func (c *Core) AuthByRefreshToken(refreshToken string) (*Auth, error) {
	if strings.TrimSpace(refreshToken) == "" {
		return nil, AuthErrInvalidRefreshToken
	}

	au, err := c.Auth(AuthFilter{RefreshToken: refreshToken})
	if err != nil {
		return nil, AuthErrInvalidRefreshToken
	}

	return au, nil
}

// RevokeRefreshToken invalidates refresh token and generates a new one.
func (c *Core) RevokeRefreshToken(refreshToken string) error {
	au, err := c.AuthByRefreshToken(refreshToken)
	if err != nil {
		return err
	}

	au.RefreshToken = generateSha1()
	return c.store.Update(au)
}

// LoginParams represents parameters for authenticating access.
type LoginParams struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (p LoginParams) validate() error {
	p.Username = strings.TrimSpace(p.Username)
	p.Password = strings.TrimSpace(p.Password)

	if p.Username == "" || p.Password == "" {
		return AuthErrLoginReqFields
	}

	return nil
}

// LoginAuth validates username and password and returns auth details.
func (c *Core) LoginAuth(p LoginParams) (*Auth, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	au, err := c.Auth(AuthFilter{Username: p.Username, Level: AuthLevelVerified})
	if err != nil {
		return nil, AuthErrInvalidLogin
	}
	if au.Password != hashPassword(au.UserID, p.Password) {
		return nil, AuthErrInvalidLogin
	}

	return au, nil
}

// authCreateParam represents auth params for create operation.
type authCreateParam struct {
	UserID   ID     `json:"user_id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func (p authCreateParam) validate() error {
	if p.UserID.IsEmpty() {
		return AuthErrRequiredUserID
	}

	p.Username = strings.TrimSpace(p.Username)
	p.Password = strings.TrimSpace(p.Password)
	if p.Username == "" || p.Password == "" {
		return AuthErrLoginReqFields
	}

	return nil
}

// CreateAuth creates new authentication access.
func (c *Core) CreateAuth(p authCreateParam) (*Auth, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	// Formats data and set defaults values.
	au := &Auth{
		UserID:   p.UserID,
		Username: p.Username,
		Password: p.Password,
	}
	au = au.setDefaults()
	if err := c.store.Create(au); err != nil {
		return nil, err
	}

	return au, nil
}

const hashSalt = "C1r1LLa"

func hashSha1(s string) string {
	h := sha1.New()
	h.Write([]byte(hashSalt + s))
	return hex.EncodeToString(h.Sum(nil))
}

func generateSha1() string {
	t := time.Now().UnixNano()
	return hashSha1(fmt.Sprintf("%s %d", hashSalt, t))
}

func generateVerifyCode() string {
	return strings.ToUpper(generateSha1()[:6])
}

func hashPassword(userID ID, password string) string {
	return hashSha1(fmt.Sprintf("%s-%s", userID, password))
}

type ctxKey int

const authKey ctxKey = iota

// AuthToContext sets auth details to context.
func AuthToContext(parent context.Context, au *Auth) context.Context {
	return context.WithValue(parent, authKey, au)
}

// AuthFromContext returns an auth details from the given context if one is present.
// Return nil if auth detail cannot be found.
func AuthFromContext(ctx context.Context) *Auth {
	if ctx == nil {
		return nil
	}
	if au, ok := ctx.Value(authKey).(*Auth); ok {
		return au
	}
	return nil
}
