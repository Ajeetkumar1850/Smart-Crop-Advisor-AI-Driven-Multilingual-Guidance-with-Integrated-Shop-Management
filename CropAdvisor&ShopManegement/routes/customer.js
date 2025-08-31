const express = require('express');
const router = express.Router();
const customerController = require('../controller/customers');

router.get('/', customerController.index);
router.get('/new', customerController.renderNewForm);
router.post('/', customerController.createcustomer);
router.get('/:id/edit', customerController.renderEditForm);
router.get('/:id', customerController.showcust);
router.put('/:id', customerController.updateListing);
router.delete('/:id', customerController.destroyListing);


module.exports = router;