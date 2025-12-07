const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/', salesController.getSales);
router.get('/filters/:field', salesController.getUniqueValues);

module.exports = router;
