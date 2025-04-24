const Joi = require('joi');

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0).not(NaN),       
        image: Joi.object().optional() ,  
        category: Joi.string().valid("Rooms", "Farms", "Beach", "Camping", "Castles", "Trending", "Amazing Views", "Iconic cities", "Arctic", "Luxe", "Mansions").required()       
    }).required()
})


const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required(),

})

module.exports = {
    listingSchema,
    reviewSchema
};