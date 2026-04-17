const express = require('express');
const router = express.Router();
const {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentByStudentId,
    updateStudent,
    deleteStudent,
    getDashboardStats,
    exportToCSV
} = require('../controllers/studentController');
const { validateStudentInput } = require('../middleware/validator');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Dashboard stats
router.get('/stats/dashboard', getDashboardStats);

// Export to CSV
router.get('/export/csv', exportToCSV);

// Search by student ID
router.get('/search/:studentId', getStudentByStudentId);

// CRUD operations
router.route('/')
    .get(getAllStudents)
    .post(validateStudentInput, createStudent);

router.route('/:id')
    .get(getStudentById)
    .put(updateStudent)
    .delete(deleteStudent);

module.exports = router;
