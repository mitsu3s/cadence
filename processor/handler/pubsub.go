package handler

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/mitsu3s/cadence/model"
	"github.com/mitsu3s/cadence/store"
)

// Pub/Sub push のエンベロープ
type pubsubEnvelope struct {
	Message struct {
		MessageID  string            `json:"messageId"`
		Data       string            `json:"data"`
		Attributes map[string]string `json:"attributes"`
	} `json:"message"`
	Subscription string `json:"subscription"`
}

// 受け取る payload（receiver から publish される想定）
type prPayload struct {
	Action     string `json:"action"`
	Repository struct {
		FullName string `json:"full_name"`
	} `json:"repository"`
	PullRequest struct {
		Title string `json:"title"`
	} `json:"pull_request"`
}

func PubSub(st store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		var env pubsubEnvelope
		if err := json.NewDecoder(r.Body).Decode(&env); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		// base64 デコード
		raw, err := base64.StdEncoding.DecodeString(env.Message.Data)
		if err != nil {
			http.Error(w, "bad data", http.StatusBadRequest)
			return
		}

		// まずは PR だけを扱う（attributesで type=pr などを付けてくる想定でもOK）
		var p prPayload
		_ = json.Unmarshal(raw, &p) // 失敗しても落とさない（raw保存は後で）

		// 冪等性: GitHub の Delivery ID を attributes に載せる想定
		id := env.Message.MessageID
		if d, ok := env.Message.Attributes["delivery"]; ok && d != "" {
			id = d
		}

		ev := model.Event{
			ID:         id,
			Type:       "pull_request",
			Repository: p.Repository.FullName,
			Action:     p.Action,
			Title:      p.PullRequest.Title,
			CreatedAt:  time.Now(), // 後でpayload由来に修正可
			ReceivedAt: time.Now(),
		}

		if err := st.SaveEvent(r.Context(), ev); err != nil {
			log.Printf("processor save error: %v", err)
			http.Error(w, "save failed", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}
}
