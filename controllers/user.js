const User = require("../models/user.js");

//get signup request
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signupForm = async(req,res)=>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registereduser = await User.register(newUser , password);
        console.log(registereduser);
        req.login(registereduser , (err)=>{
            if(err){
                next(err);
            }
            req.flash("success" , "Welcome to WanderLust");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup")
    }
}

//get login request
module.exports.renderloginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginForm = async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}  

module.exports.loggingOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out!!")
        res.redirect("/listings");
    })
}