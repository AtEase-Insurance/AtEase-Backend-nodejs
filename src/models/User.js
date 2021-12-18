const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: 10,
    trim: true,
  },
  firstname: {
    type: String,
    required: true,
    max: 50,
    trim: true,
  },
  middlename: {
    type: String,
    required: true,
    max: 50,
    trim: true,
  },
  surname: {
    type: String,
    required: true,
    max: 50,
    trim: true,
  },
  BVN: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    trim: true,
  },
  phoneNo: {
    type: String,
    required: true,
    max: 20,
    trim: true,
  },
  altPhoneNo: {
    type: String,
    required: true,
    max: 20,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
