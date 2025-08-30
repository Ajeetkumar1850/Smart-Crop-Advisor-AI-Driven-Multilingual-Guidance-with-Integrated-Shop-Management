const express = require('express');
const router = express.Router();
const workerController = require('../controller/workers');

// GET /worker - List all workers
router.get('/', workerController.index);

// GET /worker/new - Form to add new worker
router.get('/new', workerController.renderNewForm);

// POST /worker - Create new worker
router.post('/', workerController.createWorker);

// GET /worker/:id - Show individual worker
router.get('/:id', workerController.showWorker);

// GET /worker/:id/edit - Form to edit
router.get('/:id/edit', workerController.renderEditForm);

// PUT /worker/:id - Update
router.put('/:id', workerController.updateWorker);

// DELETE /worker/:id - Delete
router.delete('/:id', workerController.destroyWorker);

module.exports = router;
