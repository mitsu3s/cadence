package handler

import (
	"io"
	"net/http"

	"cloud.google.com/go/pubsub"
	"github.com/mitsu3s/cadence/logger"
)

func GitHubWebhook(topic *pubsub.Topic) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		event := r.Header.Get("X-GitHub-Event")
		delivery := r.Header.Get("X-GitHub-Delivery")

		// 生の GitHub ペイロードをそのまま publish
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "failed to read body", http.StatusBadRequest)
			return
		}

		res := topic.Publish(r.Context(), &pubsub.Message{
			Data: body, // ← ラップしない。これがそのまま push の data に入る
			Attributes: map[string]string{
				"source":   "github",
				"event":    event,    // 例: "pull_request"
				"delivery": delivery, // 冪等キー（processor が使う）
			},
		})

		if _, err := res.Get(r.Context()); err != nil {
			logger.LogErr("publish error", err)
			http.Error(w, "publish failed", http.StatusInternalServerError)
			return
		}

		logger.LogInfo("github_webhook published", "event", event, "delivery", delivery, "size", len(body))
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})
}
