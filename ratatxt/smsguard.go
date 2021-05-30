package ratatxt

import (
	"fmt"
	"strings"
	"time"

	"github.com/kudarap/ratatxt/smsguard"
)

const SMSGuardDefaultDuration = time.Minute * 10

// SMSGuard errors types.
const (
	SMSGuardErrNotFound Errors = iota + 9000
	SMSGuardErrRequiredID
	SMSGuardErrRequiredUserID
	SMSGuardErrReqFields
)

// SMSGuard error definition
func init() {
	errorsText[SMSGuardErrNotFound] = "sms-guard not found"
	errorsText[SMSGuardErrRequiredID] = "sms-guard id is required"
	errorsText[SMSGuardErrRequiredUserID] = "sms-guard user_id is required"
	errorsText[SMSGuardErrReqFields] = "sms-guard device_id and address are required"
}

// SMSGuardCreateParam represents parameters to create a sms-guard code.
type SMSGuardCreateParam struct {
	UserID   ID     `json:"user_id"`
	DeviceID ID     `json:"device_id"`
	Address  string `json:"address"`
	From     string `json:"from"`
	Minutes  int    `json:"duration_min"`
}

func (p SMSGuardCreateParam) validate() error {
	if p.UserID.IsEmpty() {
		return SMSGuardErrRequiredUserID
	}

	p.Address = strings.TrimSpace(p.Address)
	if p.DeviceID.IsEmpty() || p.Address == "" {
		return SMSGuardErrReqFields
	}

	p.From = strings.TrimSpace(p.From)
	return nil
}

// SendSMSGuard generates code and send to address.
func (c *Core) SendSMSGuard(p SMSGuardCreateParam) (code string, expr time.Time, err error) {
	if err = p.validate(); err != nil {
		return
	}

	dur := SMSGuardDefaultDuration
	if p.Minutes != 0 {
		dur = time.Minute * time.Duration(p.Minutes)
	}
	expr = time.Now().Add(dur)

	code = smsguard.New(dur, p.UserID.String(), p.Address)
	text := fmt.Sprintf("%s is your %s verification code.", code, p.From)
	_, err = c.SendOutbox(MessageCreateParam{
		UserID:   p.UserID,
		DeviceID: p.DeviceID,
		Address:  p.Address,
		Text:     text,
	})
	return
}
