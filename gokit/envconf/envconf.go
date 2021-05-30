package envconf

import (
	"fmt"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

// EnvPrefix default env prefix APP.
var EnvPrefix = "APP"

// Load parses .env values into a struct.
func Load(in interface{}) error {
	// Load env file if available.
	godotenv.Load()

	// Bind env values.
	if err := envconfig.Process(EnvPrefix, in); err != nil {
		return fmt.Errorf("could not process config: %s", err)
	}

	return nil
}
