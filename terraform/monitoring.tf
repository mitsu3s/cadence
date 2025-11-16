# Cadence の 状態を通知する Slack チャンネル
resource "google_monitoring_notification_channel" "slack_cadence" {
  display_name = "Cadence Slack Alerts"
  type         = "slack"

  labels = {
    # Monitoring API から渡す Slack Webhook URL
    "webhook_url" = var.slack_webhook_url
  }

  # チャネルを削除するときの確認ダイアログを抑制
  force_delete = true
}

# Cadence Receiver の 5xx エラー発生を監視するアラートポリシー
# 5分間に 5xx エラーが 1 回でも発生したら通知を送信
resource "google_monitoring_alert_policy" "receiver_5xx" {
  display_name = "Cadence Receiver 5xx Alert"
  combiner     = "OR"

  conditions {
    display_name = "Receiver 5xx request count > 0 (5m)"

    condition_threshold {
      # Cloud Run のリクエストカウントメトリクス
      # cadence-receiver ＆ 5xx に絞り込むフィルタ
      filter = <<-EOT
        metric.type="run.googleapis.com/request_count"
        resource.type="cloud_run_revision"
        resource.labels.service_name="cadence-receiver"
        metric.labels.response_code_class="5xx"
      EOT

      # 5分間のウィンドウで評価
      duration   = "300s"
      comparison = "COMPARISON_GT"
      # 少なくとも 1 回
      threshold_value = 0

      # 時系列のまとめ方（集計方法）
      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_DELTA"
        cross_series_reducer = "REDUCE_SUM"
        group_by_fields = [
          "resource.labels.service_name",
        ]
      }
    }
  }

  notification_channels = [
    google_monitoring_notification_channel.slack_cadence.name,
  ]

  enabled = true
}
