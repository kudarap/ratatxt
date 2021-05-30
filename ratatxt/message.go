package ratatxt

import (
	"fmt"
	"strings"
	"time"
)

// Message errors types.
const (
	MessageErrNotFound Errors = iota + 4000
	MessageErrRequiredID
)

// Message error definition
func init() {
	errorsText[MessageErrNotFound] = "message not found"
	errorsText[MessageErrRequiredID] = "message id is required"
}

// MessageKind represents message kind.
type MessageKind uint

const (
	MessageKindInbox  MessageKind = 10
	MessageKindOutbox MessageKind = 20
)

// MessageStatus represents message status.
type MessageStatus uint

// Inbox message statuses.
const (
	MessageStatusInboxNew    MessageStatus = 110
	MessageStatusInboxRead   MessageStatus = 120
	MessageStatusInboxFailed MessageStatus = 140
	MessageStatusInboxError  MessageStatus = 150
)

// Outbox message statuses.
const (
	MessageStatusOutboxQueued  MessageStatus = 200
	MessageStatusOutboxSending MessageStatus = 210
	MessageStatusOutboxSent    MessageStatus = 220
	MessageStatusOutboxFailed  MessageStatus = 240
	MessageStatusOutboxError   MessageStatus = 250
)

// Message represents user's message information.
type Message struct {
	ID         ID            `json:"id" gorm:"primaryKey;type:CHAR(20)"`
	UserID     ID            `json:"user_id"`
	DeviceID   ID            `json:"device_id"`
	Kind       MessageKind   `json:"kind"`
	Status     MessageStatus `json:"status"`
	Address    string        `json:"address"`
	Text       string        `json:"text"`
	Timestamp  int64         `json:"timestamp"`
	RetryCount int           `json:"retry_count"`
	CreatedAt  time.Time     `json:"created_at"`
	UpdatedAt  time.Time     `json:"updated_at"`

	Device *Device `json:"device,omitempty" gorm:"-"`
}

func (m Message) setDefaults() *Message {
	switch m.Kind {
	case MessageKindInbox:
		m.Status = MessageStatusInboxNew
	case MessageKindOutbox:
		m.Status = MessageStatusOutboxQueued
	}

	if m.Timestamp == 0 {
		m.Timestamp = time.Now().Unix() * 1000
	}

	return &m
}

// MessageFilter represents message filter.
type MessageFilter struct {
	ID       ID            `db:"id,omitempty"`
	UserID   ID            `db:"user_id,omitempty"`
	DeviceID ID            `db:"device_id,omitempty"`
	Kind     MessageKind   `db:"kind,omitempty"`
	Status   MessageStatus `db:"status,omitempty"`
	Address  string        `db:"address,omitempty"`
}

// Messages returns a list of messages by filter.
func (c *Core) Messages(f *MessageFilter) ([]*Message, error) {
	var list []*Message
	if err := c.store.List(&list, f); err != nil {
		return nil, err
	}

	return list, nil
}

// Message returns message details by filter and returns error if no result.
func (c *Core) Message(f MessageFilter) (*Message, error) {
	list, err := c.Messages(&f)
	if err != nil {
		return nil, err
	}
	if len(list) == 0 {
		return nil, DeviceErrNotFound
	}

	msg := list[0]
	msg.Device, _ = c.Device(DeviceFilter{ID: msg.DeviceID})
	return msg, nil
}

// MessageByID returns message details by id.
func (c *Core) MessageByID(id ID) (*Message, error) {
	return c.Message(MessageFilter{ID: id})
}

// MessageCreateParam represents parameters to create a message.
type MessageCreateParam struct {
	UserID    ID            `json:"user_id"`
	DeviceID  ID            `json:"device_id"`
	Kind      MessageKind   `json:"kind"`
	Status    MessageStatus `json:"status"`
	Address   string        `json:"address"`
	Text      string        `json:"text"`
	Timestamp int64         `json:"timestamp"`
}

func (p *MessageCreateParam) validate() error {
	if p.UserID.IsEmpty() {
		return fmt.Errorf("user_id is required")
	}

	p.Address = strings.TrimSpace(p.Address)
	p.Text = strings.TrimSpace(p.Text)
	if p.DeviceID.IsEmpty() || p.Address == "" || p.Text == "" ||
		p.Kind == 0 {
		return fmt.Errorf("device_id, address, and text are required")
	}

	return nil
}

