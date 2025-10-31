# Cloud Run 用のサービスアカウント
resource "google_service_account" "cadence_run" {
  account_id   = "cadence-run"
  display_name = "Cadence Cloud Run Service Account"
}

# Firestore (Datastore) の アクセス権限
# Cloud Run の サービスアカウントに付与
resource "google_project_iam_member" "cadence_firestore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.cadence_run.email}"
}

# Artifact Registry の 読み取り権限
# Cloud Run の サービスアカウントに付与
resource "google_project_iam_member" "cadence_ar_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.cadence_run.email}"
}


# GitHub Actions 用のサービスアカウント
resource "google_service_account" "cadence_ci" {
  account_id   = "cadence-ci"
  display_name = "Cadence CI Service Account"
}

# Workload Identity Federation の権限
# GitHub Actions 用のサービスアカウントに付与
# 指定方法は principalSet を使う
resource "google_service_account_iam_member" "cadence_ci_wif_user" {
  service_account_id = google_service_account.cadence_ci.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/projects/${var.project_number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.github_pool.workload_identity_pool_id}/attribute.repository/${var.github_owner}/${var.github_repo}"
}

# Artifact Registry の 書き込み権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_ar_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Cloud Run 管理者権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# GCS を list する権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_storage_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}
