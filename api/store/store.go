package store

import (
	"context"

	"github.com/mitsu3s/cadence/model"
)

type Store interface {
	SaveEvent(ctx context.Context, ev model.Event) error
	Close() error
}
