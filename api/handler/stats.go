package handler

import (
	"encoding/json"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/mitsu3s/cadence/logger"
	"github.com/mitsu3s/cadence/model"
	"github.com/mitsu3s/cadence/store"
)

type DailyStat struct {
	Date           string `json:"date"`         // "2025-11-20"
	PushCount      int    `json:"push_count"`   // push イベント数
	PushCommits    int    `json:"push_commits"` // （あれば）コミット数の合計
	PROpened       int    `json:"pr_opened"`
	PRClosed       int    `json:"pr_closed"`
	PRMerged       int    `json:"pr_merged"`
	PRSynchronized int    `json:"pr_synchronized"`
	TotalActivity  int    `json:"total_activity"` // 上記の合計
}

type StatsDailyResponse struct {
	Repo  string      `json:"repo"`
	Days  int         `json:"days"`
	From  string      `json:"from"` // "YYYY-MM-DD"
	To    string      `json:"to"`   // "YYYY-MM-DD"
	Stats []DailyStat `json:"stats"`
}

func StatsDaily(st store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		repo := r.URL.Query().Get("repo")
		if repo == "" {
			http.Error(w, "repo is required", http.StatusBadRequest)
			return
		}

		// days パラメータ
		days := 7
		if q := r.URL.Query().Get("days"); q != "" {
			if v, err := strconv.Atoi(q); err == nil && v > 0 && v <= 90 {
				days = v
			}
		}

		// いったん UTC ベースで from/to を決める
		now := time.Now().UTC()
		// 今日を含めて days 日分を見たいので、
		// 例: days=7 → 7日前の00:00〜明日の00:00 まで
		today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
		from := today.AddDate(0, 0, -(days - 1)) // (7日なら6日前から)
		to := today.AddDate(0, 0, 1)             // 明日の00:00

		events, err := st.ListEventsByRepoAndRange(r.Context(), repo, from, to)
		if err != nil {
			logger.LogErr("stats daily list events failed", "error", err)
			http.Error(w, "failed to fetch events", http.StatusInternalServerError)
			return
		}

		// date(YYYY-MM-DD) -> *DailyStat のマップ
		statsMap := make(map[string]*DailyStat)

		dateKey := func(t time.Time) string {
			ut := t.UTC()
			return ut.Format("2006-01-02")
		}

		for _, ev := range events {
			d := dateKey(ev.OccurredAt)

			ds, ok := statsMap[d]
			if !ok {
				ds = &DailyStat{Date: d}
				statsMap[d] = ds
			}

			switch ev.Type {
			case model.EventTypePush:
				ds.PushCount++
				if ev.PushCommitCount > 0 {
					ds.PushCommits += ev.PushCommitCount
				}
				ds.TotalActivity++

			case model.EventTypePullRequest:
				switch ev.Action {
				case "opened":
					ds.PROpened++
					ds.TotalActivity++
				case "closed":
					ds.PRClosed++
					ds.TotalActivity++
				case "merged":
					ds.PRMerged++
					ds.TotalActivity++
				case "synchronize":
					ds.PRSynchronized++
					ds.TotalActivity++
				default:
					// ここではカウントしない（タイムラインと整合性を取る）
				}
			default:
			}
		}

		// 日付順に並べ替え
		dates := make([]string, 0, len(statsMap))
		for d := range statsMap {
			dates = append(dates, d)
		}
		sort.Strings(dates)

		stats := make([]DailyStat, 0, len(dates))
		for _, d := range dates {
			stats = append(stats, *statsMap[d])
		}

		resp := StatsDailyResponse{
			Repo:  repo,
			Days:  days,
			From:  from.Format("2006-01-02"),
			To:    today.Format("2006-01-02"),
			Stats: stats,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			logger.LogErr("stats daily encode failed", "error", err)
		}
	}
}
