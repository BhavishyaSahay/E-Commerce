variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "mongodb_uri" {
  description = "MongoDB Connection URI"
  type        = string
  sensitive   = true
}
