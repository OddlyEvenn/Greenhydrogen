// backend/src/services/blockchainService.js
const { ethers } = require("ethers");
const path = require("path");
require("dotenv").config();

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.warn("Warning: PRIVATE_KEY or CONTRACT_ADDRESS missing in .env");
}

// Adjust ABI path to where Hardhat artifacts are generated in your repo.
// Example: ../blockchain/artifacts/contracts/CreditSystem.sol/CreditSystem.json
const artifactPath = path.resolve(__dirname, "../../../blockchain/artifacts/contracts/CreditSystem.sol/CreditSystem.json");
const artifact = require(artifactPath);

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY ?? "0x" + "0".repeat(64), provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, wallet);

/**
 * read-only: check if address is registered (reads public users mapping)
 */
async function isRegistered(address) {
  const userInfo = await contract.users(address);
  // userInfo likely returns (credits, registered)
  // ethers v6 returns bigint for credits; convert as needed
  return {
    registered: userInfo[1],
    credits: Number(userInfo[0].toString())
  };
}

/**
 * read-only: get credits balance using getCredits()
 */
async function getCredits(address) {
  const bal = await contract.getCredits(address);
  return Number(bal.toString());
}

/**
 * certifier/admin mints/adds credits to a user's on-chain record
 * (this calls contract.addCredits(user, amount))
 * amount should be integer number of credits (use same unit as contract)
 */
async function addCredits(toAddress, amount) {
  if (!PRIVATE_KEY) throw new Error("No PRIVATE_KEY configured");
  const tx = await contract.addCredits(toAddress, amount);
  const receipt = await tx.wait();
  return { txHash: receipt.transactionHash, receipt };
}

/**
 * attach event listeners (optional): CreditsAdded and CreditsTransferred events
 * Provide callbacks to handle events and log to DB if you want.
 */
function listenToEvents(onCreditsAdded, onCreditsTransferred) {
  // event CreditsAdded(address user, uint256 amount);
  contract.on("CreditsAdded", (user, amount, event) => {
    const payload = { user, amount: Number(amount.toString()), txHash: event.transactionHash };
    try { onCreditsAdded && onCreditsAdded(payload); } catch (e) { console.error(e); }
  });
  // event CreditsTransferred(address from, address to, uint256 amount);
  contract.on("CreditsTransferred", (from, to, amount, event) => {
    const payload = { from, to, amount: Number(amount.toString()), txHash: event.transactionHash };
    try { onCreditsTransferred && onCreditsTransferred(payload); } catch (e) { console.error(e); }
  });
}

module.exports = {
  isRegistered,
  getCredits,
  addCredits,
  listenToEvents,
  contract, provider, wallet
};