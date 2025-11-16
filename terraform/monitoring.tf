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

# Pub/Sub の backlog（未処理メッセージ）を監視するアラートポリシー
resource "google_monitoring_alert_policy" "pubsub_backlog" {
  display_name = "Cadence PubSub Backlog"
  combiner     = "OR"
  severity     = "WARNING"

  documentation {
    mime_type = "text/markdown"
    content   = <<-EOT
      *What happened*
      Pub/Sub subscription **cadence-events-processor** has undelivered messages for several minutes.

      *Impact*
      - Cadence processor may be slow or failing to keep up with incoming events.
      - Recent GitHub events may not yet be visible in dashboards.

      *How to investigate*
      1. Check Cloud Run service **cadence-processor** for errors or high latency.
      2. Verify Pub/Sub subscription **cadence-events-processor** is healthy.
      3. Look for recent deployments or configuration changes.
    EOT
  }

  conditions {
    display_name = "Pub/Sub backlog > 0"

    condition_threshold {
      filter = <<-EOT
        metric.type="pubsub.googleapis.com/subscription/num_undelivered_messages"
        resource.type="pubsub_subscription"
        resource.labels.subscription_id="cadence-events-processor"
      EOT

      # 5分間に 1件以上 backlog があればアラート
      duration        = "0s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0

      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_MAX"
        cross_series_reducer = "REDUCE_MAX"
      }
    }
  }

  notification_channels = [
    var.slack_notification_channel,
  ]

  enabled = true
}


# Processor の SaveEvent エラーを監視するアラートポリシー
# 5分間に 1 回でも SaveEvent エラーが発生したら通知を送信
resource "google_monitoring_alert_policy" "processor_save_event_error" {
  display_name = "Cadence Processor SaveEvent Error"
  combiner     = "OR"
  severity     = "ERROR"

  documentation {
    mime_type = "text/markdown"
    content   = <<-EOT
      *What happened*
      Cadence processor failed to save an event.

      *Impact*
      - Incoming GitHub events may not be stored in Firestore.
      - Dashboards and metrics may miss some events.

      *How to investigate*
      1. Open Cloud Run service **cadence-processor** and check recent logs.
      2. Filter logs by `component="processor"`, `operation="SaveEvent"`, `status="error"`.
      3. Check Firestore availability and recent deployments.
    EOT
  }

  conditions {
    display_name = "Processor SaveEvent errors > 0"

    condition_threshold {
      # ログベースメトリクスを参照
      filter = <<-EOT
        metric.type="logging.googleapis.com/user/processor_save_event_error_count"
        AND resource.type="cloud_run_revision"
      EOT

      # 1分間に 1回でもあればアラート
      duration        = "0s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0

      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_DELTA"
        cross_series_reducer = "REDUCE_SUM"
      }
    }
  }

  depends_on = [
    google_logging_metric.processor_save_event_error_count,
  ]

  notification_channels = [
    var.slack_notification_channel,
  ]

  enabled = true
}

# processor が SaveEvent に失敗した回数をカウントするログベースメトリクス
resource "google_logging_metric" "processor_save_event_error_count" {
  name        = "processor_save_event_error_count"
  description = "Count of processor SaveEvent errors"

  # cadence-processor の Cloud Run ログのうち、SaveEvent かつ error だけを対象
  filter = <<-EOT
    resource.type="cloud_run_revision"
    resource.labels.service_name="cadence-processor"
    severity>=ERROR
    jsonPayload.component="processor"
    jsonPayload.operation="SaveEvent"
    jsonPayload.status="error"
  EOT

  metric_descriptor {
    metric_kind = "DELTA"
    value_type  = "INT64"
    unit        = "1"
  }
}
