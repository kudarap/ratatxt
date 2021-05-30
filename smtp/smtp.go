package smtp

import (
	"fmt"
	"html/template"
	"io"
	"log"
	"strings"
	"time"

	"github.com/kudarap/ratatxt/assets/mail"
	"gopkg.in/gomail.v2"
)

const (
	defaultSMTPPort = 587
	connTimeout     = 30 * time.Second
)

// Client represents SMTP for sending mail.
type Client struct {
	dialer *gomail.Dialer

	msgCh chan *gomail.Message // msgCh is message channel for accepting new mail to send.
	errCh chan error           // errCh is error channel for handling errors from daemon.

	cfg  Config             // cfg contains SMTP settings.
	tmpl *template.Template // tmpl contains parsed glob templates.

	DefaultTmplData map[string]interface{} // DefaultTmplData stores default data for templates.
}

// Config represents SMTP credentials and template path.
type Config struct {
	// Login credentials.
	Addr string
	Port int
	User string
	Pass string
	// Display name.
	Name string
	// HTML template path
	Tmpl string
}

// New starts a daemon channel and receives and send messages.
func New(cfg Config) (*Client, error) {
	if cfg.Port == 0 {
		cfg.Port = defaultSMTPPort
	}

	c := &Client{}
	c.cfg = cfg
	c.dialer = gomail.NewDialer(cfg.Addr, cfg.Port, cfg.User, cfg.Pass)
	c.msgCh = make(chan *gomail.Message)
	c.errCh = make(chan error)

	if err := c.SetTemplatePath(cfg.Tmpl); err != nil {
		return nil, err
	}

	// Set up the daemon that receives mails to send.
	go c.startDaemon()
	return c, nil
}

func (c *Client) startDaemon() {
	var sendCloser gomail.SendCloser
	var err error
	var open bool

	for {
		select {
		// Receives new message to send.
		case m, ok := <-c.msgCh:
			// Checks closed message channel and stop the daemon.
			if !ok {
				return
			}
			// Check opened SMTP connection and try to open a new one if closed.
			if !open {
				if sendCloser, err = c.dialer.Dial(); err != nil {
					// TODO report to event log.
					err := fmt.Errorf("could not dial connection: %s", err)
					c.errCh <- err
					break
				}
				open = true
			}
			// Sending mail and trying to catch error.
			if err := gomail.Send(sendCloser, m); err != nil {
				// TODO report to event log.
				c.errCh <- fmt.Errorf("sending failed due to %s", err)
				break
			}
			// Mail successfully sent.
			c.errCh <- nil

		// Close the connection to the SMTP server if no email was sent in the last 30 seconds.
		case <-time.After(connTimeout):
			if open {
				out("trying to close opened connection after %s", connTimeout)
				if err := sendCloser.Close(); err != nil {
					out("could not close connection: %s", err)
					// TODO report to event log.
					panic(err)
				}
				open = false
			}
		}
	}
}

// Send a simple text email.
func (c *Client) Send(to []string, subject, text string) error {
	m := c.newMsg(subject, to)
	m.SetBody("text/html", text)
	c.msgCh <- m
	return <-c.errCh
}

// SendHTML sends an email with HTML header.
// Provided template data will override default template data.
func (c *Client) SendHTML(to []string, subject, tmpl string, data map[string]interface{}) error {
	var err error
	m := c.newMsg(subject, to)
	m.AddAlternativeWriter("text/html", func(w io.Writer) error {
		// Initialize data with empty map when its null.
		if data == nil {
			data = map[string]interface{}{}
		}
		// Add default template data to data param.
		for k, v := range c.DefaultTmplData {
			if _, ok := data[k]; ok {
				continue
			}

			data[k] = v
		}
		// Add subject to template data.
		data["subject"] = subject

		// Check template existence.
		t := c.tmpl.Lookup(tmpl)
		if t == nil {
			err = fmt.Errorf("could not find template file: %s", tmpl)
		} else {
			err = t.Execute(w, data)
		}

		return err
	})
	if err != nil {
		return err
	}

	c.msgCh <- m
	return <-c.errCh
}

// Close daemon will not accepting email to send.
func (c *Client) Close() {
	close(c.msgCh)
}

// SetTemplatePath set template path location and parses them.
// Uses embedded mail templates if path is not set.
func (c *Client) SetTemplatePath(path string) error {
	// Fallback to embedded default template if not path is not defined.
	if strings.TrimSpace(path) == "" {
		c.tmpl = mail.Templates
		return nil
	}

	t, err := template.ParseGlob(path)
	if err != nil {
		return err
	}

	c.tmpl = t
	return nil
}

func (c *Client) newMsg(subject string, to []string) *gomail.Message {
	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(c.cfg.User, c.cfg.Name))
	m.SetHeader("To", to...)
	m.SetHeader("Subject", subject)
	return m
}

func out(format string, v ...interface{}) {
	format = "[smtp] " + format
	log.Printf(format, v...)
}
