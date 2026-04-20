# Main Terraform configuration for EC2 instance deployment

provider "aws" {
  region = var.aws_region
}

# Data source to fetch the latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Create VPC if not using default
resource "aws_vpc" "student_app_vpc" {
  count                = var.create_vpc ? 1 : 0
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "student-app-vpc"
  }
}

# Create subnet
resource "aws_subnet" "student_app_subnet" {
  count             = var.create_vpc ? 1 : 0
  vpc_id            = aws_vpc.student_app_vpc[0].id
  cidr_block        = var.subnet_cidr
  availability_zone = var.availability_zone

  tags = {
    Name = "student-app-subnet"
  }
}

# Create internet gateway
resource "aws_internet_gateway" "student_app_igw" {
  count  = var.create_vpc ? 1 : 0
  vpc_id = aws_vpc.student_app_vpc[0].id

  tags = {
    Name = "student-app-igw"
  }
}

# Create route table
resource "aws_route_table" "student_app_rt" {
  count  = var.create_vpc ? 1 : 0
  vpc_id = aws_vpc.student_app_vpc[0].id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.student_app_igw[0].id
  }

  tags = {
    Name = "student-app-route-table"
  }
}

# Associate route table with subnet
resource "aws_route_table_association" "student_app_rta" {
  count          = var.create_vpc ? 1 : 0
  subnet_id      = aws_subnet.student_app_subnet[0].id
  route_table_id = aws_route_table.student_app_rt[0].id
}

# Security group for EC2 instance
resource "aws_security_group" "student_app_sg" {
  name        = "student-app-security-group"
  description = "Security group for Student Management Application"
  vpc_id      = var.create_vpc ? aws_vpc.student_app_vpc[0].id : null

  # SSH access from anywhere (restrict in production)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # HTTP access for web application
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  # Jenkins access
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Jenkins access"
  }

  # Application port (5000 from your Jenkinsfile)
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Student app API access"
  }

  # MongoDB port (if running MongoDB on EC2)
  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "MongoDB access"
  }

  # Outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "student-app-sg"
  }
}

# IAM role for EC2 instance
resource "aws_iam_role" "ec2_role" {
  name = "student-app-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "student-app-ec2-role"
  }
}

# IAM policy for EC2 instance
resource "aws_iam_policy" "ec2_policy" {
  name        = "student-app-ec2-policy"
  description = "Policy for Student App EC2 instance"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ec2:DescribeInstances",
          "ec2:DescribeTags",
          "ec2:DescribeVolumes"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Attach policy to role
resource "aws_iam_policy_attachment" "ec2_policy_attachment" {
  name       = "student-app-policy-attachment"
  roles      = [aws_iam_role.ec2_role.name]
  policy_arn = aws_iam_policy.ec2_policy.arn
}

# Create instance profile
resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "student-app-ec2-instance-profile"
  role = aws_iam_role.ec2_role.name
}

# EC2 instance
resource "aws_instance" "student_app_instance" {
  ami                    = var.ami_id != "" ? var.ami_id : data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_pair_name
  subnet_id              = var.create_vpc ? aws_subnet.student_app_subnet[0].id : null
  vpc_security_group_ids = [aws_security_group.student_app_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_instance_profile.name

  # User data script to install and configure the application and Jenkins
  user_data = <<-EOF
              #!/bin/bash
              # Update system
              apt-get update -y
              
              # Install Java (Required for Jenkins)
              apt-get install -y openjdk-17-jre
              
              # Install Jenkins
              wget -O /usr/share/keyrings/jenkins-keyring.asc \
                https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
              echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
                https://pkg.jenkins.io/debian-stable binary/" | tee \
                /etc/apt/sources.list.d/jenkins.list > /dev/null
              apt-get update -y
              apt-get install -y jenkins
              systemctl start jenkins
              systemctl enable jenkins
              
              # Install Docker
              apt-get install -y docker.io
              systemctl start docker
              systemctl enable docker
              
              # Add jenkins user to docker group
              usermod -aG docker jenkins
              usermod -aG docker ubuntu
              
              # Install Docker Compose
              curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              
              # Install Node.js
              curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
              apt-get install -y nodejs
              
              # Install MongoDB
              apt-get install -y mongodb
              systemctl start mongodb
              systemctl enable mongodb
              
              # Create application directory
              mkdir -p /opt/student-app
              chown ubuntu:ubuntu /opt/student-app
              cd /opt/student-app
              
              # Create environment file
              cat > .env << 'ENVFILE'
              MONGODB_URI=mongodb://localhost:27017/student_management
              JWT_SECRET=production-secret-key-${random_id.secret_key.hex}
              NODE_ENV=production
              PORT=5000
              ENVFILE
              
              # Create startup script
              cat > /etc/systemd/system/student-app.service << 'SERVICE'
              [Unit]
              Description=Student Management Application
              After=docker.service mongodb.service
              Requires=docker.service
              
              [Service]
              Type=simple
              User=root
              WorkingDirectory=/opt/student-app
              # We use a loop to wait for docker-compose.yml to appear (deployed via Jenkins)
              ExecStartPre=/bin/bash -c "until [ -f /opt/student-app/docker-compose.yml ]; do sleep 5; done"
              ExecStart=/usr/local/bin/docker-compose up
              Restart=always
              RestartSec=10
              
              [Install]
              WantedBy=multi-user.target
              SERVICE
              
              systemctl daemon-reload
              systemctl enable student-app.service
              
              echo "Setup complete! Jenkins is available on port 8080."
              echo "Initial Admin Password: $(cat /var/lib/jenkins/secrets/initialAdminPassword)" > /home/ubuntu/jenkins_admin_password.txt
              chown ubuntu:ubuntu /home/ubuntu/jenkins_admin_password.txt
              EOF


  # Root volume configuration
  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
    encrypted   = true
  }

  tags = merge(var.tags, {
    Name = "student-app-server"
  })
}

# Elastic IP for static IP address
resource "aws_eip" "student_app_eip" {
  count    = var.allocate_eip ? 1 : 0
  instance = aws_instance.student_app_instance.id
  domain   = "vpc"

  tags = {
    Name = "student-app-elastic-ip"
  }
}

# Random ID for secret key generation
resource "random_id" "secret_key" {
  byte_length = 32
}