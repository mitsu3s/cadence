package store

import (
	"context"
	"time"

	"github.com/mitsu3s/cadence/model"
)

type EventQuery struct {
	Repo  string
	Type  string
	Since time.Time
	Until time.Time
	Limit int
}

type Store interface {
	SaveEvent(ctx context.Context, ev model.Event) error
	ListEvents(ctx context.Context, query EventQuery) ([]model.Event, error)
	Close() error
}
