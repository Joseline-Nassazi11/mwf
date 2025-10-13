//1.Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("./config/passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const moment = require("moment");
const methodOverride = require("method-override");
// const passport = require("./config/passport"); // We'll create this file next

require("dotenv").config();
const UserModel = require("./models/userModel");
// Import routes
const managerRoutes = require("./routes/managerRoutes");
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
const productlistRoutes = require("./routes/productlistRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const classRoutes = require("./routes/classRoutes");
const supplierRoutes = require("./routes/supplierRoutes")
const posRoutes = require("./routes/posRoutes");
const todoRoutes = require("./routes/todoRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
//2. Instantiations
const app = express();
const port = 3000

//3. Configurations
app.locals.moment = moment; // for date formatting in pug
// Setting up mongodb connections
mongoose.connect(process.env.MONGODB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
});

mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

//   setting view engine to pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"))

// app.use((req, res, next) => {
//   console.log("REQUEST:", req.method, req.url);
//   next();
// });

//4. Middleware
// app.use(express.static("public")); 
app.use(express.static(path.join(__dirname, "public")))//static files 
app.use(express.urlencoded({extended: true}))  //Helps to add data from forms
app.use(express.json());  //  Enables parsing of JSON body (needed for POS checkout)

// Express session configs
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL}),
    cookie: {maxAge: 24*60*60*1000} //oneday
  })
);
// Passport configs
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
// authenticate with passport local strategy
passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

//5.Routes
// using imported routes
app.use("/", managerRoutes);
app.use("/", authRoutes);
app.use("/", stockRoutes);
app.use("/", salesRoutes);
app.use("/", productlistRoutes);
app.use("/", userRoutes);
app.use("/", dashboardRoutes);
app.use("/", classRoutes);
app.use("/", supplierRoutes)
app.use("/", posRoutes);
app.use("/", todoRoutes);
app.use("/dashboard/expenses", expenseRoutes);


//non existent route handler
app.use((req, res)=>{
    res.status(404).send("Oops route not found.");
});

// 6. Bootstrapping Server
//This should always be the last line in this file
app.listen(port, () => console.log(`listening on port ${port}`));
