### cadence をユーザーが呼び出す Cloud Run サービス
resource "google_cloud_run_service" "cadence_api" {
  name     = "cadence-api"
  location = "asia-northeast1"

  template {
    spec {
      service_account_name = google_service_account.cadence_run.email

      containers {
        image = "asia-northeast1-docker.pkg.dev/${var.project_id}/cadence-repository/cadence-api:${var.image_tag}"

        ports {
          container_port = 8080
        }

        env {
          name  = "GOOGLE_CLOUD_PROJECT"
          value = var.project_id
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

### cadence api を呼び出す権限を全員に付与
resource "google_cloud_run_service_iam_member" "api_invoker" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.cadence_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

### cadence のイベントを受け取る Cloud Run サービス
resource "google_cloud_run_service" "cadence_receiver" {
  name     = "cadence-receiver"
  location = "asia-northeast1"

  template {
    spec {
      service_account_name = google_service_account.cadence_run.email

      containers {
        image = "asia-northeast1-docker.pkg.dev/${var.project_id}/cadence-repository/cadence-receiver:${var.receiver_image_tag}"

        ports {
          container_port = 8080
        }

        env {
          name  = "GOOGLE_CLOUD_PROJECT"
          value = var.project_id
        }

        env {
          name  = "PROJECT_ID"
          value = var.project_id
        }

        env {
          name  = "CADENCE_TOPIC"
          value = google_pubsub_topic.cadence_events.name
        }

        env {
          name = "GITHUB_APP_ID"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.github_app_id.secret_id
              key  = "latest" # 最新版を使う
            }
          }
        }

        env {
          name = "GITHUB_APP_PRIVATE_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.github_app_private_key.secret_id
              key  = "latest" # 最新版を使う
            }
          }
        }

        env {
          name = "GITHUB_WEBHOOK_SECRET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.github_webhook_secret.secret_id
              key  = "latest" # 最新版を使う
            }
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

### cadence receiver を呼び出す権限を全員に付与
resource "google_cloud_run_service_iam_member" "receiver_invoker" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.cadence_receiver.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}


### cadence の処理をする Cloud Run サービス
resource "google_cloud_run_service" "cadence_processor" {
  name     = "cadence-processor"
  location = "asia-northeast1"

  template {
    spec {
      service_account_name = google_service_account.cadence_run.email

      containers {
        image = "asia-northeast1-docker.pkg.dev/${var.project_id}/cadence-repository/cadence-processor:${var.processor_image_tag}"

        ports {
          container_port = 8080
        }

        env {
          name  = "GOOGLE_CLOUD_PROJECT"
          value = var.project_id
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

### cadence processor は receiver からのみ呼び出せるようにする
resource "google_cloud_run_service_iam_member" "processor_invoker" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.cadence_processor.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.cadence_run.email}"
}

### cadence のダッシュボードを表示する Cloud Run サービス
resource "google_cloud_run_service" "cadence_web" {
  name     = "cadence-web"
  location = "asia-northeast1"

  template {
    spec {
      service_account_name = google_service_account.cadence_run.email

      containers {
        image = "asia-northeast1-docker.pkg.dev/${var.project_id}/cadence-repository/cadence-web:${var.web_image_tag}"

        ports {
          container_port = 3000
        }

        env {
          name  = "API_BASE_URL"
          value = google_cloud_run_service.cadence_api.status[0].url
        }

        env {
          name  = "NEXT_PUBLIC_FIREBASE_API_KEY"
          value = var.firebase_api_key
        }

        env {
          name  = "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
          value = var.firebase_auth_domain
        }

        env {
          name  = "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
          value = var.firebase_project_id
        }

        env {
          name  = "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
          value = var.firebase_storage_bucket
        }

        env {
          name  = "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
          value = var.firebase_messaging_sender_id
        }

        env {
          name  = "NEXT_PUBLIC_FIREBASE_APP_ID"
          value = var.firebase_app_id
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

### cadence を呼び出す権限を全員に付与
resource "google_cloud_run_service_iam_member" "web_invoker" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.cadence_web.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
