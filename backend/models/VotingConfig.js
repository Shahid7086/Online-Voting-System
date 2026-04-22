const mongoose = require("mongoose");

const votingConfigSchema = new mongoose.Schema(
  {
    isVotingOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VotingConfig", votingConfigSchema);
