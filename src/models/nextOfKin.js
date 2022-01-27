const mongoose = require("mongoose");
const { Schema } = mongoose;

const nextOfKinSchema = new Schema({
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
    required: true,
    max: 255,
    trim: true,
  },
  homeAddress: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
    trim: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
  meansOfId: {
    type: String,
    default: true,
  },
  imgForId: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("NextOfKin", nextOfKinSchema);
