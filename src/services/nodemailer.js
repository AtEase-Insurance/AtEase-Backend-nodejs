require("dotenv").config(); // env variables

const bcrypt = require("bcryptjs"); // password handler
const { v4: uuidv4 } = require("uuid"); // unique string generator
const nodemailer = require("nodemailer"); // nodemailer email handler

const UserVerification = require("../models/userVerification"); // mongodb user verification model

// create email transporter
const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

// test email success
exports.testNodemailer = transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for message");
    console.log(success);
  }
});

// send verification email
exports.sendVerificationEmail = ({ _id, email }, res) => {
  // url to be used in the email
  const currentUrl = "https://atease-insurance.herokuapp.com";
  const uniqueString = uuidv4() + _id;

  // mail options
  const mailOptions = {
    from: process.env.AUTH_USER,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete the signup and login into your account.</p>
           <p>This link <b>expires in 6 hours</b>.</p>
           <p>Click <a href=${
             currentUrl + "/user/verify/" + _id + "/" + uniqueString
           }>here</a> to proceed.</p>
           `,
  };

  // hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      });

      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              // email sent and verification record saved
              res.status(200).json({
                status: "PENDING",
                message: "Verification email sent",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json({
                status: "FAILED",
                message: "Verification email failed",
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            status: "FAILED",
            message: "Couldn't save verification email data!",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: "FAILED",
        message: "An error occured while hashing email data!",
      });
    });
};
