const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const apiRegistryController = require('../controllers/apiRegistryController');

// Validation rules
const createValidation = [
  body('method').isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).withMessage('Valid HTTP method is required'),
  body('path').trim().notEmpty().withMessage('Path is required'),
  body('moduleKey').trim().notEmpty().withMessage('ModuleKey is required'),
  body('requiredAccess').isIn(['READ', 'FULL']).withMessage('RequiredAccess must be READ or FULL'),
  body('isActive').optional().isBoolean()
];

const updateValidation = [
  body('method').optional().isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  body('path').optional().trim().notEmpty(),
  body('moduleKey').optional().trim().notEmpty(),
  body('requiredAccess').optional().isIn(['READ', 'FULL']),
  body('isActive').optional().isBoolean()
];

// Routes
router.get('/', apiRegistryController.getAll.bind(apiRegistryController));
router.get('/module/:moduleKey', apiRegistryController.getByModule.bind(apiRegistryController));
router.get('/:id', apiRegistryController.getById.bind(apiRegistryController));
router.post('/', createValidation, apiRegistryController.create.bind(apiRegistryController));
router.put('/:id', updateValidation, apiRegistryController.update.bind(apiRegistryController));
router.delete('/:id', apiRegistryController.delete.bind(apiRegistryController));

module.exports = router;



