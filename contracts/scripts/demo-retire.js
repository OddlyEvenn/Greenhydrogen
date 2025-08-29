const hre = require("hardhat");

async function main() {
  const tokenAddr = process.argv[2];
  const amountStr = process.argv[3] || "1";

  if (!tokenAddr) throw new Error("Usage: node scripts/demo-retire.js <tokenAddress> <amount>");

  const [holder] = await hre.ethers.getSigners();
  const Token = await hre.ethers.getContractFactory("GreenCreditToken");
  const token = Token.attach(tokenAddr);

  const amount = hre.ethers.parseUnits(amountStr, 18);
  const tx = await token.connect(holder).retire(amount);
  await tx.wait();
  console.log(`Retired ${amountStr} credits from ${holder.address}`);
}

main().catch((e) => { console.error(e); process.exit(1); });