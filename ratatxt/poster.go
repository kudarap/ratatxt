package ratatxt

// Poster sends post request to payload url.
type Poster interface {
	// Post sends a POST request with application/json content-type.
	Post(payloadURL string, payload interface{}) (statusCode int, err error)
}
