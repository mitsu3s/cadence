package server

import (
	"net"
	"net/http"

	"github.com/mitsu3s/cadence/config"
	"github.com/mitsu3s/cadence/handler"
	"github.com/mitsu3s/cadence/logger"
	"github.com/mitsu3s/cadence/middleware"
	"github.com/mitsu3s/cadence/store"
)

type Server struct {
	cfg *config.Config
	mux *http.ServeMux
	srv *http.Server
}

func New(cfg *config.Config, st store.Store) *Server {
	mux := http.NewServeMux()

	// リクエストのルーティングを設定
	// ミドルウェアを使い、エンドポイントを保護
	mux.HandleFunc("/health", handler.Health)
	mux.HandleFunc("/events", middleware.AuthMiddleware(handler.ListEvents(st)))
	mux.HandleFunc("/stats/daily", middleware.AuthMiddleware(handler.StatsDaily(st)))
	mux.HandleFunc("/stats/rhythm", middleware.AuthMiddleware(handler.Rhythm(st)))
	mux.HandleFunc("/timeline", middleware.AuthMiddleware(handler.Timeline(st)))

	return &Server{
		cfg: cfg,
		mux: mux,
		srv: &http.Server{Handler: mux},
	}
}

func (s *Server) ListenAndServe() error {
	logger.LogInfo("Starting server", "port", s.cfg.Port)

	ln, err := net.Listen("tcp", ":"+s.cfg.Port)
	if err != nil {
		return err
	}

	return s.srv.Serve(ln)
}
