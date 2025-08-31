// routes/payments.js
const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

// 📌 Show Payment Form
router.get("/new", async (req, res) => {
  const customers = await Customer.find({});
  const products = await Product.find({});
  res.render("payments/new", { customers, products });
});

// 📌 Create New Payment
router.post("/", async (req, res) => {
  const { customer, product, quantity, amountPaid } = req.body;
  const prod = await Product.findById(product);
  const totalAmount = prod.price * quantity;

  let status = "Paid";
  if (amountPaid < totalAmount) status = amountPaid === 0 ? "Due" : "Partial";

  await Payment.create({
    customer,
    product,
    quantity,
    totalAmount,
    amountPaid,
    paymentStatus: status,
  });

  res.redirect("/payments");
});

// 📌 List Payments (with optional filters)
router.get("/", async (req, res) => {
  const { customer, from, to } = req.query;
  let query = {};

  if (customer) {
    const cust = await Customer.findOne({ name: new RegExp(customer, "i") });
    if (cust) query.customer = cust._id;
  }

  if (from && to) {
    query.paymentDate = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  const payments = await Payment.find(query)
    .populate("customer")
    .populate("product");

  res.render("payments/index", { payments });
});

module.exports = router; // ✅ This is VERY IMPORTANT
