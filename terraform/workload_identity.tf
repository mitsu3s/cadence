# Github の Workload Identity Pool
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "github-pool"
  display_name              = "GitHub OIDC Pool"
  description               = "OIDC identities from GitHub Actions"
}

# Workload Identity Pool の中に GitHub Actions 用のプロバイダを作成
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-actions"
  display_name                       = "GitHub Actions"
  description                        = "Trust GitHub Actions OIDC tokens"

  # GitHub の OIDC issuer
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  # Github の OIDC トークンを GCP の属性にマッピング
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }

  # アクセスできるリポジトリを制限
  attribute_condition = "assertion.repository == \"${var.github_owner}/${var.github_repo}\""
}
