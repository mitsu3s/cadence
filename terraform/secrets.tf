# Secret Managerにシークレットを作成
# シークレットごとに用意する
# replication はどのリージョンに置くか指定できるが、今回は制約もないため GCP 側に自動的に配置してもらう
resource "google_secret_manager_secret" "github_app_id" {
  secret_id = "github-app-id"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "github_app_private_key" {
  secret_id = "github-app-private-key"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "github_webhook_secret" {
  secret_id = "github-webhook-secret"
  replication {
    auto {}
  }
}

# それぞれに中身を登録
resource "google_secret_manager_secret_version" "github_app_id_v1" {
  secret      = google_secret_manager_secret.github_app_id.id
  secret_data = var.github_app_id
}

resource "google_secret_manager_secret_version" "github_app_private_key_v1" {
  secret      = google_secret_manager_secret.github_app_private_key.id
  secret_data = var.github_app_private_key
}

resource "google_secret_manager_secret_version" "github_webhook_secret_v1" {
  secret      = google_secret_manager_secret.github_webhook_secret.id
  secret_data = var.github_webhook_secret
}
