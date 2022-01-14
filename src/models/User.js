const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {
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
  email: {
    type: String,
    lowercase: true,
    // match:
    //   /[a-z0–9!#$%&’*+/=?^_`{|}~-]+(?:\.[a-z0–9!#$%&’*+/=?^_`{|}~-]+)*@(?:[a-z0–9](?:[a-z0–9-]*[a-z0–9])?\.)+[a-z0–9](?:[a-z0–  9-]*[a-z0–9])?/,
    required: true,
    max: 255,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  phoneNo: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  dateSignedUp: {
    type: Date,
    default: Date.now(),
  },
  verified: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
