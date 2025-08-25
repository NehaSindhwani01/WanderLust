if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const mongoose = require("mongoose");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const searchRoutes = require('./routes/searchListing.js');

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

// Connect to MongoDB
main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("Database connection error:", err);
    process.exit(1);  // Exit process if the DB connection fails
});

async function main() {
    await mongoose.connect(dbUrl);
}

// Setup express view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session setup with MongoStore
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // 1 day
});

store.on("error", (e) => {
    console.log("Error in Mongo Store:", e);
});

// Session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

// Middleware for locals and logging user info
app.use((req, res, next) => {
    console.log("req.user:", req.user); // Check user in session
    console.log("Session:", req.session); // Log session details
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // Make user available in templates
    next();
});

app.get("/", (req, res) => {
    res.render("listings/home.ejs"); // Render the homepage
});

// Define routes
app.use("/", userRoutes);
app.use("/listings/search", searchRoutes); // Ensure this is above dynamic routes
app.use("/listings/:id/reviews", reviews);
app.use("/listings", listings); // Always keep dynamic routes last

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});


// 404 Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handling
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
