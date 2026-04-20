# Terraform EC2 Deployment Setup Guide

This guide explains how to deploy your Student Management Application to AWS EC2 using Terraform and Jenkins.

## Project Structure

```
Student-management/
├── backend/                    # Node.js backend application
├── frontend/                   # Frontend HTML/CSS/JS files
├── terraform/                  # Terraform configuration
│   ├── main.tf                # Main infrastructure configuration
│   ├── variables.tf           # Input variables
│   ├── outputs.tf             # Output values
│   ├── versions.tf            # Terraform version requirements
│   ├── terraform.tfvars.example  # Example variable values
│   ├── README.md              # Terraform documentation
│   └── .gitignore             # Terraform ignore files
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose configuration
├── Jenkinsfile                # Original Jenkins pipeline
├── Jenkinsfile.with-terraform # Jenkins pipeline with Terraform
├── deploy.sh                  # Deployment script
├── SETUP_GUIDE.md            # This guide
└── .gitignore                # Git ignore rules
```

## Prerequisites

### 1. AWS Account Setup
- Create an AWS account if you don't have one
- Create an IAM user with:
  - `AmazonEC2FullAccess`
  - `AmazonVPCFullAccess`
  - `IAMFullAccess`
  - `AmazonS3FullAccess` (optional, for remote state)

### 2. Local Tools Installation
```bash
# Install AWS CLI
# Download from: https://aws.amazon.com/cli/

# Install Terraform
# Download from: https://www.terraform.io/downloads

# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID, Secret Access Key, region (us-east-1), and output format (json)
```

### 3. Create EC2 Key Pair
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -f student-app-key.pem

# Import to AWS (Windows PowerShell)
aws ec2 import-key-pair `
  --key-name "student-app-key" `
  --public-key-material fileb://student-app-key.pub
```

## Quick Start Deployment

### Option 1: Using Deployment Script (Recommended)

```bash
# Make script executable (Windows)
icacls deploy.sh /grant:r "Users:(RX)"

# Run complete deployment
./deploy.sh all
```

### Option 2: Manual Terraform Deployment

```bash
# 1. Navigate to terraform directory
cd terraform

# 2. Copy and configure variables
copy terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# 3. Initialize Terraform
terraform init

# 4. Plan deployment
terraform plan

# 5. Apply configuration
terraform apply

# 6. Get instance details
terraform output
```

### Option 3: Jenkins Pipeline

1. Copy the updated Jenkinsfile:
```bash
copy Jenkinsfile.with-terraform Jenkinsfile
```

2. Update Jenkins credentials:
   - Add AWS credentials to Jenkins
   - Upload SSH key (`student-app-key.pem`) to Jenkins

3. Run the Jenkins pipeline

## Configuration Details

### Terraform Variables (`terraform.tfvars`)

```hcl
aws_region      = "us-east-1"           # AWS region
ami_id          = "ami-0c55b159cbfafe1f0" # Ubuntu 22.04 LTS
instance_type   = "t2.micro"            # Free tier eligible
key_pair_name   = "student-app-key"     # Your EC2 key pair name
root_volume_size = 20                   # Root volume size in GB
create_vpc      = false                 # Use default VPC
allocate_eip    = false                 # Don't allocate Elastic IP
```

### Security Group Ports

The EC2 instance security group opens:
- **Port 22**: SSH access
- **Port 80**: HTTP web access
- **Port 5000**: Application API
- **Port 27017**: MongoDB (if running on EC2)

### Instance Configuration

The EC2 instance includes:
- **Ubuntu 22.04 LTS** operating system
- **Docker** and **Docker Compose** installed
- **Node.js 18.x** runtime
- **MongoDB** database (optional)
- **Systemd service** for automatic startup
- **20GB encrypted** root volume

## Application Deployment

After infrastructure is provisioned:

### 1. SSH into the instance
```bash
ssh -i student-app-key.pem ubuntu@<instance-public-ip>
```

### 2. Deploy application files
```bash
# On your local machine
scp -i student-app-key.pem -r backend ubuntu@<instance-ip>:/opt/student-app/
scp -i student-app-key.pem -r frontend ubuntu@<instance-ip>:/opt/student-app/
scp -i student-app-key.pem Dockerfile docker-compose.yml ubuntu@<instance-ip>:/opt/student-app/
```

### 3. Start the application
```bash
# On the EC2 instance
sudo systemctl start student-app.service
sudo systemctl status student-app.service
```

### 4. Access the application
- **Web UI**: `http://<instance-public-ip>`
- **API**: `http://<instance-public-ip>:5000`
- **MongoDB**: `mongodb://<instance-public-ip>:27017/student_management`

