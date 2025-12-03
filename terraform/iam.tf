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

# Publisher の権限
# Cloud Run の サービスアカウントに付与（将来的には Webhook 用の別サービスアカウントに分ける）
resource "google_project_iam_member" "cadence_receiver_pubsub" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.cadence_run.email}"
}

# Subscriber の権限
# Cloud Run の サービスアカウントに付与（将来的には Processor 用の別サービスアカウントに分ける）
resource "google_project_iam_member" "cadence_processor_pubsub" {
  project = var.project_id
  role    = "roles/pubsub.subscriber"
  member  = "serviceAccount:${google_service_account.cadence_run.email}"
}

# Secret Manager の App ID 読み取り権限
# Cloud Run の サービスアカウントに付与
resource "google_secret_manager_secret_iam_member" "receiver_can_read_app_id" {
  secret_id = google_secret_manager_secret.github_app_id.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cadence_run.email}"
}

# Secret Manager の Private Key 読み取り権限
# Cloud Run の サービスアカウントに付与
resource "google_secret_manager_secret_iam_member" "receiver_can_read_private_key" {
  secret_id = google_secret_manager_secret.github_app_private_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cadence_run.email}"
}

# Secret Manager の Webhook Secret 読み取り権限
# Cloud Run の サービスアカウントに付与
resource "google_secret_manager_secret_iam_member" "receiver_can_read_webhook_secret" {
  secret_id = google_secret_manager_secret.github_webhook_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cadence_run.email}"
}

# Secret Manager の OAuth Client ID 読み取り権限
# Cloud Run の サービスアカウントに付与
resource "google_secret_manager_secret_iam_member" "web_can_read_oauth_client_id" {
  secret_id = google_secret_manager_secret.github_oauth_client_id.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cadence_run.email}"
}

# Secret Manager の OAuth Client Secret 読み取り権限
# Cloud Run の サービスアカウントに付与
resource "google_secret_manager_secret_iam_member" "web_can_read_oauth_client_secret" {
  secret_id = google_secret_manager_secret.github_oauth_client_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cadence_run.email}"
}


# GitHub Actions 用のサービスアカウント
resource "google_service_account" "cadence_ci" {
  account_id   = "cadence-ci"
  display_name = "Cadence CI Service Account"
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
resource "google_project_iam_member" "cadence_ci_storage_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Service Account の Admin 権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_sa_admin" {
  project = var.project_id
  role    = "roles/iam.serviceAccountAdmin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Project IAM Admin 権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_pj_iam_admin" {
  project = var.project_id
  role    = "roles/resourcemanager.projectIamAdmin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Workload Identity の Admin 権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_wip_admin" {
  project = var.project_id
  role    = "roles/iam.workloadIdentityPoolAdmin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Secret Manager の Admin 権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_secret_admin" {
  project = var.project_id
  role    = "roles/secretmanager.admin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Firestore の Admin 権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_datastore_admin" {
  project = var.project_id
  role    = "roles/datastore.indexAdmin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Pub/Sub の Admin 権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_pubsub_admin" {
  project = var.project_id
  role    = "roles/pubsub.admin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Monitoring の Admin 権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_monitoring_admin" {
  project = var.project_id
  role    = "roles/monitoring.admin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Logging の Admin 権限
# GitHub Actions 用のサービスアカウントに付与
resource "google_project_iam_member" "cadence_ci_logging_admin" {
  project = var.project_id
  role    = "roles/logging.admin"
  member  = "serviceAccount:${google_service_account.cadence_ci.email}"
}

resource "google_service_account_iam_member" "cadence_ci_cloud_run" {
  service_account_id = google_service_account.cadence_run.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.cadence_ci.email}"
}

# Workload Identity Federation の権限
# GitHub Actions からのアクセスを許可するための設定
# 指定方法は principalSet を使う
resource "google_service_account_iam_member" "cadence_ci_wif_user" {
  service_account_id = google_service_account.cadence_ci.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/projects/${var.project_number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.github_pool.workload_identity_pool_id}/attribute.repository/${var.github_owner}/${var.github_repo}"
}

# Service Account の Admin 権限
# GitHub IDグループに対しての Pool 単位での付与
resource "google_project_iam_member" "actions_sa_admin" {
  project = var.project_id
  role    = "roles/iam.serviceAccountAdmin"
  member  = "principalSet://iam.googleapis.com/projects/${var.project_number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.github_pool.workload_identity_pool_id}/attribute.repository/${var.github_owner}/${var.github_repo}"
}

# Workload Identity の Admin 権限
# GitHub IDグループに対しての Pool 単位での付与
resource "google_project_iam_member" "actions_wip_admin" {
  project = var.project_id
  role    = "roles/iam.workloadIdentityPoolAdmin"
  member  = "principalSet://iam.googleapis.com/projects/${var.project_number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.github_pool.workload_identity_pool_id}/attribute.repository/${var.github_owner}/${var.github_repo}"
}
