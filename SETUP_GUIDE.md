# 📖 Complete Setup Guide - Student Management System

This guide will walk you through setting up the Student Management System from scratch.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Setup](#docker-setup)
4. [Production Deployment](#production-deployment)
5. [Configuration](#configuration)
6. [First Time Setup](#first-time-setup)
7. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Software

#### Node.js & npm
- **Version**: Node.js 14.x or higher
- **Download**: https://nodejs.org/

**Verify installation:**
```bash
node --version  # Should show v14.x.x or higher
npm --version   # Should show 6.x.x or higher
```

#### MongoDB
- **Version**: MongoDB 4.4 or higher
- **Download**: https://www.mongodb.com/try/download/community

**Verify installation:**
```bash
mongod --version  # Should show db version v4.4.x or higher
```

#### Git
- **Download**: https://git-scm.com/downloads

**Verify installation:**
```bash
git --version
```

### Optional Software

#### Docker & Docker Compose (for containerized deployment)
- **Docker**: https://docs.docker.com/get-docker/
- **Docker Compose**: Included with Docker Desktop

**Verify installation:**
```bash
docker --version
docker-compose --version
```

#### Nodemon (for development)
```bash
npm install -g nodemon
```

---

## 2. Local Development Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Yathesh-Hub/Student-management.git

# Navigate to project directory
cd Student-management
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# This will install:
# - express (web framework)
# - mongoose (MongoDB ODM)
# - jsonwebtoken (JWT authentication)
# - bcryptjs (password hashing)
# - cors (cross-origin resource sharing)
# - dotenv (environment variables)
```

### Step 3: Configure Environment Variables

```bash
# Create .env file from example
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use any text editor
```

**Edit the `.env` file:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/student_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!

### Step 4: Start MongoDB

**Option A: Local MongoDB Service**
```bash
# Windows
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB in Docker**
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7
```

**Verify MongoDB is running:**
```bash
# Connect to MongoDB shell
mongosh

# Or check if port is listening
netstat -an | grep 27017
```

### Step 5: Start the Backend Server

```bash
# From backend directory
npm start

# For development with auto-reload
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
📝 Environment: development
✅ MongoDB Connected: localhost
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

You should be redirected to the login page.

---

## 3. Docker Setup

### Step 1: Ensure Docker is Running

```bash
# Check Docker status
docker ps

# If not running, start Docker Desktop or Docker service
```

### Step 2: Build and Run with Docker Compose

```bash
# From project root directory
docker-compose up -d

# This will:
# 1. Pull MongoDB 7 image
# 2. Build the application image
# 3. Start both containers
# 4. Create a network between them
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Only app logs
docker-compose logs -f app

# Only MongoDB logs
docker-compose logs -f mongo
```

### Step 3: Verify Containers are Running

```bash
docker-compose ps

# Expected output:
# NAME                COMMAND                  SERVICE   STATUS    PORTS
# mongo               "docker-entrypoint.s…"   mongo     running   0.0.0.0:27017->27017/tcp
# student-app         "docker-entrypoint.s…"   app       running   0.0.0.0:5000->5000/tcp
```

### Step 4: Access the Application

```
http://localhost:5000
```

### Step 5: Stop Docker Containers

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

---

## 4. Production Deployment

### AWS EC2 Deployment

#### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch Instance
3. Choose Ubuntu Server 22.04 LTS
4. Instance type: t2.micro (free tier) or t2.small
5. Configure Security Group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - Custom TCP (5000) - Anywhere
6. Launch and download key pair

#### Step 2: Connect to EC2

```bash
# Change key permissions
chmod 400 your-key.pem

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

#### Step 3: Install Dependencies on EC2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Git
sudo apt install -y git

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Step 4: Deploy Application

```bash
# Clone repository
git clone https://github.com/Yathesh-Hub/Student-management.git
cd Student-management/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
```

**Production .env:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/student_management
JWT_SECRET=your-very-strong-production-secret-key-min-32-chars
```

#### Step 5: Start with PM2

```bash
# Start application
pm2 start server.js --name student-management

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs

# View logs
pm2 logs student-management

# Monitor
pm2 monit
```

#### Step 6: Setup Nginx (Optional - for production)

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/student-management
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or EC2 public IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/student-management /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 5. Configuration

### Backend Configuration

#### Database Connection
Edit `backend/config/database.js` if you need custom MongoDB options:

```javascript
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Add more options if needed
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};
```

#### JWT Configuration
Edit `backend/config/constants.js`:

```javascript
JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
JWT_EXPIRE: '7d',  // Change token expiration time
```

#### Pagination Settings
Edit `backend/config/constants.js`:

```javascript
DEFAULT_PAGE_SIZE: 10,  // Default items per page
MAX_PAGE_SIZE: 100,     // Maximum items per page
```

### Frontend Configuration

#### API URL
Edit `frontend/scripts/config.js`:

```javascript
// For production deployment
const API_BASE_URL = 'https://your-domain.com/api';

// For development
const API_BASE_URL = 'http://localhost:5000/api';

// Auto-detect (recommended)
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:5000/api'
    : '/api';
```

---

## 6. First Time Setup

### Step 1: Access the Application

Navigate to `http://localhost:5000` (or your production URL)

### Step 2: Create Admin Account

1. Click "Sign up" on the login page
2. Fill in the registration form:
   - **Name**: Admin User
   - **Email**: admin@example.com
   - **Password**: (minimum 6 characters)
   - **Confirm Password**: (same as password)
3. Click "Sign Up"
4. You'll be redirected to the login page

### Step 3: Login

1. Enter your email and password
2. Click "Sign In"
3. You'll be redirected to the dashboard

### Step 4: Add Your First Student

1. Click "Add Student" in the navigation
2. Fill in the student information:
   - **Required fields** are marked with *
   - All sections must be completed
3. Click "Add Student"
4. You'll be redirected to the students list

### Step 5: Explore Features

- **Dashboard**: View statistics and recent students
- **Students**: Search, filter, and manage students
- **Add Student**: Add new students
- **View Profile**: Click the eye icon on any student
- **Edit Student**: Click the edit icon
- **Delete Student**: Click the delete icon (soft delete)
- **Export CSV**: Export all students to CSV file

---

## 7. Troubleshooting

### Issue 1: Cannot Connect to MongoDB

**Error:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl status mongod
   ```

2. **Check MongoDB connection string in .env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/student_management
   ```

3. **Test MongoDB connection:**
   ```bash
   mongosh
   ```

### Issue 2: Port 5000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find and kill the process:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

2. **Change port in .env:**
   ```env
   PORT=3000
   ```

### Issue 3: JWT Token Invalid

**Error:**
```
Token is invalid or expired
```

**Solutions:**

1. **Clear browser storage and login again:**
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Clear all items
   - Refresh page and login

2. **Check JWT_SECRET in .env:**
   - Ensure it's the same as when tokens were generated
   - If changed, all users need to login again

### Issue 4: CORS Error

**Error:**
```
Access to fetch at 'http://localhost:5000/api/...' has been blocked by CORS policy
```

**Solutions:**

1. **Check CORS configuration in server.js:**
   ```javascript
   app.use(cors());
   ```

2. **For specific origins:**
   ```javascript
   app.use(cors({
       origin: 'http://localhost:3000',
       credentials: true
   }));
   ```

### Issue 5: Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
npm install
```

### Issue 6: Docker Container Exits Immediately

**Check logs:**
```bash
docker-compose logs app
```

**Common causes:**
1. MongoDB not ready - Add health check in docker-compose.yml
2. Environment variables missing - Check .env file
3. Port conflict - Change port mapping

**Solution:**
```bash
# Rebuild containers
docker-compose down
docker-compose up --build -d
```

### Issue 7: Cannot Access Application from Other Devices

**Solutions:**

1. **Check firewall:**
   ```bash
   # Windows
   netsh advfirewall firewall add rule name="Node" dir=in action=allow protocol=TCP localport=5000
   
   # Linux
   sudo ufw allow 5000
   ```

2. **Use 0.0.0.0 instead of localhost:**
   ```javascript
   app.listen(PORT, '0.0.0.0', () => {
       console.log(`Server running on port ${PORT}`);
   });
   ```

3. **Access using local IP:**
   ```
   http://192.168.1.x:5000
   ```

---

## 📞 Need Help?

If you encounter issues not covered here:

1. **Check the logs:**
   ```bash
   # Backend logs
   npm start
   
   # Docker logs
   docker-compose logs -f
   
   # PM2 logs
   pm2 logs student-management
   ```

2. **Enable debug mode:**
   ```env
   NODE_ENV=development
   ```

3. **Create an issue on GitHub:**
   - https://github.com/Yathesh-Hub/Student-management/issues

4. **Check existing issues:**
   - Someone might have already solved your problem

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] MongoDB is running and accessible
- [ ] Backend server starts without errors
- [ ] Can access login page
- [ ] Can create a new user account
- [ ] Can login successfully
- [ ] Dashboard loads with statistics
- [ ] Can add a new student
- [ ] Can view student list
- [ ] Can search students
- [ ] Can filter students
- [ ] Can edit student
- [ ] Can delete student
- [ ] Can export to CSV
- [ ] Can logout

---

**Congratulations! Your Student Management System is now set up and ready to use! 🎉**
