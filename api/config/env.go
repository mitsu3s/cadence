package config

import (
	"fmt"
	"os"
)

// Config is a struct for environment variables.
type Config struct {
	Port string
}

// Get gets a value from environment variables.
func Get() (*Config, error) {
	var (
		cfg    Config
		missed []string
	)

	for _, prop := range []struct {
		field *string
		name  string
	}{
		{&cfg.Port, "PORT"},
	} {
		v := os.Getenv(prop.name)
		*prop.field = v

		if v == "" {
			missed = append(missed, prop.name)
		}
	}

	if len(missed) > 0 {
		return nil, fmt.Errorf("missing required environment variables: %v", missed)
	}

	return &cfg, nil
}
