const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { validateUserRegistration, validateLogin } = require('../middleware/validator');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', validateUserRegistration, signup);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
