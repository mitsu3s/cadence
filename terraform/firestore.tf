# リポジトリの指定でイベントを取得するための Firestore インデックス
resource "google_firestore_index" "events_by_repository" {
  project    = var.project_id
  collection = "events"

  fields {
    field_path = "repository"
    order      = "ASCENDING"
  }

  fields {
    field_path = "received_at"
    order      = "DESCENDING"
  }
}

# イベントタイプの指定でイベントを取得するための Firestore インデックス
resource "google_firestore_index" "events_by_type" {
  project    = var.project_id
  collection = "events"

  fields {
    field_path = "type"
    order      = "ASCENDING"
  }

  fields {
    field_path = "received_at"
    order      = "DESCENDING"
  }
}

# リポジトリ単位イベントを取得するための Firestore インデックス
resource "google_firestore_index" "events_by_repo_occurred_at" {
  project    = var.project_id
  collection = "events"

  fields {
    field_path = "repo"
    order      = "ASCENDING"
  }

  fields {
    field_path = "occurred_at"
    order      = "ASCENDING"
  }
}
