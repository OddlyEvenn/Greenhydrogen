const mongoose = require("mongoose");

const creditTransactionSchema = new mongoose.Schema({
  from: { type: String },    // wallet address or null for mint
  to: { type: String },      // recipient wallet address
  amount: { type: Number, required: true },
  txHash: { type: String },
  type: { type: String, enum: ["mint","transfer","retire"], default: "transfer" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CreditTransaction", creditTransactionSchema);