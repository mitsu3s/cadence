package store

import (
	"context"
	"os"
	"time"

	"github.com/mitsu3s/cadence/model"

	"cloud.google.com/go/firestore"
)

type FS struct {
	client *firestore.Client
}

func NewFirestore(ctx context.Context) (*FS, error) {
	// Cloud Run では GOOGLE_CLOUD_PROJECT が入っています
	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	if projectID == "" {
		// gcloud run deploy --set-env-vars=GOOGLE_CLOUD_PROJECT=... でもOK
		return nil, ErrProjectIDMissing
	}
	c, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return &FS{client: c}, nil
}

func (s *FS) SaveEvent(ctx context.Context, ev model.Event) error {
	if ev.ReceivedAt.IsZero() {
		ev.ReceivedAt = time.Now()
	}
	// コレクション: events / ドキュメントID: ev.ID（なければAutoID）
	ref := s.client.Collection("events")
	if ev.ID != "" {
		_, err := ref.Doc(ev.ID).Set(ctx, ev)
		return err
	}
	_, _, err := ref.Add(ctx, ev)
	return err
}

func (s *FS) Close() error {
	return s.client.Close()
}

// ---- エラー（最小）
var ErrProjectIDMissing = &argError{"GOOGLE_CLOUD_PROJECT not set"}

type argError struct{ msg string }

func (e *argError) Error() string { return e.msg }
