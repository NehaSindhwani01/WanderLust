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
        /*filename: {
          type: String,
          default: "default_image"
        },
        url: {
          type: String,
          default: "https://media.istockphoto.com/id/1227329047/photo/two-ampty-chairs-facing-magnificent-sunset-view-at-beach.jpg?s=612x612&w=0&k=20&c=z7HngBDSmIyrvduaiz5F9bVd9fblyRWb8AKe3pf09fY=",
          set: function(v) {
            return (!v || v.trim() === "") 
              ? "https://media.istockphoto.com/id/1227329047/photo/two-ampty-chairs-facing-magnificent-sunset-view-at-beach.jpg?s=612x612&w=0&k=20&c=z7HngBDSmIyrvduaiz5F9bVd9fblyRWb8AKe3pf09fY=" 
              : v;
          }
        }*/
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
    }
})

listingSchema.post("findOneAndDelete"  , async(listing)=>{
    if(listing){
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
})


const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;