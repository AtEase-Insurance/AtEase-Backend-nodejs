const User = require("../models/user");
const bcrypt = require("bcryptjs");
const userValidation = require("../validations/user");
const cloudinary = require("../services/cloudinary");

// getProfile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: "SUCCESS",
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
};

// editProfile
exports.editProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);

    // Limit user profile info changes via this route to only the following
    const { phoneNo } = req.body;

    // User can update or leave out any of these fields
    if (phoneNo) user.phoneNo = phoneNo;

    await user.save();
    res.status(200).json({
      status: "SUCCESS",
      message: "Your profile has been updated",
      user: user,
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

// uploadAvatar
exports.uploadAvatar = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);

    // Check that profile picture is attached
    if (req.file == undefined)
      return res
        .status(404)
        .json({ status: "FAILED", message: "Please attach picture!" });

    // Upload profile picture to Cloudinary
    const result = async (path) => await cloudinary.uploads(path, "avatar");
    let url = "";

    if (req.method === "POST") {
      const file = req.file;

      const { path } = file;
      const newPath = await result(path);
      url = newPath.url;
    }

    user.avatar = url;

    await user.save();
    res.status(200).json({
      status: "SUCCESS",
      message: "Your profile photo has been updated",
      user: user,
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

// changePassword
exports.changePassword = async (req, res) => {
  // validate request body
  const { error } = userValidation.passwordChange(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "FAILED", message: error.details[0].message });

  // Check if user's old password is correct
  let user = await User.findById(req.user.id);
  const validPassword = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );
  if (!validPassword)
    return res.status(400).json({
      status: "FAILED",
      message: "Invalid Old Password.",
    });

  // Hash new password and replace
  const password = await bcrypt.hash(req.body.newPassword, 12);
  user.password = password;
  await user.save();

  res.status(200).json({
    status: "SUCCESS",
    message: "Your password has been updated!",
    user,
  });
};
