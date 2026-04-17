module.exports = {
    // Departments
    DEPARTMENTS: [
        'Computer Science Engineering',
        'Information Technology',
        'Artificial Intelligence & Data Science',
        'Artificial Intelligence & Machine Learning',
        'Biomedical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Electronics & Communication Engineering'
    ],

    // Courses
    COURSES: [
        'B.E',
        'B.Tech',
        'M.Tech',
        'B.Sc',
        'M.Sc',
        'BCA',
        'MCA',
        'Diploma'
    ],

    // Years
    YEARS: ['1st Year', '2nd Year', '3rd Year', '4th Year'],

    // Semesters
    SEMESTERS: ['1', '2', '3', '4', '5', '6', '7', '8'],

    // Sections
    SECTIONS: ['A', 'B', 'C', 'D', 'E'],

    // Blood Groups
    BLOOD_GROUPS: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],

    // Gender
    GENDERS: ['Male', 'Female', 'Other'],

    // Academic Status
    ACADEMIC_STATUS: ['Active', 'Inactive', 'Graduated', 'Suspended', 'Dropped'],

    // Categories
    CATEGORIES: ['General', 'OBC', 'SC', 'ST', 'EWS'],

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRE: '7d',

    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
};
