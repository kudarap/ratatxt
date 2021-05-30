package ratatxt

import (
	"fmt"
	"strings"
	"time"
)

// Device errors types.
const (
	DeviceErrNotFound Errors = iota + 3000
	DeviceErrRequiredID
	DeviceErrRequiredUserID
	DeviceErrRequiredFields
	DeviceErrDupName
)

// Device error definition
func init() {
	errorsText[DeviceErrNotFound] = "device not found"
	errorsText[DeviceErrRequiredID] = "device id is required"
	errorsText[DeviceErrRequiredUserID] = "device user_id is required"
	errorsText[DeviceErrRequiredFields] = "device name and address are required"
	errorsText[DeviceErrDupName] = "device name already exists"
}

// Device statuses.
const (
	DeviceStatusActive   DeviceStatus = 20 // Default device status
	DeviceStatusDisabled DeviceStatus = 40 // Disables device and stop all process.
)

// Device represents user device information.
type Device struct {
	ID         ID           `json:"id" gorm:"primaryKey;type:CHAR(20)"`
	UserID     ID           `json:"user_id"`
	Name       string       `json:"name"`
	Address    string       `json:"address"`
	Status     DeviceStatus `json:"status"`
	LastActive *time.Time   `json:"last_active"`
	CreatedAt  time.Time    `json:"created_at"`
	UpdatedAt  time.Time    `json:"updated_at"`
}

func (d Device) topicID() (id string, err error) {
	if d.UserID.IsEmpty() || d.ID.IsEmpty() {
		err = fmt.Errorf("device and user id is required to get topic id")
		return
	}

	id = fmt.Sprintf("%s/%s", d.UserID, d.ID)
	return
}

func (d Device) setDefaults() *Device {
	if d.Status == 0 {
		d.Status = DeviceStatusActive
	}

	return &d
}

// DeviceStatus represents device status.
type DeviceStatus uint

var deviceStatusText = map[DeviceStatus]string{
	DeviceStatusDisabled: "DISABLED",
	DeviceStatusActive:   "ACTIVE",
}

// String returns string value of DeviceStatus.
func (s DeviceStatus) String() string {
	return deviceStatusText[s]
}

// UnmarshalJSON decodes json to DeviceStatus value.
//func (s *DeviceStatus) UnmarshalJSON(b []byte) error {
//	var str string
//	if err := json.Unmarshal(b, &str); err != nil {
//		return err
//	}
//
//	for typ, txt := range deviceStatusText {
//		if txt == str {
//			*s = typ
//			return nil
//		}
//	}
//
//	return nil
//}

// MarshalJSON encodes DeviceStatus to its json value.
//func (s DeviceStatus) MarshalJSON() ([]byte, error) {
//	return []byte(`"` + s.String() + `"`), nil
//}

// DeviceFilter represents device filter.
type DeviceFilter struct {
	ID      ID           `db:"id,omitempty"`
	UserID  ID           `db:"user_id,omitempty"`
	Name    string       `db:"name,omitempty"`
	Address string       `db:"address,omitempty"`
	Status  DeviceStatus `db:"status,omitempty"`
}

// Devices returns a list of devices by filter.
func (c *Core) Devices(f *DeviceFilter) ([]*Device, error) {
	var list []*Device
	if err := c.store.List(&list, f); err != nil {
		return nil, err
	}

	return list, nil
}

// Device returns device details by filter and returns error if no result.
func (c *Core) Device(f DeviceFilter) (*Device, error) {
	list, err := c.Devices(&f)
	if err != nil {
		return nil, err
	}
	if len(list) == 0 {
		return nil, DeviceErrNotFound
	}
	return list[0], nil
}

// DeviceByID returns device details by id.
func (c *Core) DeviceByID(id ID) (*Device, error) {
	return c.Device(DeviceFilter{ID: id})
}

// DeviceCreateParam represents parameters to create a device.
type DeviceCreateParam struct {
	UserID  ID     `json:"user_id"`
	Name    string `json:"name"`
	Address string `json:"address"`
}

func (p *DeviceCreateParam) validate() error {
	if p.UserID.IsEmpty() {
		return DeviceErrRequiredUserID
	}

	p.Name = strings.TrimSpace(p.Name)
	p.Address = strings.TrimSpace(p.Address)
	if p.Name == "" || p.Address == "" {
		return DeviceErrRequiredFields
	}

	return nil
}

// CreateDevice creates new device to datastore.
func (c *Core) CreateDevice(p DeviceCreateParam) (*Device, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	// Check device name duplicate.
	dev, _ := c.Device(DeviceFilter{Name: p.Name, UserID: p.UserID})
	if dev != nil {
		return nil, DeviceErrDupName
	}

	// Set default values and create new device record.
	dev = &Device{
		UserID:  p.UserID,
		Name:    p.Name,
		Address: p.Address,
	}
	dev = dev.setDefaults()
	if err := c.store.Create(dev); err != nil {
		return nil, err
	}

	return dev, nil
}

// DeviceUpdateParam represents parameters to update a device.
type DeviceUpdateParam struct {
	ID         ID           `json:"id"`
	UserID     ID           `json:"user_id"`
	Name       string       `json:"name"`
	Address    string       `json:"address"`
	Status     DeviceStatus `json:"status"`
	LastActive *time.Time   `json:"last_active"`
}

func (p *DeviceUpdateParam) validate() error {
	if p.UserID.IsEmpty() {
		return DeviceErrRequiredUserID
	}
	if p.ID.IsEmpty() {
		return DeviceErrRequiredID
	}

	p.Name = strings.TrimSpace(p.Name)
	p.Address = strings.TrimSpace(p.Address)
	return nil
}

// UpdateDevice updates existing device to datastore.
func (c *Core) UpdateDevice(p DeviceUpdateParam) (*Device, error) {
	if err := p.validate(); err != nil {
		return nil, err
	}

	// Check device ownership.
	cur, err := c.Device(DeviceFilter{ID: p.ID, UserID: p.UserID})
	if err != nil {
		return nil, err
	}
	if cur == nil {
		return nil, DeviceErrNotFound
	}

	// Check device name duplicate.
	dev, _ := c.Device(DeviceFilter{Name: p.Name, UserID: p.UserID})
	if dev != nil && dev.ID != p.ID {
		return nil, DeviceErrDupName
	}

	// Update device record.
	dev = &Device{
		ID:      p.ID,
		Name:    p.Name,
		Address: p.Address,
		Status:  p.Status,
	}
	if err = c.store.Update(dev); err != nil {
		return nil, err
	}

	return dev, nil
}

// ActiveDevice updates its last active date by device id.
func (c *Core) ActiveDevice(deviceID string) {
	t := time.Now()
	d := &Device{ID: ID(deviceID), LastActive: &t}
	if err := c.store.Update(d); err != nil {
		c.logger.Errorln("could not update device last active value:", err)
	}
}

var deviceSearchKeywordFields = []string{"id", "name", "address"}

// SearchDevices returns a list of devices and metadata base on search options.
func (c *Core) SearchDevices(opts *SearchOpts) ([]*Device, *SearchMetadata, error) {
	if opts != nil {
		opts.KeywordFields = deviceSearchKeywordFields
	}

	var list []*Device
	meta, err := c.store.Search(&list, opts)
	if err != nil {
		return nil, nil, err
	}
	return list, meta, nil
}
