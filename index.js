const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/database.js");

// Import Authorization Middleware
const authorize = require("./src/middlewares/Auth");

// Fetch database, app listen
database.connectDatabase(app);
console.log("...waiting for database connection...");

// Body parser, cors
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Use cookies to set access token
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/public"));
// app.use("/uploads", express.static("uploads"));

// Import routes
const userRoutes = require("./src/routes/User");

// Set Landing Page
app.get("/", (req, res) => {
  res.send("<h1>Landing Page<h1>");
});

// Set base routes
app.use("/user", userRoutes);
