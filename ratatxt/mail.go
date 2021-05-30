package ratatxt

// Mailer represents mail interface.
type Mailer interface {
	// Send a simple text email.
	Send(to []string, subject, text string) error
	// SendHTML sends an email with HTML header.
	SendHTML(to []string, subject, tmpl string, data map[string]interface{}) error
}

// Email templates and subjects.
const (
	mailHelloSubj = "Test Email"
	mailHelloTmpl = "hello.html"

	mailVerfCodeSubj = "Ratatxt Verification Code"
	mailVerfCodeTmpl = "verification_code.html"
)
