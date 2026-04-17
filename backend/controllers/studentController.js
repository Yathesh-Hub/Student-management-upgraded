const Student = require('../models/Student');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../config/constants');

// @desc    Create new student
// @route   POST /api/students
// @access  Private
exports.createStudent = async (req, res, next) => {
    try {
        // Add userId from authenticated user
        req.body.userId = req.user.id;

        const student = await Student.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all students with pagination, search, and filters
// @route   GET /api/students
// @access  Private
exports.getAllStudents = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = DEFAULT_PAGE_SIZE,
            search = '',
            department = '',
            year = '',
            section = '',
            academicStatus = '',
            course = ''
        } = req.query;

        // Build query
        const query = {
            userId: req.user.id,
            isDeleted: false
        };

        // Add filters
        if (department) query.department = department;
        if (year) query.year = year;
        if (section) query.section = section;
        if (academicStatus) query.academicStatus = academicStatus;
        if (course) query.course = course;

        // Add search
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } },
                { rollNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = Math.min(parseInt(limit, 10), MAX_PAGE_SIZE);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const students = await Student.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .select('-__v');

        // Get total count
        const total = await Student.countDocuments(query);

        res.status(200).json({
            success: true,
            count: students.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: students
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res, next) => {
    try {
        const student = await Student.findOne({
            _id: req.params.id,
            userId: req.user.id,
            isDeleted: false
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get student by Student ID
// @route   GET /api/students/search/:studentId
// @access  Private
exports.getStudentByStudentId = async (req, res, next) => {
    try {
        const student = await Student.findOne({
            studentId: req.params.studentId.toUpperCase(),
            userId: req.user.id,
            isDeleted: false
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = async (req, res, next) => {
    try {
        // Prevent userId update
        delete req.body.userId;

        const student = await Student.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
                isDeleted: false
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: student
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete student (soft delete)
// @route   DELETE /api/students/:id
// @access  Private
exports.deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
                isDeleted: false
            },
            { isDeleted: true, isActive: false },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/students/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Total students
        const totalStudents = await Student.countDocuments({
            userId,
            isDeleted: false
        });

        // Active students
        const activeStudents = await Student.countDocuments({
            userId,
            isDeleted: false,
            academicStatus: 'Active'
        });

        // Students by department
        const byDepartment = await Student.aggregate([
            { $match: { userId: req.user._id, isDeleted: false } },
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Students by year
        const byYear = await Student.aggregate([
            { $match: { userId: req.user._id, isDeleted: false } },
            { $group: { _id: '$year', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // Recently added students
        const recentStudents = await Student.find({
            userId,
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('studentId fullName department year createdAt');

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                activeStudents,
                byDepartment,
                byYear,
                recentStudents
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Export students to CSV
// @route   GET /api/students/export/csv
// @access  Private
exports.exportToCSV = async (req, res, next) => {
    try {
        const students = await Student.find({
            userId: req.user.id,
            isDeleted: false
        }).select('-__v -userId -isDeleted');

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No students found to export'
            });
        }

        // Convert to CSV
        const headers = Object.keys(students[0].toObject());
        const csvRows = [headers.join(',')];

        for (const student of students) {
            const values = headers.map(header => {
                const value = student[header];
                return `"${value || ''}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvContent = csvRows.join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
        res.status(200).send(csvContent);
    } catch (error) {
        next(error);
    }
};
