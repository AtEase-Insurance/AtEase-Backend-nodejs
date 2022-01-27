const router = require("express").Router();
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Setup Environment Variables

const User = require("../models/user");
const UserVerification = require("../models/userVerification");
const OtpVerification = require("../models/otpVerification");
const {
  signupSuccessfulEmail,
  passwordChangedEmail,
} = require("../services/mailOptions/mailControllers");

// Verify User
router.get("/signup/:userId/:uniqueString", async (req, res) => {
  let { userId, uniqueString } = req.params;

  try {
    let message = "";

    const userVerificationExists = await UserVerification.findOne({ userId });

    // user verification record doesn't exist
    if (!userVerificationExists) {
      message =
        "Account record doesn't exist or has already been verified. Please sign up or log in.";
      throw new Error(message);
    }

    // user verification exists so we proceed
    const { expiresAt } = userVerificationExists;
    const hashedUniqueString = userVerificationExists.uniqueString;

    // checking for expired unique string
    if (expiresAt < Date.now()) {
      // record has expired so we delete it
      await UserVerification.deleteOne({ userId });
      message = "Link has expired. Request to resend verification link.";
      throw new Error(message);
    }

    // valid record exists so we validate the user by first comparing the hashed unique string
    const uniqueStringMatches = await bcrypt.compare(
      uniqueString,
      hashedUniqueString
    );

    if (!uniqueStringMatches) {
      await UserVerification.deleteOne({ userId });
      message =
        "Account record doesn't match. Request to resend verification link.";
      throw new Error(message);
    }

    if (uniqueStringMatches) {
      let user = await User.findById(userId);
      await User.updateOne({ _id: userId }, { verified: true });
      await UserVerification.deleteOne({ userId });
      message =
        "Your account has been verified successfully. Please return to the login page.";

      // Show the verification page using ejs view engine
      signupSuccessfulEmail({ email: user.email }, res, message);
      // return res.render("pages/index", { message: message });
    }
  } catch (err) {
    return res.render("pages/index", { message: err.message });
  }
});

// Reset Password
router.post("/password/reset", async (req, res) => {
  let { userId, otp, newPassword } = req.body;

  try {
    let message = "";
    const otpVerificationExists = await OtpVerification.findOne({ userId });

    // user verification record doesn't exist
    if (!otpVerificationExists) {
      return res.status(400).json({
        status: "FAILED",
        message:
          "Account record doesn't exist. Please sign up or provide valid email.",
      });
    }

    // user verification exists so we proceed
    const { expiresAt } = otpVerificationExists;
    const hashedOtp = otpVerificationExists.otp;

    // checking for expired otp
    if (expiresAt < Date.now()) {
      // record has expired so we delete it
      await OtpVerification.deleteOne({ userId });
      return res.status(400).json({
        status: "FAILED",
        message: "OTP has expired. Try again to resend password reset email.",
      });
    }

    // valid record exists so we validate the user by first comparing the hashed unique string
    const otpMatches = await bcrypt.compare(otp, hashedOtp);

    if (!otpMatches) {
      await OtpVerification.deleteOne({ userId });
      return res.status(400).json({
        status: "FAILED",
        message:
          "Account record doesn't match. Request to resend password reset email.",
      });
    }

    if (otpMatches) {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({
          status: "FAILED",
          message: "Cannot find user record.",
        });
      }

      // Hash new password and replace
      const password = await bcrypt.hash(newPassword, 12);
      user.password = password;

      await user.save();
      passwordChangedEmail({ email: user.email });
      await OtpVerification.deleteOne({ userId });

      // Send user password changed email
      return res.status(400).json({
        status: "SUCCESS",
        message: "Your password has been updated successfully!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json.status(500).json({
      status: "FAILED",
      message: err.message,
    });
  }
});

module.exports = router;
