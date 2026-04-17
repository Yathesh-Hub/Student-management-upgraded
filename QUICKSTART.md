# ⚡ Quick Start Guide

Get the Student Management System running in 5 minutes!

## 🚀 Fast Track Setup

### Prerequisites
- Node.js installed
- MongoDB installed (or Docker)

### Step 1: Clone & Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/Yathesh-Hub/Student-management.git
cd Student-management

# Install dependencies
cd backend
npm install
```

### Step 2: Configure (1 minute)

```bash
# Create environment file
cp .env.example .env

# Edit .env (use any text editor)
nano .env
```

**Minimum required in .env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_management
JWT_SECRET=my-secret-key-12345
```

### Step 3: Start MongoDB (1 minute)

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Step 4: Start Application (1 minute)

```bash
# From backend directory
npm start
```

### Step 5: Access Application

Open browser: **http://localhost:5000**

---

## 🎯 First Steps

### 1. Create Account
- Click "Sign up"
- Enter name, email, password
- Click "Sign Up"

### 2. Login
- Enter your email and password
- Click "Sign In"

### 3. Add Student
- Click "Add Student" in navigation
- Fill required fields (marked with *)
- Click "Add Student"

### 4. View Students
- Click "Students" in navigation
- Search, filter, view, edit, or delete students

---

## 🐳 Docker Quick Start

Even faster with Docker!

```bash
# From project root
docker-compose up -d

# Access application
# http://localhost:5000
```

That's it! 🎉

---

## 🆘 Quick Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not, start it
mongod
```

### Port 5000 Already in Use
```bash
# Change port in .env
PORT=3000
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install
```

---

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference

---

**Need help? Create an issue on GitHub!**
