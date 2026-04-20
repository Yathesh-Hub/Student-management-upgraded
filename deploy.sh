#!/bin/bash
# Deployment script for Student Management Application with Terraform

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_message "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check Terraform
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Run 'aws configure' first."
        exit 1
    fi
    
    print_message "All prerequisites met!"
}

# Initialize Terraform
init_terraform() {
    print_message "Initializing Terraform..."
    cd terraform
    terraform init
    cd ..
}

# Plan Terraform deployment
plan_deployment() {
    print_message "Planning Terraform deployment..."
    cd terraform
    terraform plan -out=tfplan
    cd ..
}

# Apply Terraform configuration
apply_deployment() {
    print_message "Applying Terraform configuration..."
    cd terraform
    terraform apply -auto-approve
    cd ..
}

# Get instance details
get_instance_details() {
    print_message "Getting instance details..."
    cd terraform
    INSTANCE_IP=$(terraform output -raw public_ip)
    INSTANCE_ID=$(terraform output -raw instance_id)
    cd ..
    
    print_message "Instance ID: $INSTANCE_ID"
    print_message "Public IP: $INSTANCE_IP"
    
    echo "INSTANCE_IP=$INSTANCE_IP" > .env.deploy
    echo "INSTANCE_ID=$INSTANCE_ID" >> .env.deploy
}

# Deploy application
deploy_application() {
    if [ ! -f ".env.deploy" ]; then
        print_error "Deployment environment file not found. Run 'apply' first."
        exit 1
    fi
    
    source .env.deploy
    
    print_message "Deploying application to instance $INSTANCE_IP..."
    
    # Copy backend files
    print_message "Copying backend files..."
    scp -i student-app-key.pem -r backend ubuntu@$INSTANCE_IP:/opt/student-app/
    
    # Copy frontend files
    print_message "Copying frontend files..."
    scp -i student-app-key.pem -r frontend ubuntu@$INSTANCE_IP:/opt/student-app/
    
    # Copy Docker configuration
    print_message "Copying Docker configuration..."
    scp -i student-app-key.pem Dockerfile docker-compose.yml ubuntu@$INSTANCE_IP:/opt/student-app/
    
    # Restart application
    print_message "Restarting application..."
    ssh -i student-app-key.pem ubuntu@$INSTANCE_IP "sudo systemctl restart student-app.service"
    
    print_message "Application deployed successfully!"
}

# Check application status
check_status() {
    if [ ! -f ".env.deploy" ]; then
        print_error "Deployment environment file not found."
        exit 1
    fi
    
    source .env.deploy
    
    print_message "Checking application status on $INSTANCE_IP..."
    
    # Check if instance is running
    INSTANCE_STATE=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].State.Name' --output text)
    
    if [ "$INSTANCE_STATE" != "running" ]; then
        print_error "Instance is not running. State: $INSTANCE_STATE"
        exit 1
    fi
    
    print_message "Instance is running"
    
    # Check application health
    print_message "Checking application health..."
    if curl -s http://$INSTANCE_IP:5000 > /dev/null; then
        print_message "✅ Application is healthy!"
        print_message "🌐 Access the application at: http://$INSTANCE_IP"
        print_message "🔗 API endpoint: http://$INSTANCE_IP:5000"
    else
        print_warning "Application health check failed. Checking logs..."
        ssh -i student-app-key.pem ubuntu@$INSTANCE_IP "sudo journalctl -u student-app.service -n 20"
    fi
}

# Destroy resources
destroy_resources() {
    print_warning "This will destroy all Terraform-managed resources!"
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        print_message "Destroying resources..."
        cd terraform
        terraform destroy -auto-approve
        cd ..
        rm -f .env.deploy
        print_message "Resources destroyed successfully!"
    else
        print_message "Operation cancelled."
    fi
}

# Show help
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  init        Initialize Terraform"
    echo "  plan        Plan Terraform deployment"
    echo "  apply       Apply Terraform configuration"
    echo "  deploy      Deploy application to instance"
    echo "  status      Check application status"
    echo "  destroy     Destroy all resources"
    echo "  all         Run init, plan, apply, deploy, and status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 init"
    echo "  $0 plan"
    echo "  $0 apply"
    echo "  $0 all"
}

# Main script
case "$1" in
    init)
        check_prerequisites
        init_terraform
        ;;
    plan)
        check_prerequisites
        init_terraform
        plan_deployment
        ;;
    apply)
        check_prerequisites
        init_terraform
        apply_deployment
        get_instance_details
        ;;
    deploy)
        deploy_application
        ;;
    status)
        check_status
        ;;
    destroy)
        destroy_resources
        ;;
    all)
        check_prerequisites
        init_terraform
        plan_deployment
        apply_deployment
        get_instance_details
        deploy_application
        sleep 10  # Wait for application to start
        check_status
        ;;
    help|*)
        show_help
        ;;
esac