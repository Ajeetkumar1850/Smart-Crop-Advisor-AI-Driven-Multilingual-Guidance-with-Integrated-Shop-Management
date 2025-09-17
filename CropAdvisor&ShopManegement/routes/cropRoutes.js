
const express = require('express');
const router = express.Router();
const CropRecommendation = require('../models/CropRecommendation'); // Adjust path if needed

// POST /api/recommend
router.post('/recommend', async (req, res) => {
  try {
    const { soil_type, season, location } = req.body;
    if (!soil_type || !season || !location) {
      return res.status(400).json({ error: 'Please provide soil_type, season, and location' });
    }

    const crop = await CropRecommendation.findOne({
      soil_type: soil_type.trim(),
      season: season.trim(),
      location: location.trim()
    });

    if (!crop) {
      return res.status(404).json({ error: 'No matching crop recommendation found' });
    }

    res.json({
      crop: crop.crop,
      crop_hindi: crop.crop_hindi,
      advice: crop.advice,
      advice_hindi: crop.advice_hindi,
      fertilizer: crop.fertilizer,
      fertilizer_hindi: crop.fertilizer_hindi,
      products: crop.recommended_products.map(p => ({
        name: p.name,
        name_hindi: p.name_hindi,
        description: p.description,
        description_hindi: p.description_hindi,
        price: p.price,
        image: p.image.url
      }))
    });
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
