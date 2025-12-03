# Secret Managerにシークレットを作成
# シークレットごとに用意する
# replication はどのリージョンに置くか指定できるが、今回は制約もないため GCP 側に自動的に配置してもらう
# Secret の値は Secret Manager に直接投入すべきであるため、Terraform では管理しない
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

resource "google_secret_manager_secret" "github_oauth_client_id" {
  secret_id = "github-oauth-client-id"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "github_oauth_client_secret" {
  secret_id = "github-oauth-client-secret"
  replication {
    auto {}
  }
}
