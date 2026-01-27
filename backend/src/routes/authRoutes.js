const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('roleId').isInt().withMessage('Valid roleId is required'),
  body('language').optional().isIn(['en', 'ja']).withMessage('Language must be en or ja')
];

// Routes
router.post('/login', loginValidation, authController.login.bind(authController));
router.post('/register', authenticate, registerValidation, authController.register.bind(authController));
router.get('/me', authenticate, authController.getMe.bind(authController));
router.get('/me/permissions', authenticate, authController.getPermissions.bind(authController));

module.exports = router;


