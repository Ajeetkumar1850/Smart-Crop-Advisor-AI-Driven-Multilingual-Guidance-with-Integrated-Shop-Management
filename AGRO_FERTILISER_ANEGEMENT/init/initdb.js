const mongoose = require('mongoose');
const path = require('path');
const initData = require('./data');

// Import models
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const Payment = require('../models/Payment');
const Worker = require('../models/Worker');
const MONGO_URL = "mongodb://127.0.0.1:27017/AGRO_MANAGEMENT";
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
}

const initDB = async () => {
  try {
    // Clear existing data
    await mongoose.connection.dropDatabase();
    console.log("Database cleared");

    // Insert customers
    const customers = await Customer.insertMany(initData.customers);
    console.log(`${customers.length} customers inserted`);

    // Insert products
    const products = await Product.insertMany(initData.products);
    console.log(`${products.length} products inserted`);

    // Insert workers
    const workers = await Worker.insertMany(initData.workers);
    console.log(`${workers.length} workers inserted`);

    // Insert stocks (requires products)
    const stocks = await Stock.insertMany(initData.getStocks(products));
    console.log(`${stocks.length} stock records inserted`);

    // Insert payments (requires customers and products)
    const payments = await Payment.insertMany(initData.getPayments(customers, products));
    console.log(`${payments.length} payment records inserted`);

    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    mongoose.connection.close();
  }
};

main()
  .then(initDB)
  .catch(err => console.error("Connection error:", err));