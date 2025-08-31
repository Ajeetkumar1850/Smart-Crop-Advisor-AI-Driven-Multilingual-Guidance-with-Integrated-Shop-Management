const Worker = require('../models/Worker');

// Show all workers
module.exports.index = async (req, res) => {
    try {
        const allworkers = await Worker.find({});
        res.render('work/index.ejs', { allworkers });
    } catch (err) {
        res.status(500).send("Error fetching workers");
    }
};

// Render form to create a new worker
module.exports.renderNewForm = (req, res) => {
    res.render('work/new.ejs');
};

// Show a single worker
module.exports.showWorker = async (req, res) => {
    try {
        let { id } = req.params;
        const worker = await Worker.findById(id);
        if (!worker) return res.redirect('/worker');
        res.render('work/show.ejs', { worker });
    } catch (err) {
        res.status(500).send("Error loading worker details");
    }
};

// Create new worker
module.exports.createWorker = async (req, res) => {
    try {
        const newWorker = new Worker(req.body.worker);
        await newWorker.save();
        res.redirect('/worker');
    } catch (err) {
        res.status(400).send("Error creating worker");
    }
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
    try {
        let { id } = req.params;
        const worker = await Worker.findById(id);
        if (!worker) return res.redirect('/worker');
        res.render('work/edit.ejs', { worker });
    } catch (err) {
        res.status(500).send("Error loading edit form");
    }
};

// Update worker
module.exports.updateWorker = async (req, res) => {
    try {
        let { id } = req.params;
        await Worker.findByIdAndUpdate(id, { ...req.body.worker });
        res.redirect(`/worker/${id}`);
    } catch (err) {
        res.status(400).send("Error updating worker");
    }
};

// Delete worker
module.exports.destroyWorker = async (req, res) => {
    try {
        let { id } = req.params;
        await Worker.findByIdAndDelete(id);
        res.redirect('/worker');
    } catch (err) {
        res.status(500).send("Error deleting worker");
    }
};
