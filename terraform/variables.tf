# Variables for EC2 instance configuration

variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance. Leave empty to use the latest Ubuntu 22.04 AMI."
  type        = string
  default     = "" 
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro" # t3 is often better and cheaper than t2 in many regions
}

variable "key_pair_name" {
  description = "Name of the existing EC2 key pair for SSH access"
  type        = string
  default     = "tf-key"
}


variable "root_volume_size" {
  description = "Size of the root volume in GB"
  type        = number
  default     = 20
}

variable "create_vpc" {
  description = "Whether to create a new VPC or use default"
  type        = bool
  default     = false
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for the subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "Availability zone for the subnet"
  type        = string
  default     = "us-east-1a"
}

variable "allocate_eip" {
  description = "Whether to allocate an Elastic IP address"
  type        = bool
  default     = false
}

# Tags
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "Student Management System"
    Environment = "Production"
    ManagedBy   = "Terraform"
    Application = "Student-Management"
  }
}