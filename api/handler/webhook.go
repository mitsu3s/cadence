package handler

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/mitsu3s/cadence/model"
	"github.com/mitsu3s/cadence/store"
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

func GitHubWebhook(st store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		event := r.Header.Get("X-GitHub-Event")
		delivery := r.Header.Get("X-GitHub-Delivery")
		body, _ := io.ReadAll(r.Body)

		switch event {
		case "pull_request":
			var p prPayload
			_ = json.Unmarshal(body, &p) // 失敗しても落とさない
			ev := model.Event{
				ID:         delivery, // GitHubの配送IDをそのまま採用
				Type:       "pull_request",
				Repository: p.Repository.FullName,
				Action:     p.Action,
				Title:      p.PullRequest.Title,
				CreatedAt:  time.Now(), // 当面は受信時刻でOK（後でpayloadの時刻に変更）
				ReceivedAt: time.Now(),
				// Rawは今回は省略（後で必要になったら入れる）
			}
			if err := st.SaveEvent(r.Context(), ev); err != nil {
				log.Printf("save error: %v", err)
				http.Error(w, "save failed", http.StatusInternalServerError)
				return
			}
			log.Printf(`saved pr event id=%s repo=%q action=%q`, ev.ID, ev.Repository, ev.Action)

		default:
			// そのほかのイベントは今日は捨てる（ログだけ）
			log.Printf(`github_webhook recv event=%q delivery=%q size=%d`, event, delivery, len(body))
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}
}
