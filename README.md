# 🎓 Student Management System

A professional, full-stack Student Information Management System built with Node.js, Express, MongoDB, and vanilla JavaScript. This system provides comprehensive student data management with modern UI/UX and secure authentication.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Session management

### 📊 Dashboard
- Real-time statistics
- Student count by department
- Student count by year
- Recently added students
- Visual data representation

### 👥 Student Management
- **Complete Student Profile** with 40+ fields:
  - Basic Details (ID, Name, Gender, DOB, Blood Group, Photo)
  - Academic Details (Department, Course, Year, Semester, Section, Roll Number)
  - Contact Details (Mobile, Email, Complete Address)
  - Parent/Guardian Details
  - Documents & Identity (Aadhaar, Category, Nationality)
  - Emergency Contact Information

### 🔍 Advanced Features
- **Search**: Search by name, ID, email, or mobile number
- **Filter**: Filter by department, year, and academic status
- **Pagination**: Efficient data loading with pagination
- **Export**: Export student data to CSV
- **CRUD Operations**: Create, Read, Update, Delete students
- **Soft Delete**: Students are marked as deleted, not permanently removed
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🏗️ Project Structure

```
student-management-system/
├── backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── constants.js         # Application constants
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── studentController.js # Student CRUD logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   └── validator.js         # Input validation
│   ├── models/
│   │   ├── Student.js           # Student schema
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── studentRoutes.js     # Student endpoints
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Dependencies
│   └── server.js                # Express server
├── frontend/
│   ├── scripts/
│   │   ├── config.js            # API configuration
│   │   ├── auth.js              # Authentication functions
│   │   ├── dashboard.js         # Dashboard logic
│   │   ├── students.js          # Students page logic
│   │   └── add-student.js       # Add/Edit student logic
│   ├── styles/
│   │   ├── auth.css             # Login/Signup styles
│   │   └── dashboard.css        # Dashboard & app styles
│   ├── img/                     # Images
│   ├── dashboard.html           # Dashboard page
│   ├── students.html            # Students list page
│   ├── add-student.html         # Add/Edit student page
│   ├── login.html               # Login page
│   ├── signup.html              # Signup page
│   └── index.html               # Entry point
├── docker-compose.yml           # Docker compose configuration
├── Dockerfile                   # Docker configuration
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yathesh-Hub/Student-management.git
   cd Student-management
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/student_management
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start MongoDB**
   
   **Option A: Local MongoDB**
   ```bash
   mongod
   ```
   
   **Option B: Docker**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:7
   ```

5. **Start the application**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open browser: `http://localhost:5000`
   - Default redirects to login page

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t student-management .

# Run MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7

# Run application
docker run -d -p 5000:5000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/student_management \
  -e JWT_SECRET=your-secret-key \
  --name student-app student-management
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Students
- `GET /api/students` - Get all students with pagination & filters (Protected)
- `POST /api/students` - Create new student (Protected)
- `GET /api/students/:id` - Get student by ID (Protected)
- `PUT /api/students/:id` - Update student (Protected)
- `DELETE /api/students/:id` - Delete student (Protected)
- `GET /api/students/search/:studentId` - Search by student ID (Protected)
- `GET /api/students/stats/dashboard` - Get dashboard statistics (Protected)
- `GET /api/students/export/csv` - Export students to CSV (Protected)

### Query Parameters for GET /api/students
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search term (searches in name, ID, email, mobile)
- `department` - Filter by department
- `year` - Filter by year
- `section` - Filter by section
- `academicStatus` - Filter by status
- `course` - Filter by course

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: All student operations require authentication
- **Error Handling**: Comprehensive error handling and logging
- **CORS**: Configured for cross-origin requests
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Input sanitization

## 📱 User Interface

### Pages
1. **Login Page** - User authentication
2. **Signup Page** - New user registration
3. **Dashboard** - Overview with statistics and charts
4. **Students List** - Table view with search, filter, and pagination
5. **Add/Edit Student** - Comprehensive multi-section form
6. **Student Profile** - Detailed view of student information

### Design Features
- Modern, clean interface
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Color-coded sections
- Intuitive navigation
- Loading states and error messages
- Modal dialogs for confirmations

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (with modern features)
- **JavaScript (ES6+)** - Logic
- **Fetch API** - HTTP requests

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📝 Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Student Collection
```javascript
{
  // Basic Details
  studentId: String (required, unique per user),
  fullName: String (required),
  gender: String (enum),
  dateOfBirth: Date (required),
  age: Number (auto-calculated),
  bloodGroup: String (enum),
  photo: String,
  
  // Academic Details
  department: String (required, enum),
  course: String (required, enum),
  year: String (required, enum),
  semester: String (enum),
  section: String (enum),
  rollNumber: String,
  admissionDate: Date (required),
  academicStatus: String (enum),
  
  // Contact Details
  mobileNumber: String (required, 10 digits),
  alternateMobile: String (10 digits),
  email: String (required),
  addressLine1: String (required),
  addressLine2: String,
  city: String (required),
  district: String,
  state: String (required),
  pincode: String (required, 6 digits),
  
  // Parent/Guardian Details
  fatherName: String (required),
  motherName: String (required),
  parentMobile: String (required, 10 digits),
  guardianName: String,
  guardianRelation: String,
  guardianContact: String (10 digits),
  occupation: String,
  
  // Documents/Identity
  aadhaarNumber: String (12 digits),
  category: String (enum),
  nationality: String,
  
  // Emergency Details
  emergencyContactName: String,
  emergencyContactNumber: String (10 digits),
  
  // System Fields
  userId: ObjectId (ref: User, required),
  isActive: Boolean,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/student_management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# For Docker
# MONGODB_URI=mongodb://mongo:27017/student_management
```

### Frontend Configuration
Edit `frontend/scripts/config.js` to change API URL:

```javascript
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:5000/api'
    : '/api';
```

## 🧪 Testing

### Manual Testing
1. Register a new user
2. Login with credentials
3. Add a new student
4. Search for students
5. Filter students by department/year
6. Edit student information
7. View student profile
8. Delete a student
9. Export students to CSV
10. Logout

### API Testing with cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Students (with token):**
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Future Enhancements

### Phase 1 - Additional Features
- [ ] Bulk student import (CSV/Excel)
- [ ] Advanced reporting and analytics
- [ ] Student attendance tracking
- [ ] Grade/marks management
- [ ] Fee management
- [ ] Email notifications
- [ ] SMS notifications

### Phase 2 - Advanced Features
- [ ] Role-based access control (Admin, Teacher, Student)
- [ ] Student portal (self-service)
- [ ] Parent portal
- [ ] Document upload and management
- [ ] Timetable management
- [ ] Library management
- [ ] Hostel management

### Phase 3 - Technical Improvements
- [ ] Unit and integration tests
- [ ] API documentation (Swagger)
- [ ] Performance optimization
- [ ] Caching layer (Redis)
- [ ] Real-time updates (WebSockets)
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change port in `.env` or kill the process
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

**3. JWT Token Invalid**
```
Error: Token is invalid or expired
```
**Solution**: Login again to get a new token

**4. CORS Error**
```
Access to fetch has been blocked by CORS policy
```
**Solution**: Ensure backend CORS is configured correctly in `server.js`

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Yathesh**
- GitHub: [@Yathesh-Hub](https://github.com/Yathesh-Hub)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ for educational institutions**
