const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');

// Validation rules
const createValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('roleId').optional().isInt().withMessage('Valid roleId is required'),
  body('roleIds').optional().isArray().withMessage('roleIds must be an array'),
  body('roleIds.*').optional().isInt().withMessage('Each roleId must be an integer'),
  body('language').optional().isIn(['en', 'ja']).withMessage('Language must be en or ja'),
  body('mobile').optional().trim().isLength({ max: 20 }).withMessage('Mobile number must be at most 20 characters'),
  body('iamShortId').optional().trim(),
  body('ssoId').optional().trim().isLength({ max: 255 }).withMessage('SSO ID must be at most 255 characters'),
  body('address').optional().trim(),
  body('region').optional().trim().isLength({ max: 100 }).withMessage('Region must be at most 100 characters'),
  // Custom validation: at least roleId or roleIds must be provided
  body().custom((value) => {
    if (!value.roleId && (!value.roleIds || value.roleIds.length === 0)) {
      throw new Error('Either roleId or roleIds (with at least one role) is required');
    }
    return true;
  })
];

const updateValidation = [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('roleId').optional().isInt(),
  body('roleIds').optional().isArray().withMessage('roleIds must be an array'),
  body('roleIds.*').optional().isInt().withMessage('Each roleId must be an integer'),
  body('language').optional().isIn(['en', 'ja']),
  body('mobile').optional().trim().isLength({ max: 20 }).withMessage('Mobile number must be at most 20 characters'),
  body('iamShortId').optional().trim(),
  body('ssoId').optional().trim().isLength({ max: 255 }).withMessage('SSO ID must be at most 255 characters'),
  body('address').optional().trim(),
  body('region').optional().trim().isLength({ max: 100 }).withMessage('Region must be at most 100 characters'),
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

// Role management routes
router.get('/:id/roles', userController.getUserRoles.bind(userController));
router.post('/:id/roles', userController.assignRole.bind(userController));
router.delete('/:id/roles/:roleId', userController.removeRole.bind(userController));

module.exports = router;


