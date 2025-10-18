package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/mitsu3s/cadence/logger"
	"go.uber.org/zap"
)

const (
	defaultPort = "4000"
)

func main() {
	if err := logger.InitZap(); err != nil {
		fmt.Fprintf(os.Stderr, "failed to initialize logger: %v\n", err)
		os.Exit(1)
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		logger.LogInfo("Root endpoint accessed", zap.String("method", r.Method), zap.String("remote_addr", r.RemoteAddr))
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		logger.LogInfo("Health check requested", zap.String("method", r.Method), zap.String("remote_addr", r.RemoteAddr))
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	http.HandleFunc("/webhooks/github", func(w http.ResponseWriter, r *http.Request) {
		logger.LogInfo("GitHub webhook received", zap.String("method", r.Method), zap.String("remote_addr", r.RemoteAddr))
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	logger.LogInfo("Starting server", zap.String("port", port))
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		logger.LogErr("Server failed", zap.Error(err))
		os.Exit(1)
	}
}
