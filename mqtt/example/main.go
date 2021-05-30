package main

import (
	"log"
	"math/rand"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/kudarap/ratatxt/mqtt"
)

func main() {
	mc, err := mqtt.New(mqtt.Config{Addr: "tcp://0.0.0.0:1883"})
	if err != nil {
		log.Fatalln("could not init:", err)
	}

	rand.Seed(time.Now().Unix())
	for {
		if err = mc.Ping("test"); err != nil {
			log.Fatalln("could not ping:", err)
		}

		time.Sleep(time.Minute * time.Duration(rand.Int63n(10)+2))
	}

	// await finish signal
	finish := make(chan os.Signal, 1)
	signal.Notify(finish, syscall.SIGINT, syscall.SIGTERM)
	<-finish

	mc.Close()
}
