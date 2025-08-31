// const express = require('express')
// const mongoose = require('mongoose')
// const path = require('path')
// const cors = require('cors')
// const methodoverride = require('method-override');
// // Import models
// const Customer = require('./models/Customer');
// const Product = require('./models/Product');
// const Stock = require('./models/Stock');
// const Payment = require('./models/Payment');
// const Worker = require('./models/Worker');
// // Initialize Express app
// const app = express();
// // MongoDB connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/AGRO_MANAGEMENT";
// mongoose.connect(MONGO_URL)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.error("MongoDB connection error:", err));

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(methodoverride('_method'));
// // Serve static files and set view engine
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));


// // ... [Imports and middleware remain unchanged] ...

// //==========================================================================
// // 1. Customer Routes
// app.get('/customer', async (req, res) => {
//     const allcustomers = await Customer.find({});
//     res.render('cust/index', { allcustomers });
// });
// app.get('/customer/new', (req, res) => {
//     res.render('cust/new');
// });
// app.get('/customer/:id', async (req, res) => {
//     let { id } = req.params;
//     const customer = await Customer.findById(id);
//     res.render('cust/show', { customer });
// });
// app.post('/customer', async (req, res) => {
//     const newCustomer = new Customer(req.body.customer);
//     await newCustomer.save();
//     res.redirect('/customer');
// });
// app.get('/customer/:id/edit', async (req, res) => {
//     let { id } = req.params;
//     const customer = await Customer.findById(id);
//     res.render('cust/edit', { customer });
// });
// app.put('/customer/:id', async (req, res) => {
//     let { id } = req.params;
//     await Customer.findByIdAndUpdate(id, { ...req.body.customer });
//     res.redirect(`/customer/${id}`);
// });
// app.delete('/customer/:id', async (req, res) => {
//     let { id } = req.params;
//     await Customer.findByIdAndDelete(id);
//     res.redirect('/customer');
// });

// //==========================================================================
// // 2. Product Routes
// app.get('/product', async (req, res) => {
//     const allproducts = await Product.find({});
//     res.render('prod/index', { allproducts });
// });
// app.get('/product/new', (req, res) => {
//     res.render('prod/new');
// });
// app.get('/product/:id', async (req, res) => {
//     let { id } = req.params;
//     const product = await Product.findById(id);
//     res.render('prod/show', { product });
// });
// app.post('/product', async (req, res) => {
//     const data = req.body.product;
//     if (typeof data.image === 'string') {
//         data.image = { url: data.image, filename: 'listingimage' };
//     }
//     const newProduct = new Product(data);
//     await newProduct.save();
//     res.redirect('/product');
// });
// app.get('/product/:id/edit', async (req, res) => {
//     let { id } = req.params;
//     const product = await Product.findById(id);
//     res.render('prod/edit', { product });
// });
// app.put('/product/:id', async (req, res) => {
//     let { id } = req.params;
//     await Product.findByIdAndUpdate(id, { ...req.body.product });
//     res.redirect(`/product/${id}`);
// });
// app.delete('/product/:id', async (req, res) => {
//     let { id } = req.params;
//     await Product.findByIdAndDelete(id);
//     res.redirect('/product');
// });

// //==========================================================================
// // 3. Stock Routes
// app.get('/stock', async (req, res) => {
//     const allstocks = await Stock.find({}).populate('product');
//     res.render('stock/index', { allstocks });
// });
// app.get('/stock/new', async (req, res) => {
//     const products = await Product.find({});
//     res.render('stock/new', { products });
// });
// app.post('/stock', async (req, res) => {
//     const newStock = new Stock(req.body.stock);
//     await newStock.save();
//     res.redirect('/stock');
// });
// app.get('/stock/:id/edit', async (req, res) => {
//     let { id } = req.params;
//     const stock = await Stock.findById(id).populate('product');
//     const products = await Product.find({});
//     res.render('stock/edit', { stock, products });
// });
// app.put('/stock/:id', async (req, res) => {
//     let { id } = req.params;
//     await Stock.findByIdAndUpdate(id, { ...req.body.stock });
//     res.redirect(`/stock/${id}`);
// });

