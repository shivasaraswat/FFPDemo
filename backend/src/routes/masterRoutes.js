const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

// Routes
// Note: Validation is handled in the controller/service layer
// since field names vary by master type (region_code, country_code, etc.)
router.get('/:type', masterController.getAll.bind(masterController));
router.get('/:type/:id', masterController.getById.bind(masterController));
router.post('/:type', masterController.create.bind(masterController));
router.put('/:type/:id', masterController.update.bind(masterController));
router.delete('/:type/:id', masterController.delete.bind(masterController));

module.exports = router;

