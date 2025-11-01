package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

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

		events, err := st.ListEvents(r.Context(), limit)
		if err != nil {
			http.Error(w, "failed to list events", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(events)
	}
}
