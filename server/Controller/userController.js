const User = require("../models/User");
const blockchain = require("../services/blockchainService");

/**
 * POST /api/users/register
 * Body: { name, walletAddress, role? }
 * This stores user in DB. The frontend should call contract.registerUser() from user's wallet as well.
 */
async function registerUser(req, res) {
  try {
    const { name, walletAddress, role } = req.body;
    if (!name || !walletAddress) return res.status(400).json({ error: "name & walletAddress required" });

    const existing = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existing) return res.status(400).json({ error: "User already registered in DB" });

    const user = new User({ name, walletAddress: walletAddress.toLowerCase(), role });
    await user.save();

    // check on-chain registration status (read-only)
    const onchain = await blockchain.isRegistered(walletAddress);
    return res.json({ user, onchain });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
}

/**
 * GET /api/users/:wallet
 * Returns DB user + on-chain registration & balance
 */
async function getUser(req, res) {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const user = await User.findOne({ walletAddress: wallet });
    if (!user) return res.status(404).json({ error: "User not found" });

    const onchain = await blockchain.isRegistered(wallet);
    const balance = await blockchain.getCredits(wallet);
    return res.json({ user, onchain, balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}

module.exports = { registerUser, getUser };