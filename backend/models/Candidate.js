const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    party: { type: String, required: true, trim: true, maxlength: 80 },
    manifesto: { type: String, required: true, trim: true, maxlength: 1000 },
    votes: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
