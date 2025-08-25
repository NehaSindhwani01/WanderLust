const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./reviews.js")
const listingSchema = new Schema({
    title:{
       type : String,
       required : true
    },
    description:{
        type : String,
    },
    image: {
        url : String,
        filename : String,
    },         
    price:{
        type : Number,
    },
    location:{
        type : String,
    },
    country:{
        type : String,
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    coordinates: {
        type: [Number],  // Array of numbers (longitude, latitude)
        required: true,
    },
    category: {
        type: String,
        enum: ["Rooms", "Farms", "Beach", "Camping", "Castles", "Trending", "Amazing Views", "Iconic cities" , "Arctic" , "Luxe" , "Beach" , "Mansions"],
        required: true,
    }      
}, { timestamps: true });

listingSchema.post("findOneAndDelete"  , async(listing)=>{
    if(listing){
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
})


const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;