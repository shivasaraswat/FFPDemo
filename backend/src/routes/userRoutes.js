const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');

// Validation rules
const createValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('roleId').isInt().withMessage('Valid roleId is required'),
  body('language').isIn(['en', 'hi']).withMessage('Language must be en or hi'),
  body('classification').optional().trim(),
  body('username').optional().trim(),
  body('mobile').optional().trim(),
  body('iamShortId').optional().trim(),
  body('address').optional().trim()
];

const updateValidation = [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('roleId').optional().isInt(),
  body('language').optional().isIn(['en', 'hi']),
  body('classification').optional().trim(),
  body('username').optional().trim(),
  body('mobile').optional().trim(),
  body('iamShortId').optional().trim(),
  body('address').optional().trim(),
  body('isActive').optional().isBoolean()
];

// Routes
router.get('/', userController.getAll.bind(userController));
router.get('/:id', userController.getById.bind(userController));
router.post('/', createValidation, userController.create.bind(userController));
router.put('/:id', updateValidation, userController.update.bind(userController));
router.patch('/:id/activate', userController.activate.bind(userController));
router.patch('/:id/deactivate', userController.deactivate.bind(userController));
router.delete('/:id', userController.delete.bind(userController));

module.exports = router;


