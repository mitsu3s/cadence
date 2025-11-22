package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/mitsu3s/cadence/logger"
	"github.com/mitsu3s/cadence/model"
	"github.com/mitsu3s/cadence/store"
)

// ダッシュボードに表示する情報
type RhythmResponse struct {
	Momentum  []MomentumPoint `json:"momentum"`
	PunchCard []PunchCardItem `json:"punch_card"`
	Streak    StreakInfo      `json:"streak"`
}

// 波を見るモメンタムポイント
type MomentumPoint struct {
	Date  string  `json:"date"`
	Value float64 `json:"value"`
}

// 時間ごとのイベントを示すパンチカードアイテム
type PunchCardItem struct {
	Hour  int `json:"hour"`
	Count int `json:"count"`
}

// 連続アクティビティ情報
type StreakInfo struct {
	Current int `json:"current"`
	Longest int `json:"longest"`
}

func Rhythm(st store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		repo := r.URL.Query().Get("repo")
		if repo == "" {
			http.Error(w, "repo is required", http.StatusBadRequest)
			return
		}

		daysParam := r.URL.Query().Get("days")
		days := 90
		if daysParam != "" {
			_, err := fmt.Sscanf(daysParam, "%d", &days)
			if err != nil {
				days = 90 // デフォルト値は90日
			}
		}

		// データの取得範囲を計算
		now := time.Now().UTC()
		to := now.AddDate(0, 0, 1)
		from := now.AddDate(0, 0, -days)

		events, err := st.ListEventsByRepoAndRange(r.Context(), repo, from, to)
		if err != nil {
			logger.LogErr("rhythm list events failed", "error", err)
			http.Error(w, "failed to fetch events", http.StatusInternalServerError)
			return
		}

		momentum := calculateMomentum(events, from, to)
		punchCard := calculatePunchCard(events)
		streak := calculateStreak(events, now)

		resp := RhythmResponse{
			Momentum:  momentum,
			PunchCard: punchCard,
			Streak:    streak,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			logger.LogErr("rhythm encode failed", "error", err)
		}
	}
}

// モメンタムの計算
func calculateMomentum(events []model.Event, from, to time.Time) []MomentumPoint {
	dailyScores := make(map[string]float64)

	// すべての日を0で初期化
	for d := from; d.Before(to); d = d.AddDate(0, 0, 1) {
		dailyScores[d.Format("2006-01-02")] = 0
	}

	// スコア計算（TODO: 重みつけを調整）
	// Push: 1点 + (コミット数 × 0.5点)
	// PR作成: 5点
	// PRマージ: 10点
	for _, ev := range events {
		date := ev.OccurredAt.UTC().Format("2006-01-02")
		score := 0.0
		switch ev.Type {
		case model.EventTypePush:
			score += 1.0 + (float64(ev.PushCommitCount) * 0.5)
		case model.EventTypePullRequest:
			if ev.Action == "opened" {
				score += 5.0
			} else if ev.Action == "merged" || ev.PRIsMerged {
				score += 10.0
			} else {
				score += 2.0
			}
		}
		dailyScores[date] += score
	}

	// 開発の波を可視化するために移動平均を適用
	var points []MomentumPoint
	dates := make([]string, 0, len(dailyScores))
	for d := range dailyScores {
		dates = append(dates, d)
	}
	sort.Strings(dates)

	for i, date := range dates {
		val := dailyScores[date]
		count := 1.0
		if i > 0 {
			val += dailyScores[dates[i-1]]
			count++
		}
		if i > 1 {
			val += dailyScores[dates[i-2]]
			count++
		}

		points = append(points, MomentumPoint{
			Date:  date,
			Value: val / count,
		})
	}

	return points
}

// パンチカードの計算
func calculatePunchCard(events []model.Event) []PunchCardItem {
	counts := make([]int, 24)
	for _, ev := range events {
		hour := ev.OccurredAt.UTC().Hour() // UTC 時間での時間を使用
		counts[hour]++
	}

	items := make([]PunchCardItem, 24)
	for i := 0; i < 24; i++ {
		items[i] = PunchCardItem{Hour: i, Count: counts[i]}
	}
	return items
}

// 連続アクティビティの計算
func calculateStreak(events []model.Event, now time.Time) StreakInfo {
	activeDays := make(map[string]bool)
	for _, ev := range events {
		activeDays[ev.OccurredAt.UTC().Format("2006-01-02")] = true
	}

	current := 0
	longest := 0
	temp := 0

	checkDate := now

	// 現在の連続日数
	for i := 0; i < 365; i++ {
		d := checkDate.AddDate(0, 0, -i).Format("2006-01-02")
		if activeDays[d] {
			current++
		} else if i == 0 {
			// 今日にまだアクティビティがない場合、昨日がアクティブならすぐに連続を途切れさせない
			continue
		} else {
			break
		}
	}

	// 最長連続日数を計算
	var dates []string
	for d := range activeDays {
		dates = append(dates, d)
	}
	sort.Strings(dates)

	if len(dates) == 0 {
		return StreakInfo{Current: 0, Longest: 0}
	}

	temp = 1
	longest = 1
	lastDate, _ := time.Parse("2006-01-02", dates[0])

	for i := 1; i < len(dates); i++ {
		currDate, _ := time.Parse("2006-01-02", dates[i])
		diff := currDate.Sub(lastDate).Hours() / 24

		if diff <= 1.1 { // 1日以内の差なら連続とみなす
			temp++
		} else {
			if temp > longest {
				longest = temp
			}
			temp = 1
		}
		lastDate = currDate
	}
	if temp > longest {
		longest = temp
	}

	return StreakInfo{Current: current, Longest: longest}
}
