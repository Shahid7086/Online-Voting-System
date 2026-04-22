const Candidate = require("../models/Candidate");
const VotingConfig = require("../models/VotingConfig");

const ensureVotingConfig = async () => {
  let config = await VotingConfig.findOne();
  if (!config) {
    config = await VotingConfig.create({ isVotingOpen: false });
  }
  return config;
};

const addCandidate = async (req, res) => {
  try {
    const { name, party, manifesto } = req.body;
    const candidate = await Candidate.create({ name, party, manifesto });
    return res.status(201).json({ message: "Candidate added", candidate });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add candidate" });
  }
};

const getAllCandidates = async (_req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return res.json({ candidates });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch candidates" });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const config = await ensureVotingConfig();
    if (config.isVotingOpen) {
      return res.status(400).json({ message: "Cannot delete candidates while voting is open" });
    }
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    return res.json({ message: "Candidate deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete candidate" });
  }
};

const getTotalVotes = async (_req, res) => {
  try {
    const result = await Candidate.aggregate([
      { $group: { _id: null, totalVotes: { $sum: "$votes" } } },
    ]);
    const totalVotes = result[0]?.totalVotes || 0;
    return res.json({ totalVotes });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch total votes" });
  }
};

const getLeader = async (_req, res) => {
  try {
    const top = await Candidate.find().sort({ votes: -1, createdAt: 1 }).limit(2);
    if (!top.length) {
      return res.json({ leader: null, tie: false });
    }

    const tie = top.length > 1 && top[0].votes === top[1].votes;
    if (tie) {
      return res.json({ leader: null, tie: true, message: "Tie between top candidates" });
    }

    return res.json({
      leader: {
        name: top[0].name,
        party: top[0].party,
        votes: top[0].votes,
      },
      tie: false,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch leader" });
  }
};

const setVotingStatus = async (req, res) => {
  try {
    const { isVotingOpen } = req.body;
    const config = await ensureVotingConfig();
    config.isVotingOpen = Boolean(isVotingOpen);
    await config.save();
    return res.json({
      message: `Voting is now ${config.isVotingOpen ? "Open" : "Closed"}`,
      isVotingOpen: config.isVotingOpen,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update voting status" });
  }
};

const getVotingStatus = async (_req, res) => {
  try {
    const config = await ensureVotingConfig();
    return res.json({ isVotingOpen: config.isVotingOpen });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch voting status" });
  }
};

const getResults = async (_req, res) => {
  try {
    const config = await ensureVotingConfig();
    const candidates = await Candidate.find().sort({ votes: -1, createdAt: 1 });
    const winner =
      !config.isVotingOpen && candidates.length
        ? candidates.filter((c) => c.votes === candidates[0].votes)
        : null;

    return res.json({
      isVotingOpen: config.isVotingOpen,
      candidates,
      winner:
        !config.isVotingOpen && winner
          ? winner.length > 1
            ? { tie: true, candidates: winner }
            : { tie: false, candidate: winner[0] }
          : null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch results" });
  }
};

module.exports = {
  addCandidate,
  getAllCandidates,
  deleteCandidate,
  getTotalVotes,
  getLeader,
  setVotingStatus,
  getVotingStatus,
  getResults,
};
