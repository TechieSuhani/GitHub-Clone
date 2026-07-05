const mongoose = require("mongoose");
const { Schema } = mongoose;

const PullRequestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "closed", "merged"],
      default: "open",
    },

    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PullRequest",
  PullRequestSchema
);