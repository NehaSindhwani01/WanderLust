// utils/geocode.js
const axios = require('axios');
require('dotenv').config();

async function getCoordinates(location) {
    try {
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                key: process.env.OPENCAGE_API_KEY,
                q: location,
                limit: 1
            }
        });

        const { lat, lng } = response.data.results[0].geometry;
        return { lat, lng };
    } catch (error) {
        console.error('Error getting coordinates:', error.message);
        return { lat: null, lng: null };
    }
}

module.exports = getCoordinates;
