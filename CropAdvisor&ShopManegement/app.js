require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const TelegramBot = require('node-telegram-bot-api');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Product = require('./models/Product');
const CropRecommendation = require('./models/CropRecommendation');

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/AGRO_MANAGEMENT";
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Log MongoDB connection state
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection state:', mongoose.connection.readyState);
});

const app = express();

// ================= MIDDLEWARE SETUP =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
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
require('./config/passport')(passport);

// ================ TELEGRAM BOT SETUP =================
const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const userLanguages = {};

// Telegram: Handle /start
telegramBot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  telegramBot.sendMessage(chatId, 'Welcome to Crop Advisor! Use /recommend to get crop advice. Set language with /lang en or /lang hi.');
});

// Telegram: Handle /lang
telegramBot.onText(/\/lang (en|hi)/, (msg, match) => {
  const chatId = msg.chat.id;
  const lang = match[1];
  userLanguages[chatId] = lang;
  telegramBot.sendMessage(chatId, `Language set to ${lang === 'en' ? 'English' : 'Hindi'}.`);
});

// Telegram: Handle /recommend
telegramBot.onText(/\/recommend/, (msg) => {
  const chatId = msg.chat.id;
  telegramBot.sendMessage(chatId, 'Enter soil type, season, location (e.g., loamy, Kharif, Punjab or red, Monsoon, Tamil Nadu)');
});

