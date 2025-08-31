const express = require("express");
const router = express.Router();
const { askGemini } = require("../controllers/gemini");

router.post("/gemini", askGemini); // POST /api/gemini

module.exports = router;
