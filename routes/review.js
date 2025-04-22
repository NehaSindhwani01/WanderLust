const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require("../schema.js")
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")

//REVIEWS : POST ROUTE (WHY NOT GET : BUT DIRECT POST : BECAUSE REVIEWS ARE ALWAYS ACCESIBLE BY LISTINGS NOT SEPARATE)
router.post("/",isLoggedIn , validateReview, wrapAsync(reviewController.createReview));


//DELETE REVIEW ROUTE
router.delete("/:reviewId"  ,isLoggedIn , isReviewAuthor ,wrapAsync(reviewController.deleteReview))

module.exports = router;