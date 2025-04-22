const express = require("express");
const req = require("express/lib/request");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const passportLocalStrategy = require("passport-local")
const {saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/user.js")

router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signupForm))

router.route("/login")
.get( userController.renderloginForm)
.post( saveRedirectUrl, passport.authenticate("local" , {
    failureRedirect : "/login" ,
    failureFlash : true
    }) , userController.loginForm
)

router.get("/logout", userController.loggingOut)



module.exports = router;