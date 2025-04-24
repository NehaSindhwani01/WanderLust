const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");

// GET listings filtered by category
router.get("/items", async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const listings = await Listing.find(filter);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

module.exports = router;
