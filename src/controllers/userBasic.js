const User = require("../models/user");
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

  if (user.verified == false) {
    return res.status(400).json({
      status: "FAILED",
      msg: "Email hasn't been verified yet. Check your inbox!",
    });
  }

  // Check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ status: "FAILED", message: "Invalid email or password." });

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
