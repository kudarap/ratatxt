package webhook

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"
)

const (
	contentType = "application/json"
	reqTimeout  = time.Second * 10
	maxIdleConn = 100
)

var (
	ErrChanNotOpen = errors.New("channel not open")
	ErrPostReq     = errors.New("could not send payload")
)

type payload struct {
	url  string
	body *bytes.Buffer
}

type response struct {
	code  int
	error error
}

// Client represents notify channel.
type Client struct {
	httpClient *http.Client

	payloadCh  chan payload
	responseCh chan response
}

// New create new client and start notify channel.
func New() *Client {
	c := &Client{
		&http.Client{
			Timeout: reqTimeout,
			Transport: &http.Transport{
				MaxIdleConnsPerHost: maxIdleConn,
			},
		},
		make(chan payload),
		make(chan response),
	}

	go c.start()
	return c
}

// Post sends a POST request with application/json content-type.
func (c *Client) Post(url string, data interface{}) (statusCode int, err error) {
	b, err := json.Marshal(data)
	if err != nil {
		return
	}

	c.payloadCh <- payload{url, bytes.NewBuffer(b)}
	res := <-c.responseCh
	return res.code, res.error
}

// start handles the queue of payload to send over http client.
func (c *Client) start() {
	for {
		select {
		case p, ok := <-c.payloadCh:
			if !ok {
				log.Printf("[webhook] %s", ErrChanNotOpen)
				return
			}

			res := c.postReq(p)
			if res.error != nil {
				log.Printf("[webhook] %s: %s to %s", ErrPostReq, res.error, p.url)
			}

			c.responseCh <- res
		}
	}
}

func (c *Client) postReq(p payload) response {
	res, err := c.httpClient.Post(p.url, contentType, p.body)
	if err != nil {
		return response{error: err}
	}
	defer res.Body.Close()

	return response{res.StatusCode, nil}
}
