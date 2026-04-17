# 📡 API Documentation - Student Management System

Complete API reference for the Student Management System.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 2. Login User

Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User

Get authenticated user's information.

**Endpoint:** `GET /auth/me`

**Access:** Private (requires token)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 👥 Student Endpoints

### 1. Get All Students

Retrieve students with pagination, search, and filters.

**Endpoint:** `GET /students`

**Access:** Private

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `search` (string) - Search in name, ID, email, mobile
- `department` (string) - Filter by department
- `year` (string) - Filter by year
- `section` (string) - Filter by section
- `academicStatus` (string) - Filter by status
- `course` (string) - Filter by course

**Example Request:**
```
GET /students?page=1&limit=10&search=john&department=Computer Science Engineering&year=2nd Year
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studentId": "CS2024001",
      "fullName": "John Smith",
      "gender": "Male",
      "dateOfBirth": "2005-05-15T00:00:00.000Z",
      "age": 19,
      "bloodGroup": "O+",
      "department": "Computer Science Engineering",
      "course": "B.Tech",
      "year": "2nd Year",
      "semester": "3",
      "section": "A",
      "rollNumber": "21CS001",
      "admissionDate": "2023-08-01T00:00:00.000Z",
      "academicStatus": "Active",
      "mobileNumber": "9876543210",
      "email": "john.smith@example.com",
      "addressLine1": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "fatherName": "Robert Smith",
      "motherName": "Mary Smith",
      "parentMobile": "9876543211",
      "category": "General",
      "nationality": "Indian",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Create Student

Add a new student to the system.

**Endpoint:** `POST /students`

**Access:** Private

**Request Body:**
```json
{
  "studentId": "CS2024001",
  "fullName": "John Smith",
  "gender": "Male",
  "dateOfBirth": "2005-05-15",
  "bloodGroup": "O+",
  "photo": "https://example.com/photo.jpg",
  "department": "Computer Science Engineering",
  "course": "B.Tech",
  "year": "2nd Year",
  "semester": "3",
  "section": "A",
  "rollNumber": "21CS001",
  "admissionDate": "2023-08-01",
  "academicStatus": "Active",
  "mobileNumber": "9876543210",
  "alternateMobile": "9876543211",
  "email": "john.smith@example.com",
  "addressLine1": "123 Main Street",
  "addressLine2": "Near City Center",
  "city": "Mumbai",
  "district": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "fatherName": "Robert Smith",
  "motherName": "Mary Smith",
  "parentMobile": "9876543211",
  "guardianName": "Uncle John",
  "guardianRelation": "Uncle",
  "guardianContact": "9876543212",
  "occupation": "Business",
  "aadhaarNumber": "123456789012",
  "category": "General",
  "nationality": "Indian",
  "emergencyContactName": "Emergency Contact",
  "emergencyContactNumber": "9876543213"
}
```

**Required Fields:**
- studentId, fullName, gender, dateOfBirth
- department, course, year, admissionDate
- mobileNumber, email, addressLine1, city, state, pincode
- fatherName, motherName, parentMobile

**Success Response (201):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "studentId": "CS2024001",
    "fullName": "John Smith",
    ...
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Student ID is required",
    "Mobile number must be 10 digits"
  ]
}
```

---

### 3. Get Student by ID

Retrieve a single student by MongoDB ObjectId.

**Endpoint:** `GET /students/:id`

**Access:** Private

**URL Parameters:**
- `id` - MongoDB ObjectId of the student

**Example Request:**
```
GET /students/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "studentId": "CS2024001",
    "fullName": "John Smith",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

---

### 4. Search Student by Student ID

Find a student by their student ID (not MongoDB ID).

**Endpoint:** `GET /students/search/:studentId`

**Access:** Private

**URL Parameters:**
- `studentId` - Student's ID (e.g., CS2024001)

**Example Request:**
```
GET /students/search/CS2024001
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "studentId": "CS2024001",
    "fullName": "John Smith",
    ...
  }
}
```

---

### 5. Update Student

Update student information.

**Endpoint:** `PUT /students/:id`

**Access:** Private

**URL Parameters:**
- `id` - MongoDB ObjectId of the student

**Request Body:**
```json
{
  "fullName": "John Updated Smith",
  "mobileNumber": "9999999999",
  "academicStatus": "Inactive"
}
```

**Note:** You can update any field except `userId`. Partial updates are supported.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "studentId": "CS2024001",
    "fullName": "John Updated Smith",
    ...
  }
}
```

