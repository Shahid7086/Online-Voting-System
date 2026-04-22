const express = require("express");
const { body } = require("express-validator");
const { getCandidates, castVote, getVoterStatus } = require("../controllers/voterController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();
const voterOnly = [protect, authorizeRoles("voter")];

router.get("/candidates", ...voterOnly, getCandidates);
router.get("/status", ...voterOnly, getVoterStatus);
router.post(
  "/vote",
  [
    ...voterOnly,
    body("candidateId").isMongoId().withMessage("Valid candidateId is required"),
    validateRequest,
  ],
  castVote
);

module.exports = router;