// //==========================================================================
// // Worker Routes
// app.get('/worker', async (req, res) => {
//     const allworkers = await Worker.find({});
//     res.render('work/index', { allworkers });
// });
// app.get('/worker/new', (req, res) => {
//     res.render('work/new');
// });
// app.get('/worker/:id', async (req, res) => {
//     let { id } = req.params;
//     const worker = await Worker.findById(id);
//     res.render('work/show', { worker });
// });
// app.post('/worker', async (req, res) => {
//     const newWorker = new Worker(req.body.worker);
//     await newWorker.save();
//     res.redirect('/worker');
// });
// app.get('/worker/:id/edit', async (req, res) => {
//     let { id } = req.params;
//     const worker = await Worker.findById(id);
//     res.render('work/edit', { worker });
// });
// app.put('/worker/:id', async (req, res) => {
//     let { id } = req.params;
//     await Worker.findByIdAndUpdate(id, { ...req.body.worker });
//     res.redirect(`/worker/${id}`);
// });
// app.delete('/worker/:id', async (req, res) => {
//     let { id } = req.params;
//     await Worker.findByIdAndDelete(id);
//     res.redirect('/worker');
// });

// //==========================================================================
// // Payment Routes
// app.get('/payment', async (req, res) => {
//     const allpayments = await Payment.find({}).populate('customer').populate('product');
//     res.render('pay/index', { allpayments });
// });
// app.get('/payment/new', async (req, res) => {
//     const customers = await Customer.find({});
//     const products = await Product.find({});
//     res.render('pay/new', { customers, products });
// });
// app.post('/payment', async (req, res) => {
//     const newPayment = new Payment(req.body.payment);
//     await newPayment.save();
//     res.redirect('/payment');
// });
// //==============================================================
// // integrating ml model to predict the fertilizer while providing the some parameter 
//        const { spawn } = require('child_process');

// // ML Recommendation Route
// app.post('/recommend', async (req, res) => {
//   const { N, P, K, pH, crop } = req.body;

//   // Call Python script
//   const pythonProcess = spawn('python', [
//     './ml/predict.py', 
//     JSON.stringify({ N, P, K, pH, crop })
//   ]);

//   let result = '';
//   pythonProcess.stdout.on('data', (data) => result += data.toString());

//   pythonProcess.on('close', () => {
//     try {
//       const { fertilizer } = JSON.parse(result);
//       res.render('recommendation', { 
//         N, P, K, pH, crop,
//         fertilizer 
//       });
//     } catch (error) {
//       console.error("ML Error:", error);
//       res.status(500).send("Error generating recommendation");
//     }
//   });
// });

// //==========================================================================
// // Home & Test Routes
// app.get('/', (req, res) => {
//     res.render('home');
// });
// app.get('/h', (req, res) => {
//     res.send('Agro Management System');
// });

// //==========================================================================
// // Error handler (optional)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Something broke!' });
// });

// // Start server
// app.listen(8080, () => {
//     console.log(`Server running on http://localhost:8080`);
// });





//  mid reserve 

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const methodoverride = require('method-override');
const Product = require('./models/Product'); // Make sure path is correc

//=============================================================================
const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/AGRO_MANAGEMENT";
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));
//=================================================================================
app.use(cors());
app.use(express.json());
app.use(methodoverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//====================================================================================
// Routes
const productRoutes = require('./routes/product');
app.use('/prod', productRoutes);

const customerRoutes = require('./routes/customer');
app.use('/cust', customerRoutes);

const stockRoutes = require('./routes/stock');
app.use('/stock', stockRoutes);

const workerRoutes = require('./routes/worker');
app.use('/worker', workerRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/payment', paymentRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/dash', dashboardRoutes);

const chatbotRoutes = require('./routes/chatboat');
app.use('/api', chatbotRoutes);
//==================================================================================
// Home & Test Routes
app.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('home', { products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});


app.listen(8080, () => {
    console.log(`Server running on http://localhost:8080`);
});