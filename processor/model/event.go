package model

import "time"

type Event struct {
	ID         string         `firestore:"id"`
	Type       string         `firestore:"type"`
	Repository string         `firestore:"repository"`
	Action     string         `firestore:"action"`
	Title      string         `firestore:"title"`
	CreatedAt  time.Time      `firestore:"created_at"`
	ReceivedAt time.Time      `firestore:"received_at"`
	Raw        map[string]any `firestore:"raw,omitempty"`
}
