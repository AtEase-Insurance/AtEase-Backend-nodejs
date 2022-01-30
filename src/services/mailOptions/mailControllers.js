const bcrypt = require("bcryptjs"); // password handler
const { v4: uuidv4 } = require("uuid"); // unique string generator
const otpGenerator = require("otp-generator"); // otp generator

require("dotenv").config(); // env variables
const { transporter } = require("../nodemailer");
const UserVerification = require("../../models/userVerification");
const OtpVerification = require("../../models/otpVerification");
const {
  verifyEmail,
  resetPassword,
  receiveEnquiry,
  enquirySent,
  signupSuccessful,
  passwordChanged,
} = require("./mailOptions");

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
  // Generate new unique string
  const currentUrl = process.env.CURRENT_BACKEND_URL;
  const uniqueString = uuidv4() + _id;

  // mail options
  const mailOptions = verifyEmail({ currentUrl, _id, email, uniqueString });

  // hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 600000,
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
                message:
                  "A verification link has been sent to your email. Please click the link to verify your account.",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json({
                status: "FAILED",
                message: "Verification email failed.",
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

// send password reset email
exports.sendPasswordResetEmail = async ({ _id, email }, res) => {
  const currentUrl = process.env.CURRENT_FRONTEND_URL;
  // Generate new unique otp
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // mail options
  const mailOptions = resetPassword({ currentUrl, _id, email, otp });

  // hash the unique otp
  const saltRounds = 12;
  const hashedOtp = await bcrypt.hash(otp, saltRounds);

  // Check if otpVerification exists
  const otpVerificationExists = await OtpVerification.findOne({ userId: _id });
  if (otpVerificationExists) {
    // update the otp in the existing document
    otpVerificationExists.otp = hashedOtp;
    await otpVerificationExists.save();
  } else {
    // create a new otp document
    const newVerification = new OtpVerification({
      userId: _id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });
    await newVerification.save();
  }

  transporter
    .sendMail(mailOptions)
    .then(() => {
      // email sent and password reset verification record saved
      res.status(200).json({
        status: "SUCCESS",
        message: "A one-time-password has been sent to your email.",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: "FAILED",
        message: "Failed to send password reset email.",
      });
    });
};

// send customer enquiry email to CRM
exports.receiveEnquiryEmail = ({ enquiry }) => {
  // mail options
  const mailOptions = receiveEnquiry({ enquiry });

  transporter
    .sendMail(mailOptions)
    .then(() => {
      // email sent and verification record saved
      console.log("Customer enquiry successfully lodged.");
    })
    .catch((err) => {
      console.log(err);
    });
};

// send customer confirmation of enquiry message
exports.sendEnquiryEmail = ({ enquiry }) => {
  // mail options
  const mailOptions = enquirySent({ enquiry });

  transporter
    .sendMail(mailOptions)
    .then(() => {
      // email sent and verification record saved
      console.log("Customer enquiry sent!");
    })
    .catch((err) => {
      console.log(err);
    });
};

// send customer signup success email on completing signup
exports.signupSuccessfulEmail = ({ email }, res, message) => {
  // mail options
  const mailOptions = signupSuccessful({ email });

  transporter
    .sendMail(mailOptions)
    .then(() => {
      // email sent and verification record saved
      return res.render("pages/index", { message: message });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: "FAILED",
        message: "Failed to complete signup.",
      });
    });
};

// send customer enquiry email to CRM
exports.passwordChangedEmail = ({ email }) => {
  // mail options
  const mailOptions = passwordChanged({ email });

  transporter
    .sendMail(mailOptions)
    .then(() => {
      // email sent and verification record saved
      console.log("Sent password changed email.");
    })
    .catch((err) => {
      console.log("Failed to send password changed email.");
    });
};
