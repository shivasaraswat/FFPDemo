const express = require('express');
const router = express.Router();
const fieldFixController = require('../controllers/fieldFixController');

// Routes
router.get('/demo', fieldFixController.getDemo.bind(fieldFixController));

module.exports = router;


