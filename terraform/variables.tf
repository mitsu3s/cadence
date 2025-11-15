# 変数定義
variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type        = string
  description = "Region for GCP resources"
}

variable "github_owner" {
  type        = string
  description = "GitHub repository owner"

}

variable "github_repo" {
  type        = string
  description = "GitHub repository name"
}

variable "project_number" {
  type        = string
  description = "Numeric Google project number"
}

variable "image_tag" {
  type        = string
  description = "Container image tag to deploy"
}

variable "receiver_image_tag" {
  type        = string
  description = "Container image tag for cadence receiver"
}

variable "processor_image_tag" {
  type        = string
  description = "Container image tag for cadence processor"
}

variable "github_app_id" {
  type        = string
  description = "GitHub App ID"
  sensitive   = true
}

variable "github_app_private_key" {
  type        = string
  description = "GitHub App private key"
  sensitive   = true
}

variable "github_webhook_secret" {
  type        = string
  description = "GitHub Webhook secret used for signature verification"
  sensitive   = true
}

variable "slack_webhook_url" {
  type        = string
  description = "Slack Webhook URL for sending notifications"
  sensitive   = true

}
