package store

import (
	"context"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/mitsu3s/cadence/logger"
	"github.com/mitsu3s/cadence/model"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

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

func (s *fireStore) SaveInstallation(ctx context.Context, inst model.Installation) error {
	if inst.ID == 0 {
		return fmt.Errorf("installation ID is required")
	}

	if inst.UpdatedAt.IsZero() {
		inst.UpdatedAt = time.Now()
	}

	// installations コレクションに保存
	docID := strconv.FormatInt(inst.ID, 10)
	_, err := s.client.Collection("installations").Doc(docID).Set(ctx, inst)

	return err
}

func (s *fireStore) UpdateInstallationRepositories(ctx context.Context, installationID int64, added []string, removed []string) error {
	if installationID == 0 {
		return fmt.Errorf("installation ID is required")
	}

	docID := strconv.FormatInt(installationID, 10)
	docRef := s.client.Collection("installations").Doc(docID)

	updates := []firestore.Update{}

	if len(added) > 0 {
		// repositories フィールドに重複なしで追加
		vals := make([]interface{}, 0, len(added))
		for _, r := range added {
			vals = append(vals, r)
		}
		updates = append(updates, firestore.Update{
			Path:  "repositories",
			Value: firestore.ArrayUnion(vals...),
		})
	}

	if len(removed) > 0 {
		// repositories から削除
		vals := make([]interface{}, 0, len(removed))
		for _, r := range removed {
			vals = append(vals, r)
		}
		updates = append(updates, firestore.Update{
			Path:  "repositories",
			Value: firestore.ArrayRemove(vals...),
		})
	}

	if len(updates) == 0 {
		// 何も変更ないなら何もしない
		return nil
	}

	// updated_at もついでに更新しておく
	updates = append(updates, firestore.Update{
		Path:  "updated_at",
		Value: time.Now(),
	})

	_, err := docRef.Update(ctx, updates)
	if err != nil {
		// Firestore のドキュメントが存在しない場合
		if status.Code(err) == codes.NotFound {
			return fmt.Errorf("installation %d not found", installationID)
		}
		return err
	}
	return nil
}

func (s *fireStore) Close() error {
	return s.client.Close()
}
