package handler

import (
	"encoding/json"
	"net/http"

	"github.com/mitsu3s/cadence/logger"
	"github.com/mitsu3s/cadence/store"
)

type UserReposResponse struct {
	Repositories []string `json:"repositories"`
}

func ListUserRepos(st store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := r.URL.Query().Get("user")
		if user == "" {
			http.Error(w, "user is required", http.StatusBadRequest)
			return
		}

		repos, err := st.ListRepositories(r.Context(), user)
		if err != nil {
			logger.LogErr("failed to list user repos", "user", user, "error", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		resp := UserReposResponse{
			Repositories: repos,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			logger.LogErr("failed to encode response", "error", err)
		}
	}
}
