Smart Crop Advisory System
Project Overview
The Smart Crop Advisory System is a farmer-centric platform developed for the Smart India Hackathon (SIH) 2025. It integrates a Telegram bot (@CropAdvisorBot) with a web-based shop management system to provide personalized crop recommendations and facilitate agricultural product purchases. The system supports bilingual output (English and Hindi) to enhance accessibility for Indian farmers, leveraging MongoDB for data storage and Express.js for robust API functionality. Key features include crop recommendations based on soil type, season, and location, a shop management module, and secure Google OAuth authentication for web access.
Features

Crop Recommendation Engine: Delivers tailored crop advice (e.g., groundnut for red, Monsoon, Tamil Nadu) via a Telegram bot, querying the cropRecommendations MongoDB collection.
Bilingual Support: Provides responses in English, Hindi, or both using a /lang command, ensuring inclusivity for diverse farmers.
Shop Management: Manages agricultural products (e.g., seeds, fertilizers) in a separate Product collection, linked to recommendations for seamless purchases.
Web Dashboard: EJS-based interface with Google OAuth-protected routes for user and admin access, displaying shop products.
Robust Backend: Built with Node.js, Express.js, and Mongoose, ensuring scalability and reliability.

Technologies Used

Backend: Node.js, Express.js, Mongoose
Database: MongoDB
Frontend: EJS
Authentication: Passport.js, Google OAuth
Telegram Bot: Node-Telegram-Bot-API
Other Libraries: CORS, Method-Override, Express-Session, Dotenv

Project Structure
smart-crop-advisory/
├── models/
│   ├── CropRecommendation.js
│   ├── Product.js
├── routes/
│   ├── recommend.js
│   ├── auth.js
│   ├── product.js
│   ├── customer.js
│   ├── stock.js
│   ├── worker.js
│   ├── payments.js
│   ├── dashboard.js
│   ├── cart.js
├── middleware/
│   ├── auth.js
├── config/
│   ├── passport.js
├── public/
├── views/
├── app.js
├── .env
├── README.md

Setup Instructions
Prerequisites

Node.js: v16 or higher
MongoDB: Local instance running (mongod)
Telegram Bot Token: Obtain from @BotFather
Google OAuth Credentials: For web authentication

Installation

Clone the Repository:
git clone <repository-url>
cd smart-crop-advisory


Install Dependencies:
npm install


Set Up Environment Variables:Create a .env file in the root directory:
TELEGRAM_TOKEN=your_bot_token_here
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/AGRO_MANAGEMENT
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret


Replace your_bot_token_here with the token from @BotFather.
Obtain GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Cloud Console.


Initialize MongoDB Data:

Start MongoDB (mongod).
Run the data insertion script (insertCropRecommendations.js) in MongoDB CLI:mongo AGRO_MANAGEMENT insertCropRecommendations.js


