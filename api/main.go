package main

import (
	"context"
	"fmt"
	"os"

	"github.com/mitsu3s/cadence/config"
	"github.com/mitsu3s/cadence/logger"
	"github.com/mitsu3s/cadence/server"
	"github.com/mitsu3s/cadence/store"
)

func main() {
	if err := logger.InitZap(); err != nil {
		fmt.Fprintf(os.Stderr, "failed to initialize logger: %v\n", err)
		return
	}

	cfg, err := config.Get()
	if err != nil {
		logger.LogErr("Failed to load config", err)
		return
	}

	st, err := store.NewFirestore(context.Background())
	if err != nil {
		logger.LogErr("Failed to create Firestore client", err)
		return
	}

	logger.LogInfo("Setup completed")

	server := server.New(cfg, st)
	if err := server.ListenAndServe(); err != nil {
		logger.LogErr("Server failed", err)
		return
	}
}
