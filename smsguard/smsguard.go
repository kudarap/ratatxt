package smsguard

import (
	"fmt"
	"strings"
	"time"

	"github.com/speps/go-hashids"
)

// New create new sms-guard code.
func New(validity time.Duration, seed ...string) string {
	diff := todayTimeDiff(validity)
	return enHash(diff, strings.Join(seed, ""))
}

// IsValid checks sms-guard code validity.
func IsValid(code string, seed ...string) (ok bool) {
	diff, err := deHash(code, strings.Join(seed, ""))
	if err != nil {
		return false
	}

	baseDiff := todayTimeDiff(0)
	return baseDiff <= diff
}

func todayTime() time.Time {
	now := time.Now()
	t := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)
	return t
}

func todayTimeDiff(dur time.Duration) int {
	tt := todayTime()
	vt := time.Now().Add(dur)
	return int(vt.Unix() - tt.Unix())
}

func enHash(timeDiff int, seed string) string {
	h, _ := hashids.NewWithData(hashData(seed))
	e, _ := h.Encode([]int{timeDiff})
	return e
}

func deHash(hash string, seed string) (int, error) {
	h, _ := hashids.NewWithData(hashData(seed))
	d, err := h.DecodeWithError(hash)
	if err != nil {
		return 0, err
	}
	if len(d) == 0 {
		return 0, fmt.Errorf("no data")
	}

	return d[0], nil
}

func hashData(salt string) *hashids.HashIDData {
	hd := hashids.NewData()
	hd.Salt = salt
	hd.Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
	hd.MinLength = 5
	return hd
}
