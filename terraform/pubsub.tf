# Webhook から受けとったイベントを Topic に送信
resource "google_project_iam_member" "cadence_receiver_pubsub" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.cadence_run.email}"
}

# cadence が Subscription からイベントを受信
resource "google_project_iam_member" "cadence_consumer_pubsub" {
  project = var.project_id
  role    = "roles/pubsub.subscriber"
  member  = "serviceAccount:${google_service_account.cadence_run.email}"
}
