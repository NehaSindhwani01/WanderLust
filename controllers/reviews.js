const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

//post route work
module.exports.createReview = async (req, res) => {
    const { id } = req.params;  // extract listing ID from the route param
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created!!")   
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}

//delete route work
module.exports.deleteReview = async(req,res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted!!")   
    res.redirect(`/listings/${id}`);
}