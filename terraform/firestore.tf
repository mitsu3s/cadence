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

# アクティブな installations をアカウントログインで取得するための Firestore インデックス
resource "google_firestore_index" "installations_by_account_active" {
  project    = var.project_id
  collection = "installations"

  fields {
    field_path = "account_login"
    order      = "ASCENDING"
  }

  fields {
    field_path = "active"
    order      = "ASCENDING"
  }
}
