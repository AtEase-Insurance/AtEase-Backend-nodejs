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
