const Customer = require('../models/Customer');
const Product = require('../models/Product');

const Stock = require('../models/Stock'); // if you have it

module.exports.renderDashboard = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const stock =  await Stock.countDocuments();
   

    res.render('shop/dashboard', {
      totalCustomers,
      totalProducts,
      stock,
       user: req.session.user
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send("Internal Server Error");
  }
};
