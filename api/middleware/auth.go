package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"
	"sync"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/mitsu3s/cadence/logger"
	"google.golang.org/api/option"
)

var (
	app        *firebase.App
	authClient *auth.Client
	once       sync.Once
)

// Firebase App & Auth Client の初期化
func initFirebase() error {
	ctx := context.Background()
	var err error

	// 環境変数から認証情報のパスを取得
	opt := option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS"))

	// 環境変数がなければデフォルトの認証情報を使用
	if os.Getenv("GOOGLE_APPLICATION_CREDENTIALS") == "" {
		app, err = firebase.NewApp(ctx, nil)
	} else {
		app, err = firebase.NewApp(ctx, nil, opt)
	}

	if err != nil {
		return err
	}

	authClient, err = app.Auth(ctx)
	if err != nil {
		return err
	}
	return nil
}

// Firebase ID Token を検証するミドルウェア
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var err error
		once.Do(func() {
			err = initFirebase()
		})
		if err != nil {
			logger.LogErr("firebase init failed", "error", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "unauthorized: missing header", http.StatusUnauthorized)
			return
		}

		// Bearer トークンの形式を確認
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader {
			http.Error(w, "unauthorized: invalid header format", http.StatusUnauthorized)
			return
		}

		// トークンの検証
		decodedToken, err := authClient.VerifyIDToken(r.Context(), token)
		if err != nil {
			logger.LogErr("token verification failed", "error", err)
			http.Error(w, "unauthorized: invalid token", http.StatusUnauthorized)
			return
		}

		logger.LogInfo("authenticated user", "uid", decodedToken.UID)
		next(w, r)
	}
}