Script content (ensure saved in project root):use AGRO_MANAGEMENT;
db.cropRecommendations.drop();
db.cropRecommendations.insertMany([
  {
    crop: "groundnut",
    crop_hindi: "मूंगफली",
    soil_type: "red",
    season: "Monsoon",
    location: "Tamil Nadu",
    advice: "Sow in June-July. Ensure well-drained soil to avoid root rot.",
    advice_hindi: "जून-जुलाई में बोएं। जड़ सड़न से बचने के लिए अच्छी जल निकासी वाली मिट्टी सुनिश्चित करें।",
    fertilizer: "Phosphorus, Gypsum",
    fertilizer_hindi: "फॉस्फोरस, जिप्सम",
    recommended_products: [
      {
        name: "Groundnut Seeds",
        name_hindi: "मूंगफली के बीज",
        description: "High-yield groundnut seeds for Monsoon season.",
        description_hindi: "मानसून के लिए उच्च उपज वाले मूंगफली के बीज।",
        price: 600,
        image: { filename: "groundnut_seeds.jpg", url: "https://example.com/images/groundnut_seeds.jpg" }
      },
      {
        name: "Groundnut Gypsum Fertilizer",
        name_hindi: "मूंगफली जिप्सम उर्वरक",
        description: "Gypsum fertilizer for groundnut, improves pod formation.",
        description_hindi: "मूंगफली के लिए जिप्सम उर्वरक, फली निर्माण में सुधार करता है।",
        price: 250,
        image: { filename: "gypsum.jpg", url: "https://example.com/images/gypsum.jpg" }
      }
    ]
  },
  {
    crop: "moong",
    crop_hindi: "मूंग",
    soil_type: "alluvial",
    season: "Zaid",
    location: "Bihar",
    advice: "Sow in March-April. Use short-duration varieties.",
    advice_hindi: "मार्च-अप्रैल में बोएं। कम अवधि की किस्मों का उपयोग करें।",
    fertilizer: "Rhizobium, Phosphorus",
    fertilizer_hindi: "राइज़ोबियम, फॉस्फोरस",
    recommended_products: [
      {
        name: "Moong Seeds",
        name_hindi: "मूंग के बीज",
        description: "Moong dal seeds for Zaid season, short duration.",
        description_hindi: "ज़ैद सीजन के लिए मूंग दाल के बीज, कम अवधि।",
        price: 450,
        image: { filename: "moong_seeds.jpg", url: "https://example.com/images/moong_seeds.jpg" }
      },
      {
        name: "Moong Rhizobium Fertilizer",
        name_hindi: "मूंग राइज़ोबियम उर्वरक",
        description: "Rhizobium for moong, improves nitrogen fixation.",
        description_hindi: "मूंग के लिए राइज़ोबियम, नाइट्रोजन स्थिरीकरण में सुधार करता है।",
        price: 280,
        image: { filename: "rhizobium.jpg", url: "https://example.com/images/rhizobium.jpg" }
      }
    ]
  },
  {
    crop: "rice",
    crop_hindi: "चावल",
    soil_type: "loamy",
    season: "Kharif",
    location: "Punjab",
    advice: "Use hybrid rice seeds for better yield. Irrigate every 3-4 days.",
    advice_hindi: "बेहतर उपज के लिए हाइब्रिड चावल के बीजों का उपयोग करें। हर 3-4 दिन में सिंचाई करें।",
    fertilizer: "Urea, DAP",
    fertilizer_hindi: "यूरिया, डीएपी",
    recommended_products: [
      {
        name: "Rice Seeds Hybrid",
        name_hindi: "हाइब्रिड चावल के बीज",
        description: "High-yield hybrid rice seeds for Kharif season.",
        description_hindi: "खरीफ सीजन के लिए उच्च उपज वाले हाइब्रिड चावल के बीज।",
        price: 550,
        image: { filename: "rice_seeds.jpg", url: "https://example.com/images/rice_seeds.jpg" }
      },
      {
        name: "Rice Urea Fertilizer",
        name_hindi: "चावल यूरिया उर्वरक",
        description: "Urea fertilizer for rice, improves nitrogen content.",
        description_hindi: "चावल के लिए यूरिया उर्वरक, नाइट्रोजन सामग्री में सुधार करता है।",
        price: 300,
        image: { filename: "urea.jpg", url: "https://example.com/images/urea.jpg" }
      }
    ]
  }
]);




Run the Application:
npm run dev


Expect logs: 🚀 Server running on http://localhost:8080, ✅ Connected to MongoDB, MongoDB connection state: 1.



Usage
Telegram Bot (@CropAdvisorBot)

Start Bot:
Send /start to receive: “Welcome to Crop Advisor! Use /recommend to get crop advice. Set language with /lang en or /lang hi.”


Set Language:
Send /lang en for English or /lang hi for Hindi.
Default: Both languages.


