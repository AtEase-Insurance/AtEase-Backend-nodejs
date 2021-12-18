const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userValidation = require("../validations/User");
require("dotenv").config(); // Setup Environment Variables

// Signup
exports.signUp = async (req, res) => {
  try {
    // validate before creating new user account
    const { error } = userValidation.signUp(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if account already exists in database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
      return res
        .status(400)
        .json({ success: false, msg: "Email already exists!" });

    // Should we use BVN to prevent users from having more than one account?
    // You can only have one account. To recover password, contact ... CRM

    if (req.body.password !== req.body.confirmPassword) {
      return res.json({ success: false, msg: "Password does not match!" });
    }

    // Hash passwords
    password = await bcrypt.hash(req.body.password, 12);

    // Create user account and store in database
    const user = new User({ ...req.body, password });
    await user.save();

    // Return new user account details
    res.status(201).json({
      success: true,
      msg: `Account has been created.`,
      data: user,
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

// Login
exports.logIn = async (req, res) => {
  // validate the entered user data
  const { error } = userValidation.logIn(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user account exists in database
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, msg: "Invalid email or password." });

  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ success: false, msg: "Invalid email or password." });

  // Create a token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // Assign token and send user details
  res.cookie("auth_token", token).status(200).json({
    success: true,
    msg: "Logged in successfully!",
    userDetails: user,
  });
};

// Logout
exports.logOut = (req, res) => {
  return res
    .clearCookie("auth_token")
    .status(200)
    .json({ success: true, msg: "Successfully logged out!" });
};
