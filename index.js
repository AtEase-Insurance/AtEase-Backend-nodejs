const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectDatabase } = require("./config/database.js");
const { testNodemailer } = require("./src/services/nodemailer");

// Import Authorization Middleware
const authorize = require("./src/middlewares/Auth");

// Connect database, app listen, test node mailer
connectDatabase(app);
testNodemailer;
console.log("...waiting for database connection...");

// Body parser, cors
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Use cookies to set access token
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require("./src/routes/User");

// Set test page
app.get("/", (req, res) => {
  res.send("<h1>Landing Page<h1>");
});

// Set base routes
app.use("/user", userRoutes);
