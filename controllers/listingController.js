const Listing = require('../models/listing.js'); // Import Listing model

// Search listings based on query
module.exports.searchListings = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.redirect('/listings');
    }

    try {
        const searchResults = await Listing.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } },
            ]
        });

        res.render('listings/searchResults', { searchResults, query });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
