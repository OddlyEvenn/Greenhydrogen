const express = require("express");
const router = express.Router();
const { mintCredits, logTransfer, getTransactions, getBalance } = require("../controllers/creditController");

// mint - certifier calls from backend
router.post("/mint", mintCredits);

// frontend logs a transfer it already did on-chain
router.post("/log-transfer", logTransfer);

router.get("/transactions", getTransactions);
router.get("/balance/:wallet", getBalance);

module.exports = router;