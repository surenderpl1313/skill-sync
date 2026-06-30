const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    ownerMessage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate requests
joinRequestSchema.index(
  { applicant: 1, project: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "JoinRequest",
  joinRequestSchema
);