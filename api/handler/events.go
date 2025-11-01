package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/mitsu3s/cadence/store"
)

func ListEvents(st store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// ?limit=50 とか受けられるようにしておく
		limit := 20
		if q := r.URL.Query().Get("limit"); q != "" {
			if v, err := strconv.Atoi(q); err == nil && v > 0 && v <= 200 {
				limit = v
			}
		}

		repo := r.URL.Query().Get("repo")
		evType := r.URL.Query().Get("type")

		var sinceStr time.Time
		if since := r.URL.Query().Get("since"); since != "" {
			parsedSince, err := time.Parse(time.RFC3339, since)
			if err == nil {
				sinceStr = parsedSince
			}
		}

		events, err := st.ListEvents(r.Context(), store.EventQuery{
			Repo:  repo,
			Type:  evType,
			Since: sinceStr,
			Limit: limit,
		})
		if err != nil {
			http.Error(w, "failed to list events", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(events)
	}
}
