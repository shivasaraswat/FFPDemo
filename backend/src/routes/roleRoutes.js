const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const roleController = require('../controllers/roleController');

// Validation rules
const createValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('code').trim().notEmpty().withMessage('Code is required'),
  body('description').optional().trim(),
  body('isSystemRole').optional().isBoolean()
];

const updateValidation = [
  body('name').optional().trim().notEmpty(),
  body('code').optional().trim().notEmpty(),
  body('description').optional().trim()
];

// Routes
router.get('/', roleController.getAll.bind(roleController));
router.get('/:id', roleController.getById.bind(roleController));
router.post('/', createValidation, roleController.create.bind(roleController));
router.put('/:id', updateValidation, roleController.update.bind(roleController));
router.delete('/:id', roleController.delete.bind(roleController));

module.exports = router;



