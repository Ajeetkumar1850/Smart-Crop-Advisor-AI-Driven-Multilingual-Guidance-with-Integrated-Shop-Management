const Customer = require('../models/Customer');

// List all customers
module.exports.index = async (req, res) => {
    try {
        const allcustomers = await Customer.find({});
        res.render("shop/cust/index.ejs", { allcustomers });
    } catch (err) {
        res.status(500).send("Error fetching customers");
    }
};

// Render form to create a new customer
module.exports.renderNewForm = (req, res) => {
    res.render("shop/cust/new.ejs");
};

// Show a single customer
module.exports.showcust = async (req, res) => {
    try {
        let { id } = req.params;
        const customer = await Customer.findById(id);
        if (!customer) return res.redirect("/cust");
        res.render("shop/cust/show.ejs", { customer });
    } catch (err) {
        res.status(500).send("Error fetching customer");
    }
};

// Create a new customer
module.exports.createcustomer = async (req, res) => {
    try {
        const newCustomer = new Customer(req.body.customer);
        await newCustomer.save();
        res.redirect('/cust?msg=customer');

        
    } catch (err) {
        res.status(400).send("customer already exist");  
    }
};
// Render form to edit a customer
module.exports.renderEditForm = async (req, res) => {
    try {
        let { id } = req.params;
        const customer = await Customer.findById(id);
        if (!customer) return res.redirect("/cust");
        res.render("shop/cust/edit.ejs", { customer });
    } catch (err) {
        res.status(500).send("Error loading edit form");
    }
};

// Update a customer
module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        await Customer.findByIdAndUpdate(id, { ...req.body.customer });

        res.redirect(`/cust/${id}`);
    } catch (err) {
        res.status(400).send("Error updating customer");
    }
};

// Delete a customer
module.exports.destroyListing = async (req, res) => {
    try {
        let { id } = req.params;
        await Customer.findByIdAndDelete(id);
        res.redirect("/cust");
    } catch (err) {
        res.status(500).send("Error deleting customer");
    }
};