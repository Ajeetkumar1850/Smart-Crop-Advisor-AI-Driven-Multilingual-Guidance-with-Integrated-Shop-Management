const express = require('express');
const router = express.Router();
const stockController = require('../controller/stocks');

// GET /stock - List all stock entries
router.get('/', stockController.index);

// GET /stock/new - Form to add stock
router.get('/new', stockController.renderNewForm);

// POST /stock - Create new stock
router.post('/', stockController.createStock);

// GET /stock/:id/edit - Edit form
router.get('/:id/edit', stockController.renderEditForm);

// PUT /stock/:id - Update stock
router.put('/:id', stockController.updateStock);

module.exports = router;
