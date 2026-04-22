const mongoose = require("mongoose");
const Candidate = require("../models/Candidate");
const User = require("../models/User");
const VotingConfig = require("../models/VotingConfig");

const getCandidates = async (_req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return res.json({ candidates });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch candidates" });
  }
};

const castVote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user._id;

    const config = await VotingConfig.findOne();
    if (!config || !config.isVotingOpen) {
      return res.status(400).json({ message: "Voting is currently closed" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.hasVoted) {
      return res.status(400).json({ message: "You already voted" });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(400).json({ message: "Candidate not found" });
    }

    // Save vote
    candidate.votes += 1;
    user.hasVoted = true;
    user.votedFor = candidate._id;

    await candidate.save();
    await user.save();

    return res.json({ message: "Vote cast successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Vote failed" });
  }
};

const getVoterStatus = async (req, res) => {
  try {
    const config = await VotingConfig.findOne();
    const user = await User.findById(req.user._id).select("hasVoted votedFor");
    return res.json({
      isVotingOpen: config?.isVotingOpen || false,
      hasVoted: user?.hasVoted || false,
      votedFor: user?.votedFor || null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch voter status" });
  }
};

module.exports = { getCandidates, castVote, getVoterStatus };
