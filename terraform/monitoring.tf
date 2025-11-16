# Cadence Receiver の 5xx エラー発生を監視するアラートポリシー
# 5分間に 5xx エラーが 1 回でも発生したら通知を送信
resource "google_monitoring_alert_policy" "receiver_5xx" {
  display_name = "Cadence Receiver 5xx Alert"
  combiner     = "OR"
  severity     = "ERROR"

  # アラートの説明と調査手順
  documentation {
    mime_type = "text/markdown"
    content   = <<-EOT
      *What happened*
      Cadence receiver returned a 5xx response at least once.

      *Impact*
      - Client requests may be failing.
      - Check if this is isolated or affecting many users.

      *How to investigate*
      1. Open Cloud Run service **cadence-receiver** and check recent logs.
      2. Filter logs by `severity>=ERROR` and `httpRequest.status>=500`.
      3. Check recent deployments or config changes.
    EOT
  }

  conditions {
    display_name = "Receiver 5xx request count > 0"

    condition_threshold {
      # Cloud Run のリクエストカウントメトリクス
      # cadence-receiver ＆ 5xx に絞り込むフィルタ
      filter = <<-EOT
        metric.type="run.googleapis.com/request_count"
        resource.type="cloud_run_revision"
        resource.labels.service_name="cadence-receiver"
        metric.labels.response_code_class="5xx"
      EOT

      # 5分間に 1回でも 5xx が出たらアラート
      duration   = "0s"
      comparison = "COMPARISON_GT"
      # 少なくとも 1 回
      threshold_value = 0

      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_DELTA"
        cross_series_reducer = "REDUCE_SUM"
        group_by_fields = [
          "resource.labels.service_name",
        ]
      }
    }
  }

  notification_channels = [
    var.slack_notification_channel
  ]

  enabled = true
}
