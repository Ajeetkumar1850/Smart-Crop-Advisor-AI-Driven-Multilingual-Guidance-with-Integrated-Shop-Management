
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const methodoverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const Product = require('./models/Product');


// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/AGRO_MANAGEMENT";
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));


const app = express();
// ================= MIDDLEWARE SETUP =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ================ SESSION & PASSPORT SETUP ================
app.use(session({
  secret: 'agro-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./config/passport')(passport); // you'll create this file

// ================ ROUTES SETUP ================
// Google Auth Route
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Protected Routes Middleware
const { ensureAuthenticated, ensureAdmin } = require('./middleware/auth');

// Agro Management Routes
app.use('/prod', require('./routes/product'));
app.use('/cust', require('./routes/customer'));
app.use('/stock', require('./routes/stock'));
app.use('/worker', require('./routes/worker'));
app.use("/payments", require("./routes/payments"));
app.use('/dash', require('./routes/dashboard'));
app.use('/cart', require('./routes/cart'));


// const whatsappRoutes = require("./routes/whatsapp");
// app.use("/api/whatsapp", whatsappRoutes);


// ================ HOME PAGE ================
app.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('home', { products, user: req.user });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ================ GOOGLE AUTH PROTECTED ROUTES ================
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send(`
    <h2>Welcome, ${req.user.displayName}</h2>
    <p>Email: ${req.user.email}</p>
    <p>Role: ${req.user.role}</p>
    <a href="/auth/logout">Logout</a>
  `);
});

app.get('/admin', ensureAdmin, (req, res) => {
  res.send(`
    <h2>Admin Panel</h2>
    <p>Hello Admin: ${req.user.displayName}</p>
    <a href="/auth/logout">Logout</a>
  `);
});

// ================ ERROR HANDLER ================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// ================ START SERVER ================
app.listen(8080, () => {
  console.log(`🚀 Server running on http://localhost:8080`);
});
