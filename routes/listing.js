const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js")
const {reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

const listingController = require("../controllers/listings.js")

//INDEX & CREATE ROUTE
router.route("/")
.get(wrapAsync(listingController.index)) // INDEX
.post(
    isLoggedIn , 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
)


//NEW - ROUTE
router.get("/new" ,  isLoggedIn , listingController.newListing)

//SHOW & EDIT & DELETE ROUTE
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn , isOwner  ,upload.single('listing[image]'), validateListing, wrapAsync(listingController.editListing))
.delete( isOwner , isLoggedIn  , wrapAsync(listingController.deleteListing));

//search route


//UPDATE ROUTE
router.get("/:id/edit" , isOwner ,  isLoggedIn , wrapAsync (listingController.updateListing));


module.exports = router;