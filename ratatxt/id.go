package ratatxt

import (
	"github.com/rs/xid"
)

// ID represents entity unique identifier.
type ID string

// NewID generates new id.
func NewID() ID {
	return ID(xid.New().String())
}

// IsEmpty detects id if has zero value.
func (i ID) IsEmpty() bool {
	return i == ""
}

// String returns string value of id.
func (i ID) String() string {
	return string(i)
}
