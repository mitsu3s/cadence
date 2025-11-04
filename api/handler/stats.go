package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/mitsu3s/cadence/store"
)

type dailyStat struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}

type dailyStatsResponse struct {
	Repo string      `json:"repo"`
	From time.Time   `json:"from"`
	To   time.Time   `json:"to"`
	Days []dailyStat `json:"days"`
}

func StatsDaily(st store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		repo := r.URL.Query().Get("repo")
		if repo == "" {
			http.Error(w, "repo is required", http.StatusBadRequest)
			return
		}

		// デフォルト7日
		days := 7
		if v := r.URL.Query().Get("days"); v != "" {
			if n, err := strconv.Atoi(v); err == nil && n > 0 && n <= 30 {
				days = n
			}
		}

		// 今を基準に期間を決める
		now := time.Now().UTC()
		from := now.AddDate(0, 0, -days)

		events, err := st.ListEvents(r.Context(), store.EventQuery{
			Repo:  repo,
			Since: from,
			Until: now,
			Limit: days * 200, // ゆとりを持つ
		})
		if err != nil {
			http.Error(w, "failed to fetch events", http.StatusInternalServerError)
			return
		}

		// 日付ごとにカウント
		counts := make(map[string]int)
		for _, ev := range events {
			// received_at を日単位に丸める
			d := ev.ReceivedAt.UTC().Format("2006-01-02")
			counts[d]++
		}

		// レスポンスを日付順で並べる
		daysResp := make([]dailyStat, 0, days)
		for i := 0; i < days; i++ {
			d := from.AddDate(0, 0, i).UTC().Format("2006-01-02")
			daysResp = append(daysResp, dailyStat{
				Date:  d,
				Count: counts[d],
			})
		}

		resp := dailyStatsResponse{
			Repo: repo,
			From: from,
			To:   now,
			Days: daysResp,
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(resp)
	}
}
