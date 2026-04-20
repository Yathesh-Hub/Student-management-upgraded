# Output definitions for Terraform deployment

output "instance_details" {
  description = "Details of the created EC2 instance"
  value = {
    id         = aws_instance.student_app_instance.id
    public_ip  = aws_instance.student_app_instance.public_ip
    private_ip = aws_instance.student_app_instance.private_ip
    az         = aws_instance.student_app_instance.availability_zone
    arn        = aws_instance.student_app_instance.arn
  }
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.student_app_sg.id
}

output "vpc_id" {
  description = "ID of the VPC (if created)"
  value       = var.create_vpc ? aws_vpc.student_app_vpc[0].id : null
}

output "subnet_id" {
  description = "ID of the subnet (if created)"
  value       = var.create_vpc ? aws_subnet.student_app_subnet[0].id : null
}

output "application_endpoints" {
  description = "Application access endpoints"
  value = {
    web_ui        = "http://${aws_instance.student_app_instance.public_ip}"
    api           = "http://${aws_instance.student_app_instance.public_ip}:5000"
    api_docs      = "http://${aws_instance.student_app_instance.public_ip}:5000/api-docs"
    mongodb_admin = "http://${aws_instance.student_app_instance.public_ip}:8081" # If using Mongo Express
  }
}

output "ssh_connection" {
  description = "SSH connection details"
  value = {
    command = "ssh -i ${var.key_pair_name}.pem ubuntu@${aws_instance.student_app_instance.public_ip}"
    user    = "ubuntu"
    host    = aws_instance.student_app_instance.public_ip
  }
}

output "deployment_instructions" {
  description = "Instructions for deploying the application"
  value = <<-EOT
  Deployment Instructions:
  1. SSH into the instance: ssh -i ${var.key_pair_name}.pem ubuntu@${aws_instance.student_app_instance.public_ip}
  2. Clone your repository: git clone https://github.com/your-repo/student-management.git /opt/student-app
  3. Copy your application files to /opt/student-app
  4. Update the .env file with your configuration
  5. Start the application: sudo systemctl start student-app.service
  6. Check logs: sudo journalctl -u student-app.service -f
  
  Application will be available at:
  - Web UI: http://${aws_instance.student_app_instance.public_ip}
  - API: http://${aws_instance.student_app_instance.public_ip}:5000
  EOT
}