// Telegram: Handle user inputs
telegramBot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('/')) return;

  const [soil_type, season, location] = text.split(',').map(s => s ? s.trim() : '');
  if (!soil_type || !season || !location) {
    return telegramBot.sendMessage(chatId, 'Please provide inputs in format: soil type, season, location (e.g., loamy, Kharif, Punjab)');
  }

  console.log('Parsed Telegram inputs:', { soil_type, season, location });

  try {
    const response = await fetch(`http://localhost:${process.env.PORT || 8080}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soil_type, season, location })
    });
    const data = await response.json();

    if (data.error) {
      return telegramBot.sendMessage(chatId, 'Error getting recommendation. Try again.');
    }

    const lang = userLanguages[chatId] || 'both';
    let message = '';
    const items = data.products
      .map(p => {
        if (lang === 'en') {
          return `${p.name}: ₹${p.price}\nDescription: ${p.description}\nImage: ${p.image}`;
        } else if (lang === 'hi') {
          return `${p.name_hindi}: ₹${p.price}\nविवरण: ${p.description_hindi}\nछवि: ${p.image}`;
        } else {
          return `${p.name} / ${p.name_hindi}: ₹${p.price}\nDescription: ${p.description}\nविवरण: ${p.description_hindi}\nImage: ${p.image}`;
        }
      })
      .join('\n\n');

    if (lang === 'en') {
      message = `Recommended crop: ${data.crop}\nAdvice: ${data.advice}\nFertilizer: ${data.fertilizer}\nAvailable products:\n${items || 'None'}`;
    } else if (lang === 'hi') {
      message = `अनुशंसित फसल: ${data.crop_hindi}\nसुझाव: ${data.advice_hindi}\nउर्वरक: ${data.fertilizer_hindi}\nउपलब्ध उत्पाद:\n${items || 'कोई नहीं'}`;
    } else {
      message = `Recommended crop / अनुशंसित फसल: ${data.crop} / ${data.crop_hindi}\nAdvice / सुझाव: ${data.advice} / ${data.advice_hindi}\nFertilizer / उर्वरक: ${data.fertilizer} / ${data.fertilizer_hindi}\nAvailable products / उपलब्ध उत्पाद:\n${items || 'None / कोई नहीं'}`;
    }

    telegramBot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Telegram bot error:', error);
    telegramBot.sendMessage(chatId, 'Server error. Please try again later.');
  }
});


// WhatsApp user language storage
const whatsappUserLanguages = {};

// ================ WHATSAPP BOT SETUP =================
const whatsappBot = new Client({ authStrategy: new LocalAuth() });

whatsappBot.on('qr', (qr) => {
  console.log('WhatsApp QR code generated. Scan it with your phone:');
  qrcode.generate(qr, { small: true });
});

whatsappBot.on('ready', () => {
  console.log('✅ WhatsApp bot is ready');
});

// Debug all incoming messages
whatsappBot.on('message', async (msg) => {
  //   console.log('WhatsApp message received:', {
  //     body: msg.body,
  //     from: msg.from,
  //     to: msg.to,
  //     type: msg.type,
  //     chatId: msg.fromMe ? msg.to : msg.from
  //   });

  const chatId = msg.from;
  const text = msg.body;

  if (text === '/start') {
    msg.reply('Welcome to Crop Advisor! Use /recommend to get crop advice. Set language with /lang en or /lang hi.');
    return;
  }

  if (text.match(/\/lang (en|hi)/)) {
    const lang = text.split(' ')[1];
    whatsappUserLanguages[chatId] = lang;
    msg.reply(`Language set to ${lang === 'en' ? 'English' : 'Hindi'}.`);
    return;
  }

  if (text === '/recommend') {
    msg.reply('Enter soil type, season, location (e.g., loamy, Kharif, Punjab or red, Monsoon, Tamil Nadu)');
    return;
  }

  const [soil_type, season, location] = text.split(',').map(s => s ? s.trim() : '');
  if (!soil_type || !season || !location) {
    return msg.reply('Please provide inputs in format: soil type, season, location (e.g., loamy, Kharif, Punjab)');
  }

  // console.log('Parsed WhatsApp inputs:', { soil_type, season, location });

  try {
    const response = await fetch(`http://localhost:${process.env.PORT || 8080}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soil_type, season, location })
    });
    const data = await response.json();

    if (data.error) {
      return msg.reply('Error getting recommendation. Try again.');
    }

    const lang = whatsappUserLanguages[chatId] || 'both';
    let message = '';
    const items = data.products
      .map(p => {
        if (lang === 'en') {
          return `${p.name}: ₹${p.price}\nDescription: ${p.description}\nImage: ${p.image}`;
        } else if (lang === 'hi') {
          return `${p.name_hindi}: ₹${p.price}\nविवरण: ${p.description_hindi}\nछवि: ${p.image}`;
        } else {
          return `${p.name} / ${p.name_hindi}: ₹${p.price}\nDescription: ${p.description}\nविवरण: ${p.description_hindi}\nImage: ${p.image}`;
        }
      })
      .join('\n\n');

    if (lang === 'en') {
      message = `Recommended crop: ${data.crop}\nAdvice: ${data.advice}\nFertilizer: ${data.fertilizer}\nAvailable products:\n${items || 'None'}`;
    } else if (lang === 'hi') {
      message = `अनुशंसित फसल: ${data.crop_hindi}\nसुझाव: ${data.advice_hindi}\nउर्वरक: ${data.fertilizer_hindi}\nउपलब्ध उत्पाद:\n${items || 'कोई नहीं'}`;
    } else {
      message = `Recommended crop / अनुशंसित फसल: ${data.crop} / ${data.crop_hindi}\nAdvice / सुझाव: ${data.advice} / ${data.advice_hindi}\nFertilizer / उर्वरक: ${data.fertilizer} / ${data.fertilizer_hindi}\nAvailable products / उपलब्ध उत्पाद:\n${items || 'None / कोई नहीं'}`;
    }

    msg.reply(message);
  } catch (error) {
    console.error('WhatsApp bot error:', error.message);
    msg.reply('Server error. Please try again later.');
  }
});

whatsappBot.initialize();


// ================ ROUTES SETUP =================
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/recommend'));
app.use('/prod', require('./routes/product'));
app.use('/cust', require('./routes/customer'));
app.use('/stock', require('./routes/stock'));
app.use('/worker', require('./routes/worker'));
app.use('/payments', require('./routes/payments'));
app.use('/dash', require('./routes/dashboard'));
app.use('/cart', require('./routes/cart'));

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
const { ensureAuthenticated, ensureAdmin } = require('./middleware/auth');
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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});