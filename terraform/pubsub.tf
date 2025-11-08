# Receiver からのイベントを送信するためのトピック
resource "google_pubsub_topic" "cadence_events" {
  name = "cadence-events"
}

# Processor がイベントを受信するためのサブスクリプション
resource "google_pubsub_subscription" "cadence_events_processor" {
  name  = "cadence-events-processor"
  topic = google_pubsub_topic.cadence_events.name

  push_config {
    # Cloud Run cadence-processor の /pubsub に配信
    push_endpoint = "${google_cloud_run_service.cadence_processor.status[0].url}/pubsub"

    # Pub/Sub が OIDC トークンを付けて呼ぶ設定
    oidc_token {
      service_account_email = google_service_account.cadence_run.email
      audience              = "${google_cloud_run_service.cadence_processor.status[0].url}/pubsub"
    }
  }

  ack_deadline_seconds = 30

  # 失敗したメッセージは自動再試行
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }

  # Processor が止まっている/落ちているときにメッセージを保持
  message_retention_duration = "1200s" # 20分
}
