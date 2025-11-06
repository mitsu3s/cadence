# Receiver からのイベントを送信するためのトピック
resource "google_pubsub_topic" "cadence_events" {
  name = "cadence-events"
}

# Processor がイベントを受信するためのサブスクリプション
resource "google_pubsub_subscription" "cadence_events_processor" {
  name  = "cadence-events-processor"
  topic = google_pubsub_topic.cadence_events.name

  ack_deadline_seconds = 30

  # 失敗したメッセージは自動再試行
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }

  # Processor が止まっている/落ちているときにメッセージを保持
  message_retention_duration = "1200s" # 20分
}
