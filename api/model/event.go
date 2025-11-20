package model

import (
	"time"
)

// イベントの種類
type EventType string

const (
	EventTypePullRequest EventType = "pull_request"
	EventTypePush        EventType = "push"
)

// イベントモデル
type Event struct {
	ID              string         `firestore:"id"`
	Type            EventType      `firestore:"type"`
	Repo            string         `firestore:"repo"`
	Actor           string         `firestore:"actor"`
	Action          string         `firestore:"action"`
	OccurredAt      time.Time      `firestore:"occurred_at"`
	ReceivedAt      time.Time      `firestore:"received_at"`
	PRNumber        int            `firestore:"pr_number,omitempty"`
	PRTitle         string         `firestore:"pr_title,omitempty"`
	PRIsMerged      bool           `firestore:"pr_is_merged,omitempty"`
	PRBaseBranch    string         `firestore:"pr_base_branch,omitempty"`
	PushCommitCount int            `firestore:"push_commit_count,omitempty"`
	PushBranch      string         `firestore:"push_branch,omitempty"`
	Raw             map[string]any `firestore:"raw,omitempty"`
}
