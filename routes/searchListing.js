const express = require('express');
const router = express.Router();
const { searchListings } = require('../controllers/listingController');

// Route: /listings/search?query=somevalue
router.get('/', searchListings);

module.exports = router;
