const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const getCoordinates = require('../utils/geocode');

//index route work
module.exports.index = async (req, res) => {
    const { category } = req.query;
    let filter = {};
    let alllistings;

    if (category && category !== "") {
        if (category === "Trending") {
            // Show most recent listings for "Trending"
            alllistings = await Listing.find().sort({ createdAt: -1 });
        } else {
            // Filter listings by specific category
            filter.category = category;
            alllistings = await Listing.find(filter);
        }
    } else {
        // No filter applied, show all listings
        alllistings = await Listing.find();
    }

    if (alllistings.length === 0) {
        res.render("./listings/index.ejs", { message: `No listings found for "${category || 'All Listings'}".`, alllistings, category });
    } else {
        res.render("./listings/index.ejs", { alllistings, category });
    }
};


//new route work
module.exports.newListing = (req,res)=>{
    res.render("./listings/new.ejs")
}

//show route work
module.exports.showListing =async (req, res) => {
    let {id} = req.params;
    // In routes/listing.js or wherever you're fetching the listing
    const listing = await Listing.findById(req.params.id)
    .populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner") ;

     if (!listing) {
        req.flash("error" , "Listing you requested doesn't exist!!");
        res.redirect("/listings");
     }
     console.log(listing);  // Check if the listing and owner are properly populated
     res.render("./listings/show.ejs", {listing, currUser: req.user});  // Pass the current user
}
 
//create route work
module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);

    // Extract location from the form
    const location = req.body.listing.location;

    // Fetch coordinates using OpenCage
    const { lat, lng } = await getCoordinates(req.body.listing.location); // example function

    // Create the new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.coordinates = [lat, lng]; // <-- store as array of numbers

    // Save the listing to the database
    await newListing.save();
    req.flash("success", "New Listing Created!!");
    res.redirect(`/listings`);
};

 
//update route work
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
    req.flash("error" , "Listing you requested doesn't exist!!")   ;
    res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250")
    req.flash("success" , "Listing Updated!!")   
    res.render("./listings/edit.ejs" , {listing , originalImageUrl} );
}

//edit route work
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    /*let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You dont have permisiion to edit");
        return res.redirect(`/listings/${id}`)
    }
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid listing data");
    }*/

    let { title, description, image, price, location, country } = req.body.listing;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing});
     
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename
        
        listing.image = {url , filename};   
        await listing.save();
    } 
    req.flash("success" , "Listing Updated!")
    res.redirect(`/listings/${id}`);
}

//delete route work
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    // Fetch the listing and populate reviews before deleting
    const listing = await Listing.findById(id).populate("reviews");
     // Manually trigger findOneAndDelete so middleware runs
    await Listing.findOneAndDelete({ _id: id });
    req.flash("success" , "Listing Deleted!!")
    res.redirect("/listings");
}
