package sqlite

import (
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Client represents MySQL database client.
type Client struct {
	db *gorm.DB
}

type Config struct {
	Addr string
}

func New(conf Config) (*Client, error) {
	if err := createDir(conf.Addr); err != nil {
		return nil, err
	}

	db, err := gorm.Open(sqlite.Open(conf.Addr))
	if err != nil {
		return nil, err
	}

	return &Client{db}, nil
}

func (c *Client) Close() error {
	db, err := c.db.DB()
	if err != nil {
		return err
	}

	return db.Close()
}

func (c *Client) AutoMigrate(obj ...interface{}) error {
	return c.db.AutoMigrate(obj...)
}

func createDir(path string) error {
	dir := filepath.Dir(path)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		return os.Mkdir(dir, os.ModePerm)
	}

	return nil
}
