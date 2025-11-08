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

### cadence API を呼び出す権限を全員に付与
resource "google_cloud_run_service_iam_member" "api_invoker" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.cadence_api.name
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

### processor は receiver からのみ呼び出せるようにする
resource "google_cloud_run_service_iam_member" "processor_invoker" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.cadence_processor.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.cadence_run.email}"
}
