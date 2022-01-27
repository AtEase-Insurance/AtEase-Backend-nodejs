const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectDatabase } = require("./config/database.js");
const { testNodemailer } = require("./src/services/mailOptions/mailControllers");

// Import Authorization Middleware
const auth = require("./src/middlewares/auth");

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
const userBasicRoutes = require("./src/routes/userBasic");
const userProfileRoutes = require("./src/routes/userProfile");
const verifyUser = require("./src/routes/verifyUser");

// set the view engine to ejs
app.set("view engine", "ejs");

// Set test page
app.get("/", (req, res) => {
  res.send("<h1>Landing Page<h1>");
});

// Set base routes
app.use("/user", userBasicRoutes);
app.use("/user/verification", verifyUser);
app.use("/user/profile", auth, userProfileRoutes);