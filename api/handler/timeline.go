package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/mitsu3s/cadence/logger"
	"github.com/mitsu3s/cadence/model"
	"github.com/mitsu3s/cadence/store"
)

// レスポンス用の 1 行分
type TimelineItem struct {
	Time   time.Time `json:"time"`
	Type   string    `json:"type"`
	Repo   string    `json:"repo"`
	Actor  string    `json:"actor"`
	Action string    `json:"action"`

	PRNumber     int    `json:"pr_number,omitempty"`
	PRTitle      string `json:"pr_title,omitempty"`
	PRIsMerged   bool   `json:"pr_is_merged,omitempty"`
	PRBaseBranch string `json:"pr_base_branch,omitempty"`

	PushBranch      string `json:"push_branch,omitempty"`
	PushCommitCount int    `json:"push_commit_count,omitempty"`
}

// /timeline?repo=owner/name&date=YYYY-MM-DD
func Timeline(st store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		repo := r.URL.Query().Get("repo")
		dateStr := r.URL.Query().Get("date")

		if repo == "" || dateStr == "" {
			http.Error(w, "repo and date are required", http.StatusBadRequest)
			return
		}

		// 日付のパース（いったん UTC の日付として扱う）
		day, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			http.Error(w, "invalid date format (use YYYY-MM-DD)", http.StatusBadRequest)
			return
		}

		from := day
		to := day.Add(24 * time.Hour)

		events, err := st.ListEventsByRepoAndRange(r.Context(), repo, from, to)
		if err != nil {
			logger.LogErr("timeline list events failed", "error", err)
			http.Error(w, "failed to fetch events", http.StatusInternalServerError)
			return
		}

		items := make([]TimelineItem, 0, len(events))
		for _, ev := range events {
			// まずタイムラインに載せるかどうかを判定
			if !includeInTimeline(ev) {
				continue
			}

			item := TimelineItem{
				Time:            ev.OccurredAt,
				Type:            string(ev.Type),
				Repo:            ev.Repo,
				Actor:           ev.Actor,
				Action:          ev.Action,
				PRNumber:        ev.PRNumber,
				PRTitle:         ev.PRTitle,
				PRIsMerged:      ev.PRIsMerged,
				PRBaseBranch:    ev.PRBaseBranch,
				PushBranch:      ev.PushBranch,
				PushCommitCount: ev.PushCommitCount,
			}
			items = append(items, item)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(items); err != nil {
			logger.LogErr("timeline encode failed", "error", err)
		}
	}
}

// タイムラインに載せる/載せないを決めるフィルタ
func includeInTimeline(ev model.Event) bool {
	switch ev.Type {
	case model.EventTypePush:
		return true

	case model.EventTypePullRequest:
		if ev.Actor == "renovate[bot]" || ev.Actor == "dependabot[bot]" {
			switch ev.Action {
			case "labeled", "unlabeled", "edited", "review_requested":
				return false
			}
		}

		switch ev.Action {
		case "opened", "closed", "merged", "reopened", "synchronize":
			return true
		default:
			return false
		}

	default:
		return false
	}
}
