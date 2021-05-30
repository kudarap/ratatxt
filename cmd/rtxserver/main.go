package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/kudarap/ratatxt/fcm"
	"github.com/kudarap/ratatxt/gokit/envconf"
	"github.com/kudarap/ratatxt/gokit/logger"
	"github.com/kudarap/ratatxt/gokit/version"
	"github.com/kudarap/ratatxt/http"
	"github.com/kudarap/ratatxt/mqtt"
	"github.com/kudarap/ratatxt/ratatxt"
	"github.com/kudarap/ratatxt/smtp"
	"github.com/kudarap/ratatxt/sqlite"
	"github.com/kudarap/ratatxt/webhook"
)

const configPrefix = "RTX"

type Config struct {
	SigKey string
	Addr   string
	Host   string
	UIAddr string `split_words:"true"`
	UIHost string `split_words:"true"`
	MQTT   mqtt.Config
	SQLite sqlite.Config
	Log    logger.Config

	SMTP smtp.Config
	FCM  fcm.Config
}

var defaultConfig = Config{
	SigKey: "default",
	Addr:   ":7100",
	UIAddr: ":8080",
	MQTT: mqtt.Config{
		Addr: "tcp://0.0.0.0:1883",
	},
	SQLite: sqlite.Config{
		Addr: "./data/local.db",
	},
	Log: logger.Config{
		FileOut: "./logs/app-out.log",
		FileErr: "./logs/app-err.log",
	},
}

var log = logger.Default()

func main() {
	app := newApp()

	log.Println("loading config...")
	if err := app.loadConfig(); err != nil {
		log.Fatalln("could not load config:", err)
	}

	log.Println("setting up...")
	if err := app.setup(); err != nil {
		log.Fatalln("could not setup:", err)
	}

	log.Println("running app...")
	if err := app.run(); err != nil {
		log.Fatalln("could not run:", err)
	}
	log.Println("stopped!")
}

type application struct {
	config   Config
	core     *ratatxt.Core
	server   *http.Server
	closerFn func()
}

func newApp() *application {
	a := &application{}
	a.closerFn = func() {}
	return a
}

func (app *application) loadConfig() error {
	app.config = defaultConfig

	envconf.EnvPrefix = configPrefix
	if err := envconf.Load(&app.config); err != nil {
		return fmt.Errorf("could not process config: %s", err)
	}

	return nil
}

func (app *application) setup() error {
	// Logs setup.
	log.Println("setting up persistent logs...")
	log, err := logger.New(app.config.Log)
	if err != nil {
		return fmt.Errorf("could not set up logs: %s", err)
	}

	// External services.
	log.Println("setting up smtp...")
	mailSvc, err := smtp.New(app.config.SMTP)
	if err != nil {
		return err
	}
	log.Println("setting up fcm...")

	// Database setup.
	log.Println("setting up database...")
	sqliteClient, err := setupSQLite(app.config.SQLite)
	if err != nil {
		return err
	}

	// MQTT broker setup.
	log.Println("setting up MQTT broker...")
	mqttSvc, err := mqtt.New(app.config.MQTT)
	if err != nil {
		return err
	}
	log.Println("broker running on", app.config.MQTT.Addr)

	// Core service setup.
	app.core, err = ratatxt.NewCore(sqliteClient, mailSvc, mqttSvc, webhook.New(), log)
	if err != nil {
		log.Fatalln("could not initiate core:", err)
	}

	// HTTP server setup.
	log.Println("setting up http server...")
	app.server = http.NewServer(app.config.SigKey, app.core, log, initVer())
	app.server.Addr = app.config.Addr

	// Closing database connections.
	app.closerFn = func() {
		log.Println("closing connection and shutting server...")
		if err = sqliteClient.Close(); err != nil {
			log.Fatalln("could not close rethink client:", err)
		}

		if err = mqttSvc.Close(); err != nil {
			log.Fatalln("could not close MQTT broker:", err)
		}
	}

	return nil
}

func (app *application) run() error {
	defer app.closerFn()
	return app.server.Run()
}

func setupSQLite(conf sqlite.Config) (c *sqlite.Client, err error) {
	c = &sqlite.Client{}
	fn := func() error {
		c, err = sqlite.New(conf)
		if err != nil {
			return fmt.Errorf("could not setup sqlite client: %s", err)
		}

		return nil
	}

	err = connRetry("sqlite", fn)
	return
}

func connRetry(name string, fn func() error) error {
	const delay = time.Second * 5

	// Catches a panic to retry.
	defer func() {
		if err := recover(); err != nil {
			log.Printf("[%s] conn error: %s. retrying in %s...", name, err, delay)
			time.Sleep(delay)
			err = connRetry(name, fn)
		}
	}()

	// Causes panic to retry.
	if err := fn(); err != nil {
		panic(err)
	}

	return nil
}

// version details used by ldflags.
var tag, commit, built string

func initVer() version.Version {
	var prod bool
	if !strings.HasSuffix(tag, "dev") {
		prod = true
	}

	v := version.New(prod, tag, commit, built)
	return v
}
