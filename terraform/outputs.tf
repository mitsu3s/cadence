# 各サービスの現在のイメージタグを Google Cloud から出力
output "api_image_tag" {
  description = "Current image tag for cadence-api"
  value       = var.api_image_tag
}

output "receiver_image_tag" {
  description = "Current image tag for cadence-receiver"
  value       = var.receiver_image_tag
}

output "processor_image_tag" {
  description = "Current image tag for cadence-processor"
  value       = var.processor_image_tag
}

output "web_image_tag" {
  description = "Current image tag for cadence-web"
  value       = var.web_image_tag
}
