const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    },
});

//for pass : pbkdf2 algo is used for hashing

userSchema.plugin(passportLocalMongoose); //username and salting , hashing password automatically 
                                    //  created useing p-l-m

module.exports = mongoose.model('User' , userSchema)