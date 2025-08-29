const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GreenCreditToken", function () {
  it("mints by certifier and retires by holder", async function () {
    const [admin, certifier, producer, buyer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("GreenCreditToken");
    const token = await Token.deploy(admin.address, certifier.address);
    const addr = await token.getAddress();

    // certifier mints to producer
    await expect(token.connect(certifier).issueCredits(producer.address, ethers.parseUnits("10", 18)))
      .to.emit(token, "CreditsIssued");

    expect(await token.balanceOf(producer.address)).to.equal(ethers.parseUnits("10", 18));

    // producer transfers to buyer
    await token.connect(producer).transfer(buyer.address, ethers.parseUnits("3", 18));
    expect(await token.balanceOf(buyer.address)).to.equal(ethers.parseUnits("3", 18));

    // buyer retires 2 credits
    await expect(token.connect(buyer).retire(ethers.parseUnits("2", 18)))
      .to.emit(token, "CreditsRetired");

    expect(await token.balanceOf(buyer.address)).to.equal(ethers.parseUnits("1", 18));

    // admin can pause; transfers should fail
    await token.connect(admin).pause();
    await expect(token.connect(producer).transfer(buyer.address, ethers.parseUnits("1", 18)))
      .to.be.revertedWith("token paused");
    await token.connect(admin).unpause();
    await token.connect(producer).transfer(buyer.address, ethers.parseUnits("1", 18));
    expect(await token.balanceOf(buyer.address)).to.equal(ethers.parseUnits("2", 18));
  });
});