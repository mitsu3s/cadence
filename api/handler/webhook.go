package handler

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

type prPayload struct {
	Action      string `json:"action"`
	Number      int    `json:"number"`
	PullRequest struct {
		Title string `json:"title"`
	} `json:"pull_request"`
	Repository struct {
		FullName string `json:"full_name"`
	} `json:"repository"`
}

func GitHubWebhook(_ string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		event := r.Header.Get("X-GitHub-Event")
		delivery := r.Header.Get("X-GitHub-Delivery")

		body, _ := io.ReadAll(r.Body)

		if event == "pull_request" {
			var p prPayload
			_ = json.Unmarshal(body, &p) // 失敗しても落とさない
			log.Printf(`pr event action=%q num=%d title=%q repo=%q delivery=%q`,
				p.Action, p.Number, p.PullRequest.Title, p.Repository.FullName, delivery)
		} else {
			log.Printf(`github_webhook recv event=%q delivery=%q size=%d`, event, delivery, len(body))
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}
}
