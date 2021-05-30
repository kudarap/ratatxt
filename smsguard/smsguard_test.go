package smsguard

import (
	"testing"
	"time"
)

func TestGenVerifyCode(t *testing.T) {
	tests := []struct {
		validity  time.Duration
		seed      string
		seedCheck string
		sleep     time.Duration
		valid     bool
	}{
		{0, "", "", 0, true},
		{3, "", "", 0, true},
		{3, "", "", 3, true},
		{3, "", "", 5, false},
		{0, "", "", 3, false},
		// with seed test
		{0, "aaa", "aaa", 0, true},
		{3, "bbb", "bbb", 0, true},
		{3, "ccc", "ccc", 3, true},
		{3, "ddd", "ddd", 5, false},
		{0, "eee", "eee", 3, false},
		{5, "xyz", "abc", 0, false},
		{0, "xyz", "abc", 2, false},
	}

	const baseDuration = time.Second
	for i, tt := range tests {
		code := New(baseDuration*tt.validity, tt.seed)
		t.Log(code)
		time.Sleep(baseDuration * tt.sleep)
		if tt.valid != IsValid(code, tt.seedCheck) {
			t.Errorf("%d) code check not matched! want: %v have: %v", i, tt.valid, IsValid(code))
		}
	}

	return
}
