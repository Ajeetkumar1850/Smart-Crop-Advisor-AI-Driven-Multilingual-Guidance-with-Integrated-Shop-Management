const express = require('express');
const router = express.Router();
const productController = require('../controller/products');

// GET /prod – Show all products
router.get('/', productController.index);

// GET /prod/new – Form to add product
router.get('/new', productController.renderNewForm);

// POST /prod – Create new product
router.post('/', productController.createproduct);

// GET /prod/:id – Show specific product
router.get('/:id', productController.showprod);

// GET /prod/:id/edit – Form to edit product
router.get('/:id/edit', productController.renderEditForm);

// PUT /prod/:id – Update product
router.put('/:id', productController.updateListing);

// DELETE /prod/:id – Delete product
router.delete('/:id', productController.destroyListing);

module.exports = router;
