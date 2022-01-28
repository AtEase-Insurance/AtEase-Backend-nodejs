const mongoose = require("mongoose");
const { Schema } = mongoose;

const enquirySchema = new Schema({
  name: {
    type: String,
    max: 255,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    max: 255,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    max: 255,
    trim: true,
  },
  phoneNo: {
    type: String,
    required: true,
    max: 50,
    trim: true,
  },
  message: {
    type: String,
    max: 5000,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
