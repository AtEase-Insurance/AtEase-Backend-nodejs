const User = require("../models/User");
const bcrypt = require("bcryptjs");
const userValidation = require("../validations/User");

// getProfile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

// editProfile
exports.editProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);

    // Limit user profile info changes via this route to only the following
    const { ...name } = req.body;

    // User can update or leave out any of these fields
    if (address) user.address = address;
    if (phoneNo) user.phoneNo = phoneNo;

    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

// changePassword
exports.changePassword = async (req, res) => {
  // validate request body
  const { error } = userValidation.passwordChange(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user's old password is correct
  let user = await User.findById(req.user.id);
  const validPassword = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );
  if (!validPassword)
    return res.status(400).json({
      success: false,
      msg: "Invalid Old Password.",
    });

  // Hash new password and replace
  const password = await bcrypt.hash(req.body.newPassword, 12);
  user.password = password;
  await user.save();

  res.status(200).json({
    status: "success",
    msg: "Your password has been updated!",
    user,
  });
};