// CreateMessage creates new message to datastore.
func (c *Core) CreateMessage(p MessageCreateParam) (*Message, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	// Check a valid device id.
	if _, err := c.DeviceByID(p.DeviceID); err != nil {
		return nil, err
	}

	// Set default values and create new device record.
	msg := &Message{
		UserID:    p.UserID,
		DeviceID:  p.DeviceID,
		Kind:      p.Kind,
		Status:    p.Status,
		Address:   p.Address,
		Text:      p.Text,
		Timestamp: p.Timestamp,
	}
	msg = msg.setDefaults()
	if err := c.store.Create(msg); err != nil {
		return nil, err
	}

	return msg, nil
}

// PushInbox creates new inbox kind message and notifies device owners registered webhooks.
func (c *Core) PushInbox(p MessageCreateParam) (*Message, error) {
	p.Kind = MessageKindInbox
	msg, err := c.CreateMessage(p)
	if err != nil {
		return nil, err
	}

	go c.sendWebhookPayload(*msg)

	return msg, nil
}

// SendOutbox creates new outbox kind message and send command to device to send SMS.
func (c *Core) SendOutbox(p MessageCreateParam) (*Message, error) {
	p.Kind = MessageKindOutbox
	msg, err := c.CreateMessage(p)
	if err != nil {
		return nil, err
	}

	// Send command to device to send the SMS.
	dev, err := c.DeviceByID(msg.DeviceID)
	if err != nil {
		return nil, err
	}
	topicID, err := dev.topicID()
	if err != nil {
		return nil, err
	}
	if err = c.deviceCmd.Forward(topicID, msg.ID.String(), msg.Address, msg.Text); err != nil {
		return nil, err
	}

	return msg, nil
}

// OutboxUpdateParam represents parameters to update an outbox message.
type OutboxUpdateParam struct {
	ID     ID            `json:"id"`
	UserID ID            `json:"user_id"`
	Status MessageStatus `json:"status"`
}

func (p *OutboxUpdateParam) validate() error {
	if p.UserID.IsEmpty() {
		return fmt.Errorf("user_id is required")
	}

	if p.ID.IsEmpty() || p.Status == 0 {
		return fmt.Errorf("id, user_id, status are required")
	}

	return nil
}

// UpdateOutbox updates existing message outbox to datastore.
func (c *Core) UpdateOutbox(p OutboxUpdateParam) (*Message, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	// Check message ownership.
	cur, err := c.Message(MessageFilter{ID: p.ID, UserID: p.UserID, Kind: MessageKindOutbox})
	if err != nil {
		return nil, err
	}
	if cur == nil {
		return nil, MessageErrNotFound
	}

	// Update message record.
	return c.updateMessageStatusByID(p.ID, p.Status)
}

func (c *Core) updateMessageStatusByID(id ID, s MessageStatus) (*Message, error) {
	msg := &Message{ID: id, Status: s}
	if err := c.store.Update(msg); err != nil {
		return nil, err
	}

	go c.sendWebhookPayload(*msg)

	return msg, nil
}

func (c *Core) sendWebhookPayload(m Message) {
	m.Device, _ = c.Device(DeviceFilter{ID: m.DeviceID})
	if errs := c.shootWebhooks(m); errs != nil {
		for _, err := range errs {
			c.logger.Error("send webhook payload errors:", err)
		}
	}
}

func (c *Core) retrySendOutbox(id ID) error {
	msg, err := c.MessageByID(id)
	if err != nil {
		return err
	}

	msg.Status = MessageStatusOutboxQueued
	msg.RetryCount++

	// Requeue on device command to forward.

	return c.store.Update(msg)
}

var messageSearchKeywordFields = []string{"id", "address", "text"}

// SearchMessages returns a list of messages and metadata base on search options.
func (c *Core) SearchMessages(opts *SearchOpts) ([]*Message, *SearchMetadata, error) {
	if opts != nil {
		opts.KeywordFields = messageSearchKeywordFields
	}

	var list []*Message
	meta, err := c.store.Search(&list, opts)
	if err != nil {
		return nil, nil, err
	}

	for i, msg := range list {
		list[i].Device, _ = c.Device(DeviceFilter{ID: msg.DeviceID})
	}

	return list, meta, nil
}