Get Recommendations:
Send /recommend, then input (e.g., red, Monsoon, Tamil Nadu).
Example Hindi output:अनुशंसित फसल: मूंगफली
सुझाव: जून-जुलाई में बोएं। जड़ सड़न से बचने के लिए अच्छी जल निकासी वाली मिट्टी सुनिश्चित करें।
उर्वरक: फॉस्फोरस, जिप्सम
उपलब्ध उत्पाद:
मूंगफली के बीज: ₹600
विवरण: मानसून के लिए उच्च उपज वाले मूंगफली के बीज।
छवि: https://example.com/images/groundnut_seeds.jpg

मूंगफली जिप्सम उर्वरक: ₹250
विवरण: मूंगफली के लिए जिप्सम उर्वरक, फली निर्माण में सुधार करता है।
छवि: https://example.com/images/gypsum.jpg




List Crops:
Send /listcrops to view available crops (e.g., groundnut, moong, rice).



Web Interface

Access http://localhost:8080 to view the shop homepage with product listings.
Use /dashboard (user) or /admin (admin) after Google OAuth login.

Shop Management

Product Management: CRUD operations via /prod routes, managing seeds, fertilizers, etc., in the Product collection.
Integration: Recommendations include product details (e.g., Groundnut Seeds, ₹600) linked to shop inventory.
Routes: Supports customer (/cust), stock (/stock), worker (/worker), payments (/payments), and cart (/cart) management.

Troubleshooting
If the bot returns “unknown” for inputs like red, Monsoon, Tamil Nadu:

Verify MongoDB Data:use AGRO_MANAGEMENT;
db.cropRecommendations.find({ soil_type: "red", season: "Monsoon", location: "Tamil Nadu" }).pretty();


Ensure the document exists. If not, re-run the insertion script.


Check Collection Name:show collections;


Confirm cropRecommendations. If incorrect, rename:db.CropRecommendations.renameCollection("cropRecommendations");




Inspect Logs:
Check console for:
Parsed Telegram inputs: { soil_type: 'red', season: 'Monsoon', location: 'Tamil Nadu' }
Received API inputs: ...
Normalized inputs: ...
Query result: ... (should show document or “No match found”)
No matching recommendation for: ... (indicates data issue).




Test API:curl -X POST http://localhost:8080/api/recommend -H "Content-Type: application/json" -d '{"soil_type":"red","season":"Monsoon","location":"Tamil Nadu"}'


Expected:{
  "crop": "groundnut",
  "crop_hindi": "मूंगफली",
  "advice": "Sow in June-July. Ensure well-drained soil to avoid root rot.",
  "advice_hindi": "जून-जुलाई में बोएं। जड़ सड़न से बचने के लिए अच्छी जल निकासी वाली मिट्टी सुनिश्चित करें।",
  "fertilizer": "Phosphorus, Gypsum",
  "fertilizer_hindi": "फॉस्फोरस, जिप्सम",
  "products": [
    {
      "name": "Groundnut Seeds",
      "name_hindi": "मूंगफली के बीज",
      "description": "High-yield groundnut seeds for Monsoon season.",
      "description_hindi": "मानसून के लिए उच्च उपज वाले मूंगफली के बीज।",
      "price": 600,
      "image": "https://example.com/images/groundnut_seeds.jpg"
    },
    {
      "name": "Groundnut Gypsum Fertilizer",
      "name_hindi": "मूंगफली जिप्सम उर्वरक",
      "description": "Gypsum fertilizer for groundnut, improves pod formation.",
      "description_hindi": "मूंगफली के लिए जिप्सम उर्वरक, फली निर्माण में सुधार करता है।",
      "price": 250,
      "image": "https://example.com/images/gypsum.jpg"
    }
  ]
}




MongoDB Connection:
Confirm “✅ Connected to MongoDB” and “MongoDB connection state: 1” in logs.
Ensure mongod is running and MONGO_URL is correct.



Future Enhancements

Integrate machine learning for dynamic crop recommendations.
Expand cropRecommendations with more crops and regions.
Add multilingual support for additional Indian languages (e.g., Tamil, Punjabi).
Enhance shop features with real-time inventory updates and payment gateways.

Contributors

[Your Name]: Full-stack development, bot implementation, bilingual support, and debugging.

License
MIT License
