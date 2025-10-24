# Cloud Run 用のサービスアカウント作成
resource "google_service_account" "cadence_run" {
  account_id   = "cadence-run"
  display_name = "Cadence Cloud Run Service Account"
}

# Firestore (Datastore) の権限付与
resource "google_project_iam_member" "cadence_firestore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.cadence_run.email}"  # 上で作成したサービスアカウントを指定
}
