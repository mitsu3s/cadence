package handler

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"
	"strings"

	"cloud.google.com/go/pubsub"
	"github.com/mitsu3s/cadence/config"
	"github.com/mitsu3s/cadence/logger"
)

func GitHubWebhook(topic *pubsub.Topic, cfg *config.Config) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		event := r.Header.Get("X-GitHub-Event")
		delivery := r.Header.Get("X-GitHub-Delivery")
		signature := r.Header.Get("X-Hub-Signature-256")

		// 検証・Publish のために Body を全部読む
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "failed to read body", http.StatusBadRequest)
			return
		}

		// シークレット検証
		secret := cfg.GitHubWebhookSecret
		if !verifyGitHubSignature256([]byte(secret), body, signature) {
			logger.LogInfo("invalid signature", "delivery", delivery, "event", event)
			http.Error(w, "invalid signature", http.StatusUnauthorized)
			return
		}

		res := topic.Publish(r.Context(), &pubsub.Message{
			Data: body, // そのまま push の data に入る
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

// GitHub の X-Hub-Signature-256 を検証する
func verifyGitHubSignature256(secret []byte, body []byte, got string) bool {
	const prefix = "sha256="
	if !strings.HasPrefix(got, prefix) {
		return false
	}
	sigHex := got[len(prefix):]

	wantMAC := hmac.New(sha256.New, secret)
	wantMAC.Write(body)
	expected := wantMAC.Sum(nil)

	gotMAC, err := hex.DecodeString(sigHex)
	if err != nil {
		return false
	}
	// タイミング攻撃対策に hmac.Equal を使う
	return hmac.Equal(expected, gotMAC)
}
