const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

// Show all payments
module.exports.index = async (req, res) => {
    const allpayments = await Payment.find({})
        .populate('customer')
        .populate('product');
    res.render("pay/index", { allpayments });
};

// Render form to add a new payment
module.exports.renderNewForm = async (req, res) => {
    const customers = await Customer.find({});
    const products = await Product.find({});
    res.render("pay/new", { customers, products });
};

// Create new payment
module.exports.createPayment = async (req, res) => {
    const newPayment = new Payment(req.body.payment);
    await newPayment.save();
    res.redirect("/payment");
};

// View a single payment
module.exports.showPayment = async (req, res) => {
    const { id } = req.params;
    const payment = await Payment.findById(id)
        .populate('customer')
        .populate('product');
    res.render("pay/show", { payment });
};
