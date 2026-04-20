# Terraform Configuration for Student Management Application EC2 Deployment

This Terraform configuration provisions an EC2 instance for deploying the Student Management Application, compatible with your existing Jenkins pipeline.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured (`aws configure`)
3. **Terraform** installed (version >= 1.0.0)
4. **Existing EC2 Key Pair** for SSH access
5. **Git** for cloning your repository

## Directory Structure

```
terraform/
├── main.tf              # Main Terraform configuration
├── variables.tf         # Input variables
├── outputs.tf          # Output values
├── versions.tf         # Terraform version and providers
├── terraform.tfvars.example  # Example variable values
└── README.md           # This file
```

## Configuration

### 1. Copy the example variables file

```bash
cp terraform.tfvars.example terraform.tfvars
```

### 2. Update `terraform.tfvars` with your values

```hcl
aws_region      = "us-east-1"
ami_id          = "ami-0c55b159cbfafe1f0" # Ubuntu 22.04 LTS
instance_type   = "t2.micro"
key_pair_name   = "your-existing-key-pair-name"  # IMPORTANT: Update this!
root_volume_size = 20
create_vpc      = false
allocate_eip     = false
```

### 3. Create an EC2 Key Pair (if you don't have one)

```bash
# Create a new key pair
ssh-keygen -t rsa -b 4096 -f student-app-key.pem
chmod 400 student-app-key.pem

# Import to AWS (if needed)
aws ec2 import-key-pair \
  --key-name "student-app-key" \
  --public-key-material fileb://student-app-key.pub
```

## Deployment

### Initialize Terraform

```bash
cd terraform
terraform init
```

### Plan the deployment

```bash
terraform plan
```

### Apply the configuration

```bash
terraform apply
```

Type `yes` when prompted to confirm.

### Destroy resources (when no longer needed)

```bash
terraform destroy
```

## Instance Configuration

The EC2 instance is configured with:

- **Ubuntu 22.04 LTS** (default AMI)
- **t2.micro** instance type (free tier eligible)
- **20GB** root volume (encrypted)
- **Security group** with ports:
  - 22 (SSH)
  - 80 (HTTP)
  - 5000 (Application API)
  - 27017 (MongoDB)

### User Data Script

The instance includes a user data script that automatically installs:

- Docker and Docker Compose
- Node.js 18.x
- MongoDB
- Systemd service for automatic startup

## Integration with Jenkins

### Option 1: Jenkins Pipeline Integration

Update your Jenkinsfile to include Terraform deployment:

```groovy
stage('Terraform Deploy') {
  steps {
    dir('terraform') {
      sh 'terraform init'
      sh 'terraform apply -auto-approve'
    }
  }
}
```

### Option 2: Separate Deployment Pipeline

Create a new Jenkins pipeline for infrastructure deployment:

```groovy
pipeline {
  agent any
  
  stages {
    stage('Terraform Init') {
      steps {
        sh 'cd terraform && terraform init'
      }
    }
    
    stage('Terraform Apply') {
      steps {
        sh 'cd terraform && terraform apply -auto-approve'
      }
    }
    
    stage('Deploy Application') {
      steps {
        script {
          def instance_ip = sh(script: 'cd terraform && terraform output -raw public_ip', returnStdout: true).trim()
          sh "scp -i student-app-key.pem -r ../backend ubuntu@${instance_ip}:/opt/student-app/"
          sh "scp -i student-app-key.pem -r ../frontend ubuntu@${instance_ip}:/opt/student-app/"
          sh "ssh -i student-app-key.pem ubuntu@${instance_ip} 'sudo systemctl restart student-app.service'"
        }
      }
    }
  }
}
```

## Application Deployment

After the EC2 instance is created:

1. **SSH into the instance**:
   ```bash
   ssh -i student-app-key.pem ubuntu@<instance-public-ip>
   ```

2. **Deploy your application**:
   ```bash
   # Clone your repository
   cd /opt/student-app
   git clone https://github.com/your-repo/student-management.git .
   
   # Or copy files manually
   scp -i student-app-key.pem -r ../backend ubuntu@<instance-ip>:/opt/student-app/
   scp -i student-app-key.pem -r ../frontend ubuntu@<instance-ip>:/opt/student-app/
   ```

3. **Start the application**:
   ```bash
   sudo systemctl start student-app.service
   sudo systemctl status student-app.service
   ```

4. **View logs**:
   ```bash
   sudo journalctl -u student-app.service -f
   ```

## Accessing the Application

After deployment, access your application at:

- **Web UI**: `http://<instance-public-ip>`
- **API**: `http://<instance-public-ip>:5000`
- **MongoDB**: `mongodb://<instance-public-ip>:27017/student_management`

## Security Considerations

1. **Key Pair Security**: Keep your `.pem` file secure and never commit it to version control
2. **Security Groups**: Restrict SSH access (port 22) to specific IPs in production
3. **Environment Variables**: Use AWS Secrets Manager or Parameter Store for sensitive data
4. **IAM Roles**: Review and restrict IAM permissions based on least privilege principle
5. **Regular Updates**: Apply security patches regularly

## Cost Optimization

- Use `t2.micro` for development/testing (free tier eligible)
- Consider `t3.micro` or `t3.small` for production
- Enable instance stop/start scheduling for non-production environments
- Use Spot Instances for fault-tolerant workloads
- Monitor costs with AWS Cost Explorer

## Troubleshooting

### SSH Connection Issues
```bash
# Check key permissions
chmod 400 student-app-key.pem

# Verify security group allows SSH
aws ec2 describe-security-groups --group-ids <sg-id>

# Check instance status
aws ec2 describe-instances --instance-ids <instance-id>
```

### Application Not Starting
```bash
# Check systemd service status
sudo systemctl status student-app.service

# View service logs
sudo journalctl -u student-app.service -f

# Check Docker status
sudo docker ps
sudo docker logs student-app
```

### Terraform Errors
```bash
# Reinitialize Terraform
terraform init -reconfigure

# Validate configuration
terraform validate

# Refresh state
terraform refresh
```

## Next Steps

1. **Set up remote state storage** (S3 + DynamoDB for state locking)
2. **Implement CI/CD pipeline** with Jenkins/Terraform integration
3. **Add monitoring** (CloudWatch, Application Load Balancer)
4. **Configure auto-scaling** for production workloads
5. **Set up database** (RDS or managed MongoDB service)
6. **Implement backup strategy** for instance and data