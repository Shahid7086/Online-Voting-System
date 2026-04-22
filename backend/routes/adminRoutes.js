const express = require("express");
const { body } = require("express-validator");
const {
  addCandidate,
  getAllCandidates,
  deleteCandidate,
  getTotalVotes,
  getLeader,
  setVotingStatus,
  getVotingStatus,
  getResults,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();
const adminOnly = [protect, authorizeRoles("admin")];

router.post(
  "/candidates",
  [
    ...adminOnly,
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("party").trim().notEmpty().withMessage("Party is required"),
    body("manifesto").trim().isLength({ min: 10 }).withMessage("Manifesto must be at least 10 characters"),
    validateRequest,
  ],
  addCandidate
);
router.get("/candidates", ...adminOnly, getAllCandidates);
router.delete("/candidates/:id", ...adminOnly, deleteCandidate);
router.get("/total-votes", ...adminOnly, getTotalVotes);
router.get("/leader", ...adminOnly, getLeader);
router.put(
  "/voting-status",
  [
    ...adminOnly,
    body("isVotingOpen").isBoolean().withMessage("isVotingOpen must be boolean"),
    validateRequest,
  ],
  setVotingStatus
);
router.get("/voting-status", ...adminOnly, getVotingStatus);
router.get("/results", ...adminOnly, getResults);

module.exports = router;
