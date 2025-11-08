package handler

import (
	"net/http"

	"github.com/mitsu3s/cadence/logger"
)

// ヘルスチェックハンドラー
func Health(w http.ResponseWriter, r *http.Request) {
	logger.LogInfo("Health check requested", "method", r.Method, "remote_addr", r.RemoteAddr)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}
