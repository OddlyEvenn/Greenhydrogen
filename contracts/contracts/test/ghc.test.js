const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GreenHydrogenCredits", function () {
  it("deploys and mints a batch", async function () {
    const [owner, producer, certifier] = await ethers.getSigners();
    const GHC = await ethers.getContractFactory("GreenHydrogenCredits");
    const ghc = await GHC.deploy("https://example.com/ghc/{id}.json", owner.address);
    await ghc.deployed();

    // give certifier CERTIFIER_ROLE
    const CERTIFIER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CERTIFIER_ROLE"));
    await ghc.connect(owner).grantRole(CERTIFIER_ROLE, owner.address);

    const batchId = ethers.BigNumber.from(1);
    await ghc.connect(owner).unpause();
    await ghc.connect(owner).issueBatch(producer.address, batchId, 100, "ipfs://Qm...");
    const balance = await ghc.balanceOf(producer.address, batchId);
    expect(balance.toNumber()).to.equal(100);
  });
});
