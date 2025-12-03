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

variable "api_image_tag" {
  type        = string
  description = "Container image tag for cadence api"
}

variable "receiver_image_tag" {
  type        = string
  description = "Container image tag for cadence receiver"
}

variable "processor_image_tag" {
  type        = string
  description = "Container image tag for cadence processor"
}

variable "web_image_tag" {
  type        = string
  description = "Container image tag for cadence web"
}

variable "slack_notification_channel" {
  description = "Monitoring notification channel resource name"
  type        = string
}

variable "firebase_api_key" {
  type        = string
  description = "Firebase API Key"
  sensitive   = true
}

variable "firebase_auth_domain" {
  type        = string
  description = "Firebase Auth Domain"
}

variable "firebase_project_id" {
  type        = string
  description = "Firebase Project ID"
}

variable "firebase_storage_bucket" {
  type        = string
  description = "Firebase Storage Bucket"
}

variable "firebase_messaging_sender_id" {
  type        = string
  description = "Firebase Messaging Sender ID"
  sensitive   = true
}

variable "firebase_app_id" {
  type        = string
  description = "Firebase App ID"
  sensitive   = true
}
