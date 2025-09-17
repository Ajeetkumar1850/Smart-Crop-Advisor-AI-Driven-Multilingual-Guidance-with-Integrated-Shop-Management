const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const CropRecommendation = require('./models/CropRecommendation'); 

// Load environment variables
require('dotenv').config();

// User language storage
const userLanguages = {};
const whatsappUserLanguages = {};

// User subscriptions for weather alerts
const userSubscriptions = { telegram: {}, whatsapp: {} };

// Initialize Telegram bot
const telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Initialize WhatsApp bot with puppeteer
const whatsappBot = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

// Telegram: Handle polling errors
telegramBot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error.message);
});

// Telegram: Start command with buttons
telegramBot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = 
    "🌱 *Welcome to Crop Advisor!* 🌾\n\n" +
    "🤖 I’m here to guide you with the best crop advice.\n\n" +
    "👉 Use the buttons below to get started:\n" +
    "1. 🌾 Get Recommendation (/recommend)\n" +
    "2. 📷 Detect Crop Disease (upload an image)\n" +
    "3. 🌐 Change language (/lang en or /lang hi)\n" +
    "4. 🌦️ Subscribe to weather alerts (/subscribe <location>)";

  telegramBot.sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🌾 Get Recommendation", callback_data: "recommend" },
          { text: "📷 Detect Disease", callback_data: "disease" }
        ],
        [
          { text: "🌐 English", callback_data: "lang_en" },
          { text: "🇮🇳 हिंदी", callback_data: "lang_hi" }
        ]
      ]
    }
  });
});

// Telegram: Handle button clicks
telegramBot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "recommend") {
    telegramBot.sendMessage(chatId, "🌾 Enter soil type, season, location (e.g., loamy, Kharif, Punjab or red, Monsoon, Tamil Nadu)!");
  } else if (data === "disease") {
    telegramBot.sendMessage(chatId, "📷 Please upload an image of the crop to detect diseases.");
  } else if (data === "lang_en") {
    userLanguages[chatId] = 'en';
    telegramBot.sendMessage(chatId, "✅ Language set to English.");
  } else if (data === "lang_hi") {
    userLanguages[chatId] = 'hi';
    telegramBot.sendMessage(chatId, "✅ भाषा हिंदी में सेट हो गई है।");
  }
});

// Telegram: Handle user inputs
telegramBot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text && text.startsWith('/')) return;

  const [soil_type, season, location] = text ? text.split(',').map(s => s.trim()) : [];
  if (!soil_type || !season || !location) {
    return telegramBot.sendMessage(chatId, '🌾 Please provide soil type, season, location (e.g., loamy, Kharif, Punjab or red, Monsoon, Tamil Nadu)!');
  }

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
    console.error('Telegram bot error:', error.message);
    telegramBot.sendMessage(chatId, 'Server error. Please try again later.');
  }
});

// Telegram: Subscribe to weather alerts
telegramBot.onText(/\/subscribe (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const location = match[1].trim();
  userSubscriptions.telegram[chatId] = location;
  telegramBot.sendMessage(chatId, `Subscribed to weather alerts for ${location}`);
});

// Telegram: Handle image uploads for disease detection
telegramBot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const fileId = msg.photo[msg.photo.length - 1].file_id;
  const file = await telegramBot.getFile(fileId);
  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;

  try {
    const imageResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(imageResponse.data).toString('base64');
    const lang = userLanguages[chatId] || 'en';
    const analysis = await analyzeImage(base64, 'image/jpeg', lang);
    telegramBot.sendMessage(chatId, analysis);
  } catch (error) {
    console.error('Telegram image error:', error.message);
    telegramBot.sendMessage(chatId, 'Error analyzing image. Try again.');
  }
});

// WhatsApp: Setup
whatsappBot.on('qr', (qr) => {
  console.log('WhatsApp QR code generated. Scan it with your phone:');
  qrcode.generate(qr, { small: true }, (code) => {
    console.log('QR Code:\n', code);
  });
});

whatsappBot.on('ready', () => {
  console.log('✅ WhatsApp bot is ready');
});

whatsappBot.on('auth_failure', (msg) => {
  console.error('WhatsApp authentication failure:', msg);
});

whatsappBot.on('disconnected', (reason) => {
  console.error('WhatsApp disconnected:', reason);
});

