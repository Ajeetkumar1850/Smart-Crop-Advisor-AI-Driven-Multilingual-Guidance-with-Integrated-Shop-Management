const express = require('express');
const router = express.Router();
const CropRecommendation = require('../models/CropRecommendation');

router.post('/recommend', async (req, res) => {
  try {
    const { soil_type, season, location } = req.body;

    // Log inputs for debugging
    // console.log('Received API inputs:', { soil_type, season, location });

    // Normalize inputs
    const normalizedSoil = soil_type?.trim().toLowerCase();
    const normalizedSeason = season?.trim().toLowerCase();
    const normalizedLocation = location?.trim().toLowerCase();

    // Log normalized inputs
    // console.log('Normalized inputs:', { normalizedSoil, normalizedSeason, normalizedLocation });

    // Find matching recommendation
    let recommendation = await CropRecommendation.findOne({
      soil_type: { $regex: `^${normalizedSoil}$`, $options: 'i' },
      season: { $regex: `^${normalizedSeason}$`, $options: 'i' },
      $or: [
        { location: { $regex: `^${normalizedLocation}$`, $options: 'i' } },
        { location: { $exists: false } },
        { location: null }
      ]
    });

    // Log query result
    console.log('Query result:', recommendation ? recommendation : 'No match found');

    // Default if no match
    if (!recommendation) {
      console.log('No matching recommendation for:', { normalizedSoil, normalizedSeason, normalizedLocation });
      recommendation = {
        crop: 'unknown',
        crop_hindi: 'अज्ञात',
        advice: 'No specific recommendation available. Consult local agriculture experts.',
        advice_hindi: 'कोई विशिष्ट सिफारिश उपलब्ध नहीं है। स्थानीय कृषि विशेषज्ञों से परामर्श करें।',
        fertilizer: 'General NPK',
        fertilizer_hindi: 'सामान्य एनपीके',
        recommended_products: []
      };
    }

    res.json({
      crop: recommendation.crop,
      crop_hindi: recommendation.crop_hindi,
      advice: recommendation.advice,
      advice_hindi: recommendation.advice_hindi,
      fertilizer: recommendation.fertilizer,
      fertilizer_hindi: recommendation.fertilizer_hindi,
      products: recommendation.recommended_products.map(p => ({
        name: p.name,
        name_hindi: p.name_hindi,
        description: p.description,
        description_hindi: p.description_hindi,
        price: p.price,
        image: p.image.url
      }))
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;