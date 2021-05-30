package main

import (
	"github.com/fatih/structs"
	"github.com/kudarap/ratatxt/fcm"
	log "github.com/sirupsen/logrus"
)

const apiKey = "XXXXX"

func main() {
	f, err := fcm.New(apiKey)
	if err != nil {
		log.Fatalln("could not create new fcm:", err)
	}

	data := structs.New(struct {
		ID   string `json:"id"`
		Addr string `json:"address"`
		Text string `json:"text"`
	}{
		"TESTID102",
		"this is a test message",
		"test",
	})
	data.TagName = "json"

	// xNova device
	testTopic := "3ef02459-2a3e-4487-97d7-d9b0e6d41267.0e44c84f-1f2a-4d89-94c9-d10acebb7975"

	if err = f.Send(testTopic, data.Map()); err != nil {
		log.Fatalln("could not send msg:", err)
	}

	log.Println("msg sent!")
}
