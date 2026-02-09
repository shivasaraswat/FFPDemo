const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const moduleController = require('../controllers/moduleController');

// Validation rules
const createValidation = [
  body('key').trim().notEmpty().withMessage('Key is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('parentKey').optional().trim(),
  body('order').optional().isInt().withMessage('Order must be an integer'),
  body('isActive').optional().isBoolean()
];

const updateValidation = [
  body('name').optional().trim().notEmpty(),
  body('parentKey').optional().trim(),
  body('order').optional().isInt().withMessage('Order must be an integer'),
  body('isActive').optional().isBoolean()
];

// Routes
router.get('/', moduleController.getAll.bind(moduleController));
router.get('/:key', moduleController.getByKey.bind(moduleController));
router.post('/', createValidation, moduleController.create.bind(moduleController));
router.put('/:key', updateValidation, moduleController.update.bind(moduleController));
router.delete('/:key', moduleController.delete.bind(moduleController));

module.exports = router;



