const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const permissionController = require('../controllers/permissionController');

// Validation rules
const bulkUpdateValidation = [
  body('permissions').isArray().withMessage('Permissions must be an array'),
  body('permissions.*.roleId').isInt().withMessage('Valid roleId is required'),
  body('permissions.*.moduleKey').trim().notEmpty().withMessage('ModuleKey is required'),
  body('permissions.*.access').isIn(['FULL', 'READ', 'NONE']).withMessage('Access must be FULL, READ, or NONE')
];

const updateValidation = [
  body('access').isIn(['FULL', 'READ', 'NONE']).withMessage('Access must be FULL, READ, or NONE')
];

// Routes
router.get('/', permissionController.getMatrix.bind(permissionController));
router.get('/role/:roleId', permissionController.getByRole.bind(permissionController));
router.post('/', bulkUpdateValidation, permissionController.bulkUpdate.bind(permissionController));
router.put('/:id', updateValidation, permissionController.update.bind(permissionController));

module.exports = router;


