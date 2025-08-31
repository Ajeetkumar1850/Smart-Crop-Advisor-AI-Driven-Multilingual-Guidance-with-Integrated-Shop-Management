const mongoose = require('mongoose');

const cropRecommendationSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    trim: true
  },
  crop_hindi: {
    type: String,
    required: true,
    trim: true
  },
  soil_type: {
    type: String,
    required: true,
    trim: true
  },
  season: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  advice: {
    type: String,
    required: true,
    trim: true
  },
  advice_hindi: {
    type: String,
    required: true,
    trim: true
  },
  fertilizer: {
    type: String,
    required: true,
    trim: true
  },
  fertilizer_hindi: {
    type: String,
    required: true,
    trim: true
  },
  recommended_products: [
    {
      name: { type: String, required: true },
      name_hindi: { type: String, required: true },
      description: { type: String, required: true },
      description_hindi: { type: String, required: true },
      price: { type: Number, required: true },
      image: {
        filename: { type: String, required: true },
        url: { type: String, required: true }
      }
    }
  ]
}, {
  timestamps: true,
  collection: 'cropRecommendations'
});

module.exports = mongoose.model('CropRecommendation', cropRecommendationSchema);