const mongoose = require('mongoose');
const { DEPARTMENTS, COURSES, YEARS, SEMESTERS, SECTIONS, BLOOD_GROUPS, GENDERS, ACADEMIC_STATUS, CATEGORIES } = require('../config/constants');

const studentSchema = new mongoose.Schema({
    // Basic Details
    studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        trim: true,
        uppercase: true
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    gender: {
        type: String,
        enum: GENDERS,
        required: [true, 'Gender is required']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    age: {
        type: Number,
        min: [5, 'Age must be at least 5'],
        max: [100, 'Age cannot exceed 100']
    },
    bloodGroup: {
        type: String,
        enum: BLOOD_GROUPS
    },
    photo: {
        type: String,
        default: ''
    },

    // Academic Details
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: DEPARTMENTS
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
        enum: COURSES
    },
    year: {
        type: String,
        required: [true, 'Year is required'],
        enum: YEARS
    },
    semester: {
        type: String,
        enum: SEMESTERS
    },
    section: {
        type: String,
        enum: SECTIONS
    },
    rollNumber: {
        type: String,
        trim: true,
        uppercase: true
    },
    admissionDate: {
        type: Date,
        required: [true, 'Admission date is required']
    },
    academicStatus: {
        type: String,
        enum: ACADEMIC_STATUS,
        default: 'Active'
    },

    // Contact Details
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    alternateMobile: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    addressLine1: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    addressLine2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    district: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },

    // Parent/Guardian Details
    fatherName: {
        type: String,
        required: [true, 'Father name is required'],
        trim: true
    },
    motherName: {
        type: String,
        required: [true, 'Mother name is required'],
        trim: true
    },
    parentMobile: {
        type: String,
        required: [true, 'Parent mobile number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    guardianName: {
        type: String,
        trim: true
    },
    guardianRelation: {
        type: String,
        trim: true
    },
    guardianContact: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    occupation: {
        type: String,
        trim: true
    },

    // Documents/Identity
    aadhaarNumber: {
        type: String,
        match: [/^[0-9]{12}$/, 'Please enter a valid 12-digit Aadhaar number']
    },
    category: {
        type: String,
        enum: CATEGORIES,
        default: 'General'
    },
    nationality: {
        type: String,
        default: 'Indian',
        trim: true
    },

    // Emergency Details
    emergencyContactName: {
        type: String,
        trim: true
    },
    emergencyContactNumber: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },

    // System Fields
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index for unique student ID per user
studentSchema.index({ studentId: 1, userId: 1 }, { unique: true });

// Index for search optimization
studentSchema.index({ fullName: 'text', email: 'text', mobileNumber: 'text' });
studentSchema.index({ department: 1, year: 1, section: 1 });
studentSchema.index({ academicStatus: 1 });

// Calculate age before saving
studentSchema.pre('save', function(next) {
    if (this.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        this.age = age;
    }
    next();
});

module.exports = mongoose.model('Student', studentSchema);
