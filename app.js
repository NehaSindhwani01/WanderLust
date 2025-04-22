if(process.env.NODE_ENV !="production"){
    require("dotenv").config() 
}

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const mongoose = require("mongoose");
const res = require("express/lib/response.js");
const req = require("express/lib/request.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");

const passport = require("passport")
const userStrategy = require("passport-local")
const User = require("./models/user.js");
const { getMaxListeners } = require("events");
const LocalStrategy = require("passport-local").Strategy;

const dbUrl = process.env.ATLASDB_URL

main()
    .then(()=>{console.log("connected to db")})
    .catch((err) => {console.log(err)});

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname ,  "views"))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate)
app.use(express.static(path.join(__dirname ,  "public")))


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

store.on("error" , ()=>{
    console.log("error in mongo session store" , err)
})
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 + 1000,
        maxAge : 7 * 24 * 60 * 60 + 1000,
        httpOnly : true,
    }
};



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/" , user);

app.use("/listings", listings);
app.use("/listings/:id/reviews" , reviews)

app.all("*" ,(req,res,next)=>{
    next(new ExpressError(404 , "Page not found"))
})
app.use((err,req,res,next)=>{
    let {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message})
    /* res.status(statusCode).send(message);*/
})

app.listen(port , ()=>{
    console.log(`server is listening on port ${port}`);
})

/*
COOKIES : small blocks of data created by web server
while a user is browsing a website and placed on the user's computer
or other device by the user's web browser

    app.get("getcookies" , (req,res)=>{
       res.cookie("greet" , "hello")
       res.send("cookies send")
    })

COOKIE - PARSER PACKAGE(HOW TO ACCESS AND PARSE COOKIES)
     // MIDDLEWARE : cookie-parser (npm package)
     app.use(cookieParser());

     app.get("/" , (req,res)=>{
       console.dir(req.cookies);
       res.send("i am root")
     })

SIGNED COOKIES : TO SAVE COOKIES FROM UNINTENTIONAL CHANGES
     app.use(cookieParser("secretcode"));

     app.get("/getsignedcookie" , (req,res)=>{
       res.cookie("color" , "red" {signed : true})
       res.send("cookies send")
    })

VERIFY SIGNED COOKIES : TO SAVE COOKIES FROM UNINTENTIONAL CHANGES
     app.use(cookieParser("secretcode"));

     app.get("/verify" , (req,res)=>{
       res.send("req.signedcookies")
    })

*/