const hre = require("hardhat");

async function main() {
  const tokenAddr = process.argv[2]; // pass contract address as arg
  if (!tokenAddr) throw new Error("Usage: node scripts/demo-mint.js <tokenAddress> <to> <amount>");
  const to = process.argv[3];
  const amountStr = process.argv[4] || "5";

  const [admin, certifier] = await hre.ethers.getSigners();
  const Token = await hre.ethers.getContractFactory("GreenCreditToken");
  const token = Token.attach(tokenAddr);

  const amount = hre.ethers.parseUnits(amountStr, 18);
  const tx = await token.connect(certifier).issueCredits(to, amount);
  await tx.wait();
  console.log(`Minted ${amountStr} credits to ${to}`);
}

main().catch((e) => { console.error(e); process.exit(1); });