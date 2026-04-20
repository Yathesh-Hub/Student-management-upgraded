# Terraform version and provider requirements

terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Optional: Backend configuration for state management
  # Uncomment and configure for remote state storage
  /*
  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "student-app/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
  */
}