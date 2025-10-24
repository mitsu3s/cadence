package handler

import (
	"io"
	"log"
	"net/http"
)

func GitHubWebhook(_ string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// 署名検証は後で入れる。
		event := r.Header.Get("X-GitHub-Event")
		delivery := r.Header.Get("X-GitHub-Delivery")

		// Bodyサイズを把握（保存はまだしない）
		body, _ := io.ReadAll(r.Body)
		size := len(body)

		log.Printf(`github_webhook recv event=%q delivery=%q size=%d`, event, delivery, size)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}
}