## Jenkins Integration

### Update Jenkins Credentials

1. **AWS Credentials**:
   - Add AWS Access Key ID and Secret Access Key as Jenkins credentials
   - Use credential ID: `aws-credentials`

2. **SSH Key**:
   - Upload `student-app-key.pem` as a Jenkins credential
   - Use credential ID: `ec2-ssh-key`

3. **Environment Variables** in Jenkins:
   ```groovy
   environment {
       AWS_REGION = 'us-east-1'
       TF_VAR_key_pair_name = 'student-app-key'
   }
   ```

### Jenkins Pipeline Stages

The updated pipeline includes:
1. **Terraform Infrastructure**: Deploys EC2 instance
2. **Local Testing**: Builds and tests locally
3. **EC2 Deployment**: Copies application to EC2
4. **Health Checks**: Verifies both local and remote deployments

## Cost Management

- **t2.micro** instance: Free tier eligible (750 hours/month)
- **EBS Volume**: ~$2/month for 20GB
- **Data Transfer**: Minimal cost for low traffic
- **Estimated Monthly Cost**: $0-5 for development

## Security Best Practices

1. **Restrict SSH Access**: Update security group to allow SSH only from your IP
2. **Use IAM Roles**: Assign minimal permissions to EC2 instance
3. **Secure Secrets**: Use AWS Secrets Manager for JWT_SECRET and MongoDB credentials
4. **Regular Updates**: Apply security patches regularly
5. **Enable Monitoring**: Set up CloudWatch alarms
6. **Backup Strategy**: Regular EBS snapshots

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**:
   ```bash
   # Check key permissions
   icacls student-app-key.pem /reset
   
   # Verify security group allows SSH
   aws ec2 describe-security-groups --group-ids <sg-id>
   ```

2. **Application Not Starting**:
   ```bash
   # Check logs on EC2 instance
   ssh -i student-app-key.pem ubuntu@<instance-ip> "sudo journalctl -u student-app.service -f"
   
   # Check Docker status
   ssh -i student-app-key.pem ubuntu@<instance-ip> "sudo docker ps"
   ```

3. **Terraform Errors**:
   ```bash
   # Reinitialize
   cd terraform
   terraform init -reconfigure
   
   # Validate configuration
   terraform validate
   ```

4. **Jenkins Pipeline Fails**:
   - Check Jenkins credentials
   - Verify AWS permissions
   - Check network connectivity

### Logs Location

- **Application Logs**: `sudo journalctl -u student-app.service`
- **Docker Logs**: `sudo docker logs student-app`
- **System Logs**: `/var/log/syslog`
- **Terraform State**: `terraform/terraform.tfstate`

## Cleanup

To destroy all resources:

```bash
# Using deployment script
./deploy.sh destroy

# Or manually
cd terraform
terraform destroy
```

## Next Steps

1. **Implement CI/CD**: Set up automatic deployment on git push
2. **Add Monitoring**: Integrate CloudWatch, Application Load Balancer
3. **Database Migration**: Move MongoDB to RDS or DocumentDB
4. **Auto-scaling**: Configure Auto Scaling Groups for production
5. **SSL/TLS**: Add HTTPS with ACM certificates
6. **Backup Strategy**: Implement automated EBS snapshots

## Support

For issues or questions:
1. Check the Terraform README in `terraform/README.md`
2. Review application logs on the EC2 instance
3. Check AWS CloudTrail for API errors
4. Consult AWS documentation for EC2 and Terraform