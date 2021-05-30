// +build ui

package main

import (
	"fmt"

	"github.com/kudarap/ratatxt/gokit/envconf"
	"github.com/kudarap/ratatxt/ui"
)

// Note: to include this on build add -tag ui on build command
func init() {
	conf := defaultConfig

	envconf.EnvPrefix = configPrefix
	if err := envconf.Load(&conf); err != nil {
		panic(fmt.Errorf("could not process config: %s", err))
	}

	apiHost := conf.Host
	if apiHost == "" {
		apiHost = "http://localhost" + conf.Addr
	}

	go ui.Run(conf.UIAddr, conf.UIHost, apiHost, log)
}
