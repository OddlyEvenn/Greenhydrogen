// const hre = require("hardhat");

// async function main() {
//   const [deployer, certifier] = await hre.ethers.getSigners();

//   console.log("Deployer:", deployer.address);
//   console.log("Certifier:", certifier.address);

//   const Token = await hre.ethers.getContractFactory("GreenCreditToken");
//   const token = await Token.deploy(deployer.address, certifier.address);
//   await token.waitForDeployment();

//   const addr = await token.getAddress();
//   console.log("GreenCreditToken deployed to:", addr);

//   // Optional: mint some demo credits to producer (here certifier mints to deployer)
//   const issueTx = await token.connect(certifier).issueCredits(deployer.address, hre.ethers.parseUnits("10", 18));
//   await issueTx.wait();
//   console.log("Issued 10 credits to deployer");
// }

// main().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });


const { ethers } = require("hardhat");

async function main() {
  const CreditSystem = await ethers.getContractFactory("CreditSystem");
  const creditSystem = await CreditSystem.deploy();
  await creditSystem.waitForDeployment();

  console.log("CreditSystem deployed to:", await creditSystem.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});