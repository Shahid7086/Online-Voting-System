const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const VotingConfig = require("./models/VotingConfig");

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/voter", require("./routes/voterRoutes"));

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  const config = await VotingConfig.findOne();
  if (!config) {
    await VotingConfig.create({ isVotingOpen: false });
  }
  console.log(`Server running on port ${PORT}`);
});
