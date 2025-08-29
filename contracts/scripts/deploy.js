const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const baseURI = "https://example.com/ghc/{id}.json";
  const admin = deployer.address;

  const GHC = await hre.ethers.getContractFactory("GreenHydrogenCredits");
  const ghc = await GHC.deploy(baseURI, admin);
  await ghc.deployed();

  console.log("GHC deployed at:", ghc.address);
}

main().catch((e) => { console.error(e); process.exit(1); });
