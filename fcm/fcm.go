package fcm

import (
	"log"

	"github.com/appleboy/go-fcm"
)

// Config represents FCM config.
type Config struct {
	APIKey string
}

// Client represents http client that manages JSON payload.
type Client struct {
	fcm *fcm.Client

	msgCh chan *fcm.Message
	errCh chan error
}

// New starts a daemon fcm channel that receives and post
// payload data.
func New(apiKey string) (*Client, error) {
	f, err := fcm.NewClient(apiKey)
	if err != nil {
		return nil, err
	}

	c := &Client{f, make(chan *fcm.Message), make(chan error)}

	go c.startDaemon()
	return c, nil
}

func (c *Client) startDaemon() {
	for {
		select {
		case m, ok := <-c.msgCh:
			if !ok {
				log.Print("[fcm] channel not open")
				return
			}

			res, err := c.fcm.Send(m)
			if err != nil {
				log.Printf("[fcm] send [%s] failed %s", m.To, err)
				c.errCh <- err
				return
			}

			log.Printf("[fcm] send [%s] success %s", m.To, m.Data["id"])
			log.Printf("[fcm] resp data %#v", res)
			c.errCh <- nil
		}
	}
}

const fcmMsgPriority = "high"

func (c *Client) Forward(topicID, msgID, address, text string) error {
	return c.Send(topicID, map[string]interface{}{
		"id":      msgID,
		"address": address,
		"text":    text,
	})
}

func (c *Client) Ping(topicID string) error {
	return c.Send(topicID, map[string]interface{}{
		"id": "PING",
	})
}

func (c *Client) Send(topic string, data map[string]interface{}) error {
	c.msgCh <- &fcm.Message{
		Priority: fcmMsgPriority,
		To:       "/topics/" + topic,
		Data:     data,
	}

	return <-c.errCh
}

//// Send topic payload.
//func (c *Client) Send(topic string, data interface{}) error {
//	s := structs.New(data)
//	s.TagName = "json"
//	c.msgCh <- &fcm.Message{
//		To:       "/topics/" + topic,
//		Priority: fcmMsgPriority,
//		Data:     s.Map(),
//	}
//
//	return <-c.errCh
//}
