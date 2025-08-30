const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const isLoggedIn = require('../middleware/isLoggedIn');
// Add to cart
router.post('/add/:id', 
    isLoggedIn ,
      async (req, res) => {
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity || 1);

  const product = await Product.findById(productId);
  if (!product) return res.status(404).send('Product not found');

  // Initialize cart
  if (!req.session.cart) req.session.cart = [];

  // Check if already in cart
  const existingItem = req.session.cart.find(item => item.product._id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    req.session.cart.push({
      product: {
        _id: product._id,
        name: product.name,
        price: product.price
      },
      quantity
    });
  }

  res.redirect('/cart');
});

// View Cart
router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  res.render('shop/cart/index', { cart });
});

// Remove item
router.post('/remove/:id', (req, res) => {
  const productId = req.params.id;
  req.session.cart = (req.session.cart || []).filter(item => item.product._id !== productId);
  res.redirect('/cart');
});

module.exports = router;
