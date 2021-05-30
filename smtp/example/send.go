package main

import (
	"github.com/kudarap/ratatxt/smtp"
	log "github.com/sirupsen/logrus"
)

var (
	cfg = smtp.Config{
		Addr: "smtp.live.com",
		Port: 587,
		User: "dev@chiligarlic.com",
		Pass: "XXXXXXXXXX",
		Name: "Ratatxt",
		Tmpl: "./tmpl/*.html",
	}

	recipient = []string{"javinczki02@gmail.com"}
)

func main() {
	mail, err := smtp.New(cfg)
	if err != nil {
		log.Fatalln("could not set up client", err)
	}

	if err := mail.Send(recipient, "test send", "hello"); err != nil {
		log.Fatalln("could not send:", err)
	}

	if err := mail.SendHTML(recipient, "test html", "hello.html", map[string]interface{}{
		"name": "kudarap",
	}); err != nil {
		log.Fatalln("could not send:", err)
	}

	log.Println("mails sent!")
}
