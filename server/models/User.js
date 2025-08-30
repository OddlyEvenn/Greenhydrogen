const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
  role: { type: String, enum: ["producer","buyer","certifier","auditor"], default: "producer" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);