---

### 6. Delete Student

Soft delete a student (marks as deleted, doesn't remove from database).

**Endpoint:** `DELETE /students/:id`

**Access:** Private

**URL Parameters:**
- `id` - MongoDB ObjectId of the student

**Example Request:**
```
DELETE /students/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

**Note:** This is a soft delete. The student record is marked as `isDeleted: true` and `isActive: false` but remains in the database.

---

### 7. Get Dashboard Statistics

Retrieve dashboard statistics and analytics.

**Endpoint:** `GET /students/stats/dashboard`

**Access:** Private

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "activeStudents": 145,
    "byDepartment": [
      {
        "_id": "Computer Science Engineering",
        "count": 45
      },
      {
        "_id": "Information Technology",
        "count": 38
      }
    ],
    "byYear": [
      {
        "_id": "1st Year",
        "count": 40
      },
      {
        "_id": "2nd Year",
        "count": 38
      }
    ],
    "recentStudents": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "studentId": "CS2024001",
        "fullName": "John Smith",
        "department": "Computer Science Engineering",
        "year": "2nd Year",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 8. Export Students to CSV

Export all students to CSV file.

**Endpoint:** `GET /students/export/csv`

**Access:** Private

**Success Response (200):**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename=students.csv`
- Body: CSV file content

**Example Response:**
```csv
_id,studentId,fullName,gender,dateOfBirth,age,bloodGroup,department,course,year,...
507f1f77bcf86cd799439011,CS2024001,John Smith,Male,2005-05-15,19,O+,Computer Science Engineering,B.Tech,2nd Year,...
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "No students found to export"
}
```

---

## 🔒 Error Responses

### Common Error Codes

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Field is required", "Invalid format"]
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## 📝 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required, 2-100 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed, min 6 chars),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Student Model
```javascript
{
  _id: ObjectId,
  
  // Basic Details
  studentId: String (required, unique per user),
  fullName: String (required, 2-100 chars),
  gender: String (required, enum: ['Male', 'Female', 'Other']),
  dateOfBirth: Date (required),
  age: Number (auto-calculated, 5-100),
  bloodGroup: String (enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  photo: String,
  
  // Academic Details
  department: String (required, enum),
  course: String (required, enum),
  year: String (required, enum),
  semester: String (enum: ['1'-'8']),
  section: String (enum: ['A'-'E']),
  rollNumber: String,
  admissionDate: Date (required),
  academicStatus: String (enum, default: 'Active'),
  
  // Contact Details
  mobileNumber: String (required, 10 digits),
  alternateMobile: String (10 digits),
  email: String (required, valid email),
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
  category: String (enum, default: 'General'),
  nationality: String (default: 'Indian'),
  
  // Emergency Details
  emergencyContactName: String,
  emergencyContactNumber: String (10 digits),
  
  // System Fields
  userId: ObjectId (ref: 'User', required),
  isActive: Boolean (default: true),
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Students (with token)
```bash
curl -X GET "http://localhost:5000/api/students?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "studentId": "CS2024001",
    "fullName": "John Smith",
    "gender": "Male",
    "dateOfBirth": "2005-05-15",
    "department": "Computer Science Engineering",
    "course": "B.Tech",
    "year": "2nd Year",
    "admissionDate": "2023-08-01",
    "mobileNumber": "9876543210",
    "email": "john@example.com",
    "addressLine1": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "fatherName": "Robert Smith",
    "motherName": "Mary Smith",
    "parentMobile": "9876543211"
  }'
```

---

## 📊 Rate Limiting

Currently, there are no rate limits implemented. For production, consider adding rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🔐 Security Best Practices

1. **Always use HTTPS in production**
2. **Keep JWT_SECRET secure and complex**
3. **Implement rate limiting**
4. **Validate and sanitize all inputs**
5. **Use environment variables for sensitive data**
6. **Implement proper CORS policies**
7. **Keep dependencies updated**
8. **Use helmet.js for security headers**

---

**For more information, visit the [GitHub Repository](https://github.com/Yathesh-Hub/Student-management)**
