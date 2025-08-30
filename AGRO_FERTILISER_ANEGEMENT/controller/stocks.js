const Stock = require('../models/Stock');
const Product = require('../models/Product');

// Show all stock entries
module.exports.index = async (req, res) => {
    try {
        const allstocks = await Stock.find({}).populate('product');
        res.render('stock/index.ejs', { allstocks });
    } catch (err) {
        res.status(500).send("Error fetching stock data");
    }
};

// Render form to create new stock entry
module.exports.renderNewForm = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('stock/new.ejs', { products });
    } catch (err) {
        res.status(500).send("Error loading stock creation form");
    }
};

// Create new stock entry
module.exports.createStock = async (req, res) => {
    try {
        const newStock = new Stock(req.body.stock);
        await newStock.save();
        res.redirect('/stock');
    } catch (err) {
        res.status(400).send("Error saving stock");
    }
};

// Render form to edit stock
module.exports.renderEditForm = async (req, res) => {
    try {
        let { id } = req.params;
        const stock = await Stock.findById(id).populate('product');
        const products = await Product.find({});
        if (!stock) return res.redirect('/stock');
        res.render('stock/edit.ejs', { stock, products });
    } catch (err) {
        res.status(500).send("Error loading stock edit form");
    }
};

// Update stock
module.exports.updateStock = async (req, res) => {
    try {
        let { id } = req.params;
        await Stock.findByIdAndUpdate(id, { ...req.body.stock });
        res.redirect(`/stock/${id}`);
    } catch (err) {
        res.status(400).send("Error updating stock");
    }
};
