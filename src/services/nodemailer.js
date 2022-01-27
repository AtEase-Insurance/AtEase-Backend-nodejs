const nodemailer = require("nodemailer"); // nodemailer email handler
require("dotenv").config(); // env variables

// create email transporter
exports.transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});
