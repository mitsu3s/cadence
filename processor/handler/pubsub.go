package handler

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
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

// 既存の prPayload はそのままにして、下を追加

// installation.created / deleted 用
type installationPayload struct {
	Action       string `json:"action"` // "created", "deleted", ...
	Installation struct {
		ID      int64 `json:"id"`
		Account struct {
			Login string `json:"login"` // "owner"
			Type  string `json:"type"`  // "User" or "Organization"
		} `json:"account"`
	} `json:"installation"`
	Repositories []struct {
		FullName string `json:"full_name"` // "owner/name"
	} `json:"repositories"`
}

// installation_repositories.added / removed 用
type installationRepositoriesPayload struct {
	Action       string `json:"action"` // "added" or "removed"
	Installation struct {
		ID int64 `json:"id"`
	} `json:"installation"`
	RepositoriesAdded []struct {
		FullName string `json:"full_name"`
	} `json:"repositories_added"`
	RepositoriesRemoved []struct {
		FullName string `json:"full_name"`
	} `json:"repositories_removed"`
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

		event := env.Message.Attributes["event"]       // "pull_request", "installation", ...
		delivery := env.Message.Attributes["delivery"] // 冪等キー
		instIDStr := env.Message.Attributes["installation_id"]

		switch event {
		case "pull_request":
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

		case "installation":
			// インストール全体のスナップショット
			var p installationPayload
			if err := json.Unmarshal(raw, &p); err != nil {
				log.Printf("bad installation payload: %v", err)
				http.Error(w, "bad payload", http.StatusBadRequest)
				return
			}

			inst := model.Installation{
				ID:           p.Installation.ID,
				AccountLogin: p.Installation.Account.Login,
				AccountType:  p.Installation.Account.Type,
				UpdatedAt:    time.Now(),
				// Active / DeletedAt は action に応じてセット
			}

			// repositories を "owner/name" の配列に変換
			for _, rinfo := range p.Repositories {
				inst.Repositories = append(inst.Repositories, rinfo.FullName)
			}

			// action に応じて Active フラグなどを決める
			switch p.Action {
			case "created":
				inst.Active = true
				inst.DeletedAt = time.Time{}
			case "deleted":
				inst.Active = false
				inst.DeletedAt = time.Now()
			default:
				// "suspend" などあれば後で拡張
				inst.Active = true
			}

			if err := st.SaveInstallation(r.Context(), inst); err != nil {
				log.Printf("save installation error: %v", err)
				http.Error(w, "save installation failed", http.StatusInternalServerError)
				return
			}

		case "installation_repositories":
			// 対象リポジトリの追加・削除
			var p installationRepositoriesPayload
			if err := json.Unmarshal(raw, &p); err != nil {
				log.Printf("bad installation_repos payload: %v", err)
				http.Error(w, "bad payload", http.StatusBadRequest)
				return
			}

			var added, removed []string
			for _, rinfo := range p.RepositoriesAdded {
				added = append(added, rinfo.FullName)
			}
			for _, rinfo := range p.RepositoriesRemoved {
				removed = append(removed, rinfo.FullName)
			}

			// installation ID は payload から取るのが本筋
			instID := p.Installation.ID
			// 念のため attributes に入っていたらそれを優先
			if instID == 0 && instIDStr != "" {
				if v, err := strconv.ParseInt(instIDStr, 10, 64); err == nil {
					instID = v
				}
			}

			if instID == 0 {
				log.Printf("installation_repositories missing installation id")
				http.Error(w, "missing installation id", http.StatusBadRequest)
				return
			}

			if err := st.UpdateInstallationRepositories(r.Context(), instID, added, removed); err != nil {
				log.Printf("update installation repos error: %v", err)
				http.Error(w, "update installation repos failed", http.StatusInternalServerError)
				return
			}

		default:
			// それ以外のイベントは当面ログだけ
			log.Printf("processor ignore event=%q delivery=%q", event, delivery)
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}
}
