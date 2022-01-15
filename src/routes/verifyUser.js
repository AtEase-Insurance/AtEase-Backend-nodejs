const router = require("express").Router();

const User = require("../models/user");
const UserVerification = require("../models/userVerification");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Setup Environment Variables

// 61e2d8b98e9694c4b34fcd6a

// Verify User
router.get("/:userId/:uniqueString", async (req, res) => {
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
      await User.updateOne({ _id: userId }, { verified: true });
      await UserVerification.deleteOne({ userId });
      message =
        "Your account has been verified successfully. Please return to the login page.";

      // Show the verification page using ejs view engine
      return res.render("pages/index", { message: message });
    }
  } catch (err) {
    return res.render("pages/index", { message: err.message });
  }
});

module.exports = router;
