const mongoose = require("mongoose");
const { Schema } = mongoose;

const policyPlanSchema = new Schema({
  category: {
    type: String,
    required: true,
    max: 60,
  },
  amount: {
    type: String,
    required: true,
    max: 50,
    trim: true,
  },
  duration: {
    type: String,
    lowercase: true,
    required: true,
    max: 255,
    trim: true,
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

module.exports = mongoose.model("PolicyPlan", policyPlanSchema);
