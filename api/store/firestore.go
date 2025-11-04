package store

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/mitsu3s/cadence/logger"
	"github.com/mitsu3s/cadence/model"

	"cloud.google.com/go/firestore"
)

type fireStore struct {
	client *firestore.Client
}

func NewFirestore(ctx context.Context) (*fireStore, error) {
	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	if projectID == "" {
		return nil, fmt.Errorf("GOOGLE_CLOUD_PROJECT is not set")
	}

	// firestore クライアントの作成
	// firestore はプロジェクトIDから識別
	c, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return &fireStore{client: c}, nil
}

func (s *fireStore) SaveEvent(ctx context.Context, ev model.Event) error {
	if ev.ReceivedAt.IsZero() {
		ev.ReceivedAt = time.Now()
	}

	// コレクション: events / ドキュメントID: ev.ID（なければAutoID）
	// cadence のは events コレクションに保存
	ref := s.client.Collection("events")
	if ev.ID != "" {
		_, err := ref.Doc(ev.ID).Set(ctx, ev)
		return err
	}
	_, _, err := ref.Add(ctx, ev)
	return err
}

func (s *fireStore) ListEvents(ctx context.Context, query EventQuery) ([]model.Event, error) {
	col := s.client.Collection("events")
	fireStoreQuery := col.Query

	logger.LogInfo("Querying events", "repo", query.Repo, "type", query.Type, "since", query.Since, "limit", query.Limit)

	// クエリパラメータに応じてフィルタリング
	if query.Repo != "" {
		fireStoreQuery = fireStoreQuery.Where("repository", "==", query.Repo)
	}
	if query.Type != "" {
		fireStoreQuery = fireStoreQuery.Where("type", "==", query.Type)
	}
	if !query.Since.IsZero() {
		fireStoreQuery = fireStoreQuery.Where("received_at", ">=", query.Since)
	}
	if !query.Until.IsZero() {
		fireStoreQuery = fireStoreQuery.Where("received_at", "<=", query.Until)
	}

	fireStoreQuery = fireStoreQuery.OrderBy("received_at", firestore.Desc)

	limit := query.Limit
	if limit <= 0 || limit > 500 {
		limit = 200 // 集計なので少し多め
	}
	fireStoreQuery = fireStoreQuery.Limit(limit)

	// events コレクションから受信日時の降順で limit 件取得
	docs, err := fireStoreQuery.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	// ドキュメントを model.Event に変換して返す
	events := make([]model.Event, 0, len(docs))
	for _, d := range docs {
		var ev model.Event
		if err := d.DataTo(&ev); err != nil {
			return nil, err
		}
		events = append(events, ev)
	}

	return events, nil
}

func (s *fireStore) Close() error {
	return s.client.Close()
}
