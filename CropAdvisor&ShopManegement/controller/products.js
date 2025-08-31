const Product = require('../models/Product');

// Show all products
module.exports.index = async (req, res) => {
    try {
        const { search } = req.query;
        let allproducts;

        if (search) {
            // Case-insensitive search on product name
            allproducts = await Product.find({ name: { $regex: search, $options: 'i' } });
        } else {
            allproducts = await Product.find({});
        }

        res.render("shop/prod/index.ejs", { allproducts, search });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching products");
    }
};


// Render form to create a new product
module.exports.renderNewForm = (req, res) => {
    res.render("shop/prod/new.ejs");
};

// Create a new product
module.exports.createproduct = async (req, res) => {
    try {
        let data = req.body.product;
        if (typeof data.image === 'string') {
            data.image = { url: data.image, filename: 'listingimage' };
        }
        const newProduct = new Product(data);
        await newProduct.save();
        res.redirect('/prod?msg=product');
    } catch (err) {
        res.status(400).send("Error creating product");
    }
};

// Show one product
module.exports.showprod = async (req, res) => {
    try {
        let { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.redirect('/prod');
        res.render('shop/prod/show.ejs', { product });
    } catch (err) {
        res.status(500).send("Error showing product");
    }
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
    try {
        let { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.redirect('/prod');
        res.render("shop/prod/edit.ejs", { product });
    } catch (err) {
        res.status(500).send("Error loading edit form");
    }
};

// Update product
module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body.product;
        await Product.findByIdAndUpdate(id, data);
        res.redirect(`/prod/${id}`);
    } catch (err) {
        res.status(400).send("Error updating product");
    }
};

// Delete product
module.exports.destroyListing = async (req, res) => {
    try {
        let { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect("/prod");
    } catch (err) {
        res.status(500).send("Error deleting product");
    }
};
