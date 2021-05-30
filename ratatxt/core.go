package ratatxt

import (
	"github.com/sirupsen/logrus"
)

// Core represents ratatxt core service.
type Core struct {
	store     Datastore
	mail      Mailer
	deviceCmd DeviceCmd
	webhook   Poster
	logger    *logrus.Logger
}

// NewCore create new instance of ratatxt core.
func NewCore(ds Datastore, mail Mailer, devCmd DeviceCmd, webhook Poster, log *logrus.Logger) (*Core, error) {
	// Setup service entities to datastore tables.
	if err := ds.AutoMigrate(
		new(User),
		new(Auth),
		new(Device),
		new(Message),
		new(Webhook),
		new(AppKey),
	); err != nil {
		return nil, err
	}

	var core Core
	core.store = ds
	core.mail = mail
	core.deviceCmd = devCmd
	core.webhook = webhook
	core.logger = log
	return core.init()
}

// init initializes Ratatxt core.
func (c *Core) init() (*Core, error) {
	if err := c.registerDefaults(); err != nil {
		return nil, err
	}

	c.registerActiveDevice()
	return c, nil
}

var defaultAccount = RegisterAccountParam{
	FirstName: "user",
	LastName:  "default",
	Email:     "localuser",
	Password:  "localpass",
}

func (c *Core) registerDefaults() error {
	n, err := c.store.Count(&User{}, nil)
	if n != 0 {
		return nil
	}

	c.logger.Println("initializing default account and device...")
	user := &User{
		ID:        NewID(),
		FirstName: defaultAccount.FirstName,
		LastName:  defaultAccount.LastName,
		Email:     defaultAccount.Email,
	}
	if err = c.store.Create(user); err != nil {
		return err
	}
	c.logger.Println("default user created")

	auth := &Auth{
		UserID:   user.ID,
		Username: defaultAccount.Email,
		Password: defaultAccount.Password,
		Level:    AuthLevelVerified,
	}
	auth = auth.setDefaults()
	if err = c.store.Create(auth); err != nil {
		return err
	}
	c.logger.Println("default auth created")

	device := &Device{
		UserID:  user.ID,
		Name:    "default",
		Address: "00123456789",
	}
	if err = c.store.Create(device); err != nil {
		return err
	}
	c.logger.Println("default device created")

	c.logger.Printf("default login user:%s pass:%s",
		defaultAccount.Email, defaultAccount.Password)
	return nil
}

func (c *Core) registerActiveDevice() {
	c.deviceCmd.ActiveHandler(c.ActiveDevice)
}
