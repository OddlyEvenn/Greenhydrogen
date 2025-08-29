const hre = require("hardhat");

async function main() {
  const tokenAddr = process.argv[2];
  const to = process.argv[3];
  const amountStr = process.argv[4] || "2";

  if (!tokenAddr || !to) throw new Error("Usage: node scripts/demo-transfer.js <tokenAddress> <to> <amount>");

  const [sender] = await hre.ethers.getSigners();
  const Token = await hre.ethers.getContractFactory("GreenCreditToken");
  const token = Token.attach(tokenAddr);

  const amount = hre.ethers.parseUnits(amountStr, 18);
  const tx = await token.connect(sender).transfer(to, amount);
  await tx.wait();
  console.log(`Transferred ${amountStr} credits to ${to}`);
}

main().catch((e) => { console.error(e); process.exit(1); });