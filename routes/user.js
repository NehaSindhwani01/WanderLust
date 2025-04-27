const express = require("express");
const passport = require("passport"); // Add this line
const router = express.Router();
const userController = require("../controllers/user"); // Ensure correct path
const { saveRedirectUrl } = require("../middleware");

router.route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.signupForm);

router.route("/login")
  .get(userController.renderloginForm)
  .post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }), userController.loginForm);

router.get("/logout", userController.loggingOut);

module.exports = router;
