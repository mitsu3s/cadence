package model

import "time"

type Installation struct {
	ID           int64     `firestore:"id"`
	AccountLogin string    `firestore:"account_login"` // どの GitHub アカウントにインストールされているか
	AccountType  string    `firestore:"account_type"`  // User or Organization
	Repositories []string  `firestore:"repositories"`  // インストールされているリポジトリ一覧
	Active       bool      `firestore:"active"`
	UpdatedAt    time.Time `firestore:"updated_at"`
	DeletedAt    time.Time `firestore:"deleted_at,omitempty"`
}
