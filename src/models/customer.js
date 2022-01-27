const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: 10,
    trim: true,
  },
  firstname: {
    type: String,
    required: true,
    max: 255,
    trim: true,
  },
  middlename: {
    type: String,
    max: 255,
    trim: true,
    default: "",
  },
  surname: {
    type: String,
    required: true,
    max: 255,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    max: 255,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    max: 255,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    max: 255,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    max: 255,
    trim: true,
  },
  phoneNo: {
    type: String,
    max: 255,
    required: true,
  },
  meansOfId: {
    max: 255,
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


module.exports = mongoose.model("Customer", customerSchema);


