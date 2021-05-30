package ratatxt

//go:generate stringer -type=Errors -output=errors_string.go

var errorsText = map[Errors]string{}

// Errors represents error.
type Errors uint

// Error implements error interface.
func (i Errors) Error() string {
	return errorsText[i]
}

// Code returns error code.
func (i Errors) Code() string {
	return i.String()
}