// WhatsApp: Handle messages
whatsappBot.on('message', async (msg) => {
  const chatId = msg.from;
  const text = msg.body;

  // Handle image uploads for disease detection
  if (msg.hasMedia && msg.type === 'image') {
    try {
      const media = await msg.downloadMedia();
      const base64 = media.data;
      const lang = whatsappUserLanguages[chatId] || 'en';
      const analysis = await analyzeImage(base64, media.mimetype, lang);
      msg.reply(analysis);
    } catch (error) {
      console.error('WhatsApp image error:', error.message);
      msg.reply('Error analyzing image. Try again.');
    }
    return;
  }

  if (text === '/start') {
    const message = 
      "🌱 *Welcome to Crop Advisor!* 🌾\n\n" +
      "🤖 I’m here to guide you with the best crop advice.\n\n" +
      "👉 Reply with a number to choose:\n" +
      "1. 🌾 Get Recommendation\n" +
      "2. 📷 Detect Crop Disease (upload an image)\n" +
      "3. 🌐 English\n" +
      "4. 🇮🇳 हिंदी\n" +
      "✨ Or type /recommend, /lang en, /lang hi, or /subscribe <location>";
    msg.reply(message);
    return;
  }

  // Handle menu selections
  if (['1', '2', '3', '4'].includes(text)) {
    if (text === '1') {
      msg.reply('🌾 Enter soil type, season, location (e.g., loamy, Kharif, Punjab or red, Monsoon, Tamil Nadu)!');
    } else if (text === '2') {
      msg.reply('📷 Please upload an image of the crop to detect diseases.');
    } else if (text === '3') {
      whatsappUserLanguages[chatId] = 'en';
      msg.reply('✅ Language set to English.');
    } else if (text === '4') {
      whatsappUserLanguages[chatId] = 'hi';
      msg.reply('✅ भाषा हिंदी में सेट हो गई है।');
    }
    return;
  }

  if (text.match(/\/lang (en|hi)/)) {
    const lang = text.split(' ')[1];
    whatsappUserLanguages[chatId] = lang;
    msg.reply(`✅ Language set to ${lang === 'en' ? 'English' : 'Hindi'}.`);
    return;
  }

  if (text === '/recommend') {
    msg.reply('🌾 Enter soil type, season, location (e.g., loamy, Kharif, Punjab or red, Monsoon, Tamil Nadu)!');
    return;
  }

  if (text.match(/\/subscribe (.+)/)) {
    const location = text.split(' ')[1].trim();
    userSubscriptions.whatsapp[chatId] = location;
    msg.reply(`Subscribed to weather alerts for ${location}`);
    return;
  }
  const [soil_type, season, location] = text.split(',').map(s => s ? s.trim() : '');
  if (!soil_type || !season || !location) {
    return msg.reply('🌾 Please provide soil type, season, location (e.g., loamy, Kharif, Punjab or red, Monsoon, Tamil Nadu)!');
  }
  console.log('Parsed WhatsApp inputs:', { soil_type, season, location });
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

// Function to analyze image with Gemini
async function analyzeImage(base64, mimeType, lang) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Detect crop disease in this image and suggest remedies. Provide response in " + (lang === 'hi' ? 'Hindi' : 'English') + ".";
  const imagePart = {
    inlineData: {
      data: base64,
      mimeType: mimeType
    },
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('Failed to analyze image with Gemini API.');
  }
}

// Weather alerts
async function sendWeatherAlerts() {
  console.log('Running weather alerts for:', userSubscriptions);
  for (const platform in userSubscriptions) {
    for (const [chatId, location] of Object.entries(userSubscriptions[platform])) {
      try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
        console.log(`Weather for ${location}:`, response.data.weather[0].main, response.data.main.temp);
        const weather = response.data;
        const condition = weather.weather[0].main;
        const temp = weather.main.temp;
        const crop = await CropRecommendation.findOne({ location });

        let alert = `Weather in ${location}: ${condition}, ${temp}°C. `;
        if (crop) {
          if (condition.includes('Rain') && crop.crop === 'groundnut') {
            alert = `Heavy rain expected in ${location}. Delay sowing ${crop.crop_hindi}.`;
          } else if (temp > 35 && crop.crop === 'moong') {
            alert = `High temperature (${temp}°C) in ${location}. Ensure irrigation for ${crop.crop_hindi}.`;
          } else {
            alert += `Recommended for ${crop.crop_hindi}: Check conditions.`;
          }
        } else {
          alert += 'No crop data found.';
        }

        if (platform === 'telegram') {
          telegramBot.sendMessage(chatId, alert);
          console.log(`Sent Telegram alert to ${chatId}: ${alert}`);
        } else {
          whatsappBot.sendMessage(chatId, alert);
          console.log(`Sent WhatsApp alert to ${chatId}: ${alert}`);
        }
      } catch (error) {
        console.error(`Weather API error for ${location}:`, error.message);
        const errorMsg = `Invalid location: ${location}. Please use /subscribe with a valid location (e.g., Tamil Nadu).`;
        if (platform === 'telegram') {
          telegramBot.sendMessage(chatId, errorMsg);
        } else {
          whatsappBot.sendMessage(chatId, errorMsg);
        }
      }
    }
  }
}

//Schedule weather alerts every 2 minutes
cron.schedule('*/2 * * * *', () => {
  console.log('Checking weather alerts...');
  sendWeatherAlerts();
});

// Export bots
module.exports = { telegramBot, whatsappBot, sendWeatherAlerts };