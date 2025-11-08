package main

import (
	"context"
	"fmt"
	"os"

	"cloud.google.com/go/pubsub"
	"github.com/mitsu3s/cadence/config"
	"github.com/mitsu3s/cadence/logger"
	"github.com/mitsu3s/cadence/server"
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

	pc, err := pubsub.NewClient(context.Background(), cfg.ProjectID)
	if err != nil {
		logger.LogErr("Failed to create Pub/Sub client", err)
		return
	}

	topic := pc.Topic(cfg.CadenceTopic)

	logger.LogInfo("Setup completed")

	server := server.New(cfg, topic)
	if err := server.ListenAndServe(); err != nil {
		logger.LogErr("Server failed", err)
		return
	}
}
