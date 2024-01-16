
variable AWS_SECRET_ACCESS_KEY {}

variable AWS_ACCESS_KEY_ID {}

variable AWS_SECRET_ACCESS_KEY {}

variable AWS_REGION {}



terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.32.1"
    }
  }
}

provider "aws" {
  region  = var.AWS_REGION
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}