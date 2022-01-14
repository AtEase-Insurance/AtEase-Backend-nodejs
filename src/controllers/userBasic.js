const User = require("../models/user");
const UserVerification = require("../models/userVerification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userValidation = require("../validations/user");
require("dotenv").config(); // Setup Environment Variables

const { sendVerificationEmail } = require("../services/nodemailer");

// Signup
exports.signUp = async (req, res) => {
  try {
    // validate before creating new user account
    const { error } = userValidation.signUp(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: "FAILED", message: error.details[0].message });

    let { firstname, surname, email, password } = req.body;

    // Check if account already exists in database
    const emailExist = await User.findOne({ email });
    if (emailExist)
      return res
        .status(400)
        .json({ status: "FAILED", message: "Email already exists!" });

    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ status: "FAILED", message: "Password does not match!" });
    }

    // Hash passwords
    const salt = 10;
    password = await bcrypt.hash(password, salt);

    // Create user account and store in database
    const user = new User({
      firstname,
      surname,
      email,
      password,
      verified: false,
    });
    await user.save();

    // send verification email
    sendVerificationEmail(user, res);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    let { userId, uniqueString } = req.params;

    const userVerificationExists = await UserVerification.findOne({ userId });
    if (userVerificationExists) {
      // user verification exists so we proceed
      const { expiresAt } = userVerificationExists;
      const hashedUniqueString = userVerificationExists.uniqueString;

      // checking for expired unique string
      if (expiresAt < Date.now()) {
        // record has expired so we delete it
        await UserVerification.deleteOne({ userId });
        await User.deleteOne({ _id: userId });
        return res.status(400).json({
          status: "FAILED",
          message: "Link has expired. Please sign up again.",
        });
      } else {
        // valid record exists so we validate the user
        // first compare the hashed unique string
        const uniqueStringMatches = await bcrypt.compare(
          uniqueString,
          hashedUniqueString
        );

        if (uniqueStringMatches) {
          await User.updateOne({ _id: userId }, { verified: true });
          await UserVerification.deleteOne({ userId });

          return res.status(200).json({
            status: "SUCCESS",
            message: "User has been verified",
          });
        }
      }
    } else {
      // user verification record doesn't exist
      let message =
        "Account record doesn't exist or has already been verified. Please sign up or log in.";
      res.redirect(`/user/verified/error=true&message=${message}`);
    }
  } catch (err) {
    console.log(err);
    let message =
      "An error occured while checking for existing user verification record";
    res.redirect(`/user/verified/error=true&message=${message}`);
  }
};

// Login
exports.logIn = async (req, res) => {
  // validate the entered user data
  const { error } = userValidation.logIn(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "FAILED", message: error.details[0].message });

  let { email, password } = req.body;

  // Check if user account exists in database
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ status: "FAILED", message: "Invalid email or password." });

  // Check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ status: "FAILED", message: "Invalid email or password." });

  if (user.verified == false) {
    return res.status(400).json({
      status: "FAILED",
      message: "Your email hasn't been verified yet. Please check your inbox!",
    });
  }

  // Create a token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // Assign token and send user details
  res.cookie("auth_token", token, { httpOnly: true }).status(200).json({
    status: "SUCCESS",
    message: "Logged in successfully!",
    user: user,
  });
};

// Logout
exports.logOut = (req, res) => {
  return res
    .clearCookie("auth_token")
    .status(200)
    .json({ status: "SUCCESS", message: "Logged out successfully!" });
};
