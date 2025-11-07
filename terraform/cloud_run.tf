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

### cadence の処理をする Cloud Run サービス
resource "google_cloud_run_service" "cadence_processor" {
  name     = "cadence-processor"
  location = var.region
  project  = var.project_id

  template {
    spec {
      service_account_name = google_service_account.cadence_run.email
      containers {
        image = "asia-northeast1-docker.pkg.dev/${var.project_id}/cadence/cadence-processor:${var.processor_image_tag}"

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
