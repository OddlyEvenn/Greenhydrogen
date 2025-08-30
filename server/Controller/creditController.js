const CreditTx = require("../models/CreditTransaction");
const blockchain = require("../services/blockchainService");

/**
 * POST /api/credits/mint
 * Body: { to, amount }
 * Only backend certifier calls this to mint/add credits to `to`.
 */
async function mintCredits(req, res) {
  try {
    const { to, amount } = req.body;
    if (!to || !amount) return res.status(400).json({ error: "to & amount required" });

    // call contract.addCredits(to, amount)
    const result = await blockchain.addCredits(to, amount);
    // Save tx log
    const txDoc = new CreditTx({ from: null, to: to.toLowerCase(), amount, txHash: result.txHash, type: "mint" });
    await txDoc.save();

    return res.json({ success: true, txHash: result.txHash });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "mint failed", details: err.message });
  }
}

/**
 * POST /api/credits/log-transfer
 * Called by frontend to log an on-chain transfer they executed from wallet
 * Body: { from, to, amount, txHash }
 */
async function logTransfer(req, res) {
  try {
    const { from, to, amount, txHash } = req.body;
    if (!from || !to || !amount || !txHash) return res.status(400).json({ error: "missing fields" });

    const tx = new CreditTx({ from: from.toLowerCase(), to: to.toLowerCase(), amount, txHash, type: "transfer" });
    await tx.save();
    return res.json({ success: true, tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}

/**
 * GET /api/credits/transactions
 */
async function getTransactions(req, res) {
  try {
    const list = await CreditTx.find().sort({ createdAt: -1 }).limit(200);
    return res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}

/**
 * GET /api/credits/balance/:wallet
 * returns on-chain balance for given wallet
 */
async function getBalance(req, res) {
  try {
    const wallet = req.params.wallet;
    const bal = await blockchain.getCredits(wallet);
    return res.json({ wallet: wallet.toLowerCase(), balance: bal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}

module.exports = { mintCredits, logTransfer, getTransactions, getBalance };