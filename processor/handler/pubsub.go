package handler

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/mitsu3s/cadence/logger"
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

// PR イベント用ペイロード
type prPayload struct {
	Action     string `json:"action"`
	Repository struct {
		FullName string `json:"full_name"`
	} `json:"repository"`
	PullRequest struct {
		Number int    `json:"number"`
		Title  string `json:"title"`

		User struct {
			Login string `json:"login"`
		} `json:"user"`

		Base struct {
			Ref string `json:"ref"`
		} `json:"base"`

		Merged    bool      `json:"merged"`
		CreatedAt time.Time `json:"created_at"`
		UpdatedAt time.Time `json:"updated_at"`
	} `json:"pull_request"`
}

// push イベント用ペイロード
type pushPayload struct {
	Ref        string `json:"ref"` // "refs/heads/main" など
	Before     string `json:"before"`
	After      string `json:"after"`
	Created    bool   `json:"created"`
	Deleted    bool   `json:"deleted"`
	Forced     bool   `json:"forced"`
	Compare    string `json:"compare"`
	Repository struct {
		FullName string `json:"full_name"` // "owner/name"
	} `json:"repository"`
	Pusher struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	} `json:"pusher"`
	Commits []struct {
		ID        string    `json:"id"`
		Timestamp time.Time `json:"timestamp"`
		Message   string    `json:"message"`
	} `json:"commits"`
	HeadCommit struct {
		ID        string    `json:"id"`
		Timestamp time.Time `json:"timestamp"`
		Message   string    `json:"message"`
		Author    struct {
			Name string `json:"name"`
		} `json:"author"`
	} `json:"head_commit"`
}

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
		start := time.Now()
		defer r.Body.Close()

		var env pubsubEnvelope
		if err := json.NewDecoder(r.Body).Decode(&env); err != nil {
			logger.LogErr("processor pubsub decode error",
				"component", "processor",
				"operation", "PubSub",
				"status", "error",
				"error", err,
			)
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		// base64 デコード
		raw, err := base64.StdEncoding.DecodeString(env.Message.Data)
		if err != nil {
			logger.LogErr("processor pubsub base64 decode error",
				"component", "processor",
				"operation", "PubSub",
				"status", "error",
				"error", err,
			)
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

			// 発生時刻: updated_at があればそれを使う。なければ created_at
			occurredAt := p.PullRequest.UpdatedAt
			if occurredAt.IsZero() {
				occurredAt = p.PullRequest.CreatedAt
			}

			ev := model.Event{
				ID:           id,
				Type:         model.EventTypePullRequest,
				Repo:         p.Repository.FullName,    // "owner/name"
				Actor:        p.PullRequest.User.Login, // PR の author
				Action:       p.Action,                 // "opened", "closed", "synchronize" など
				OccurredAt:   occurredAt,               // GitHub 側のイベント発生時刻
				ReceivedAt:   time.Now(),               // cadence が受け取った時刻
				PRNumber:     p.PullRequest.Number,
				PRTitle:      p.PullRequest.Title,
				PRIsMerged:   p.PullRequest.Merged,
				PRBaseBranch: p.PullRequest.Base.Ref,
			}

			if err := st.SaveEvent(r.Context(), ev); err != nil {
				latency := time.Since(start).Milliseconds()
				logger.LogErr("processor save event failed",
					"component", "processor",
					"operation", "SaveEvent",
					"status", "error",
					"delivery", delivery,
					"repo", p.Repository.FullName,
					"latency_ms", latency,
					"error", err,
				)
				http.Error(w, "save failed", http.StatusInternalServerError)
				return
			}

			latency := time.Since(start).Milliseconds()
			logger.LogInfo("processor save event ok",
				"component", "processor",
				"operation", "SaveEvent",
				"status", "ok",
				"delivery", delivery,
				"repo", p.Repository.FullName,
				"latency_ms", latency,
			)

		case "push":
			var p pushPayload
			if err := json.Unmarshal(raw, &p); err != nil {
				logger.LogErr("processor push payload decode error",
					"component", "processor",
					"operation", "Push",
					"status", "error",
					"event", event,
					"delivery", delivery,
					"error", err,
				)
				http.Error(w, "bad push payload", http.StatusBadRequest)
				return
			}

			if p.Deleted {
				logger.LogInfo("ignore deleted branch push",
					"component", "processor",
					"operation", "Push",
					"status", "ignored",
					"repo", p.Repository.FullName,
					"ref", p.Ref,
				)
				break
			}

			// 冪等性: Delivery ID を使う（今までと同じ）
			id := env.Message.MessageID
			if d, ok := env.Message.Attributes["delivery"]; ok && d != "" {
				id = d
			}

			// ブランチ名: "refs/heads/main" → "main" にする
			branch := p.Ref
			const prefix = "refs/heads/"
			branch = strings.TrimPrefix(branch, prefix)

			// 発生時刻: head_commit の timestamp を優先
			occurredAt := p.HeadCommit.Timestamp
			if occurredAt.IsZero() && len(p.Commits) > 0 {
				occurredAt = p.Commits[len(p.Commits)-1].Timestamp
			}

			if occurredAt.IsZero() {
				occurredAt = time.Now()
			}

			ev := model.Event{
				ID:              id,
				Type:            model.EventTypePush, // 事前に定義したやつ
				Repo:            p.Repository.FullName,
				Actor:           p.Pusher.Name, // or Login があればそっち
				Action:          "pushed",
				OccurredAt:      occurredAt,
				ReceivedAt:      time.Now(),
				PushCommitCount: len(p.Commits),
				PushBranch:      branch,
			}

			if err := st.SaveEvent(r.Context(), ev); err != nil {
				latency := time.Since(start).Milliseconds()
				logger.LogErr("processor save push event failed",
					"component", "processor",
					"operation", "SaveEvent",
					"status", "error",
					"delivery", delivery,
					"repo", p.Repository.FullName,
					"latency_ms", latency,
					"error", err,
				)
				http.Error(w, "save failed", http.StatusInternalServerError)
				return
			}

			latency := time.Since(start).Milliseconds()
			logger.LogInfo("processor save push event ok",
				"component", "processor",
				"operation", "SaveEvent",
				"status", "ok",
				"delivery", delivery,
				"repo", p.Repository.FullName,
				"latency_ms", latency,
			)

		case "installation":
			// インストール全体のスナップショット
			var p installationPayload
			if err := json.Unmarshal(raw, &p); err != nil {
				logger.LogErr("bad installation payload",
					"component", "processor",
					"operation", "SaveInstallation",
					"status", "error",
					"event", event,
					"delivery", delivery,
					"error", err,
				)
				http.Error(w, "bad payload", http.StatusBadRequest)
				return
			}

			inst := model.Installation{
				ID:           p.Installation.ID,
				AccountLogin: p.Installation.Account.Login,
				AccountType:  p.Installation.Account.Type,
				UpdatedAt:    time.Now(),
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
				latency := time.Since(start).Milliseconds()
				logger.LogErr("save installation error",
					"component", "processor",
					"operation", "SaveInstallation",
					"status", "error",
					"installation_id", inst.ID,
					"latency_ms", latency,
					"error", err,
				)
				http.Error(w, "save installation failed", http.StatusInternalServerError)
				return
			}

			latency := time.Since(start).Milliseconds()
			logger.LogInfo("save installation ok",
				"component", "processor",
				"operation", "SaveInstallation",
				"status", "ok",
				"installation_id", inst.ID,
				"latency_ms", latency,
			)

		case "installation_repositories":
			// 対象リポジトリの追加・削除
			var p installationRepositoriesPayload
			if err := json.Unmarshal(raw, &p); err != nil {
				logger.LogErr("bad installation_repos payload",
					"component", "processor",
					"operation", "UpdateInstallationRepos",
					"status", "error",
					"event", event,
					"delivery", delivery,
					"error", err,
				)
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
				logger.LogErr("installation_repositories missing installation id",
					"component", "processor",
					"operation", "UpdateInstallationRepos",
					"status", "error",
					"event", event,
					"delivery", delivery,
				)
				http.Error(w, "missing installation id", http.StatusBadRequest)
				return
			}

			if err := st.UpdateInstallationRepositories(r.Context(), instID, added, removed); err != nil {
				latency := time.Since(start).Milliseconds()
				logger.LogErr("update installation repos error",
					"component", "processor",
					"operation", "UpdateInstallationRepos",
					"status", "error",
					"installation_id", instID,
					"latency_ms", latency,
					"error", err,
				)
				http.Error(w, "update installation repos failed", http.StatusInternalServerError)
				return
			}

			latency := time.Since(start).Milliseconds()
			logger.LogInfo("update installation repos ok",
				"component", "processor",
				"operation", "UpdateInstallationRepos",
				"status", "ok",
				"installation_id", instID,
				"latency_ms", latency,
			)

		default:
			// それ以外のイベントは当面ログだけ
			logger.LogInfo("processor ignore event",
				"component", "processor",
				"operation", "IgnoreEvent",
				"status", "ok",
				"event", event,
				"delivery", delivery,
			)
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}
}
