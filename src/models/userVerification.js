const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userVerificationSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  uniqueString: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("UserVerification", userVerificationSchema);
