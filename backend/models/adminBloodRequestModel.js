const mongoose = require("mongoose");

/** Admin-initiated blood requests to a donor or organisation */
const adminBloodRequestSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
    },
    quantity: { type: Number, required: true },
    urgency: {
      type: String,
      enum: ["normal", "urgent"],
      default: "normal",
    },
    message: { type: String, default: "" },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    organisation: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("adminBloodRequests", adminBloodRequestSchema);
