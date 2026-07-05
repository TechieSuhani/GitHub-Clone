const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    workflow: {
      type: String,
      default: "CI/CD Pipeline",
    },

    status: {
      type: String,
      enum: ["Queued", "Running", "Success", "Failed"],
      default: "Queued",
    },

    progress: {
      type: Number,
      default: 0,
    },

    duration: {
      type: String,
      default: "--",
    },

    logs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Action", ActionSchema);