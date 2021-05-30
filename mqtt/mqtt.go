package mqtt

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"sync/atomic"
	"time"

	"github.com/256dpi/gomqtt/broker"
	"github.com/256dpi/gomqtt/client"
	"github.com/256dpi/gomqtt/packet"
	"github.com/256dpi/gomqtt/transport"
)

const serverClientID = "server"

// Service represents MQTT broker and client for handling device connection.
type Service struct {
	client         *client.Client
	config         Config
	stats          Stats
	closeFn        func() error
	activeClientFn func(clientID string)
}

// Config is a MQTT service configuration.
type Config struct {
	Addr string

	SessionQueueSize   int
	ParallelPublishes  int
	ParallelSubscribes int
	InflightMessages   int
	TokenTimeoutSec    int64
}

// Stats is a MQTT service stats.
type Stats struct {
	Published     int32
	Forwarded     int32
	ActiveClients map[string]time.Time
}

// New create new instance of MQTT service implementation.
func New(conf Config) (*Service, error) {
	var service Service

	// launch server
	server, err := transport.Launch(conf.Addr)
	if err != nil {
		return nil, err
	}

	// prepare backend and configure logger
	backend := newBackend(conf)
	backend.Logger = service.eventHandler

	// prepare engine
	engine := broker.NewEngine(backend)

	// prepare server client for publishing outbox to device
	serverClient := client.New()
	cid := fmt.Sprintf("%s-%d", serverClientID, time.Now().Unix())
	_, err = serverClient.Connect(client.NewConfigWithClientID(conf.Addr, cid))
	if err != nil {
		return nil, err
	}

	engine.Accept(server)

	// compose service
	service.config = conf
	service.client = serverClient
	service.stats.ActiveClients = map[string]time.Time{}
	service.activeClientFn = func(string) {}
	service.closeFn = func() error {
		if err = serverClient.Disconnect(); err != nil {
			return fmt.Errorf("closing client error")
		}

		if !backend.Close(2 * time.Second) {
			return fmt.Errorf("closing backend timed-out")
		}

		if err = server.Close(); err != nil {
			return err
		}

		engine.Close()
		return nil
	}
	return &service, nil
}

// Close closes all connections created by service.
func (s *Service) Close() error {
	return s.closeFn()
}

// Forward commands device to send an outgoing message.
func (s *Service) Forward(topicID, msgID, targetAddr, text string) error {
	payload := map[string]interface{}{
		"id":      msgID,
		"address": targetAddr,
		"text":    text,
	}
	b, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	pf, err := s.client.Publish(topicID, b, 2, false)
	if err != nil {
		return err
	}

	return pf.Wait(5 * time.Second)
}

// Ping sends a ping message for testing device connection to service.
func (s *Service) Ping(topicID string) error {
	t := time.Now()
	pf, err := s.client.Publish(topicID, []byte(fmt.Sprintf("pinged at %s", t)), 2, false)
	if err != nil {
		return err
	}

	return pf.Wait(5 * time.Second)
}

// ActiveHandler callback triggers when device is connected and responded on ping.
func (s *Service) ActiveHandler(fn func(string)) {
	s.activeClientFn = func(clientID string) {
		// Skip server client ID.
		if strings.HasPrefix(clientID, serverClientID) {
			return
		}

		fn(clientID)
	}
}

func (s *Service) eventHandler(evt broker.LogEvent, bcl *broker.Client, pkt packet.Generic, msg *packet.Message, err error) {
	stats := s.stats
	//printEvent(evt, bcl, pkt, msg, err)

	if evt == broker.MessagePublished {
		atomic.AddInt32(&stats.Published, 1)
	} else if evt == broker.MessageForwarded {
		// TODO! it can be use to flag the message as sent.
		atomic.AddInt32(&stats.Forwarded, 1)
	}

	if evt == broker.PacketReceived && pkt.Type() == packet.CONNECT {
		pc := pkt.(*packet.Connect)
		stats.ActiveClients[pc.ClientID] = time.Now()
		s.activeClientFn(pc.ClientID)
	} else if evt == broker.PacketSent && pkt.Type() == packet.PINGRESP {
		stats.ActiveClients[bcl.ID()] = time.Now()
		s.activeClientFn(bcl.ID())
	} else if evt == broker.LostConnection {
		delete(stats.ActiveClients, bcl.ID())
	}
}

func newBackend(conf Config) *broker.MemoryBackend {
	b := broker.NewMemoryBackend()
	b.SessionQueueSize = 100
	b.ClientParallelPublishes = 100
	b.ClientParallelSubscribes = 100
	b.ClientInflightMessages = 100
	b.ClientTokenTimeout = 2 * time.Second

	if conf.SessionQueueSize != 0 {
		b.SessionQueueSize = conf.SessionQueueSize
	}
	if conf.ParallelPublishes != 0 {
		b.ClientParallelPublishes = conf.ParallelPublishes
	}
	if conf.ParallelSubscribes != 0 {
		b.ClientParallelSubscribes = conf.ParallelSubscribes
	}
	if conf.InflightMessages != 0 {
		b.ClientInflightMessages = conf.InflightMessages
	}
	if conf.TokenTimeoutSec != 0 {
		b.ClientTokenTimeout = time.Duration(conf.TokenTimeoutSec) * time.Second
	}

	return b
}

func printEvent(evt broker.LogEvent, bcl *broker.Client, pkt packet.Generic, msg *packet.Message, err error) {
	log.Println("-----------------------------------------")
	log.Println(strings.ToUpper(fmt.Sprintf("%s", evt)))
	log.Println("-----------------------------------------")
	log.Println("clientid: \t", bcl.ID())
	log.Println("packet: \t", pkt)
	log.Println("message: \t", msg)
	log.Println("error: \t", err)
	log.Println("")
}
