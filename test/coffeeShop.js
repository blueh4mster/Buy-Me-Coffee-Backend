const { expect } = require("chai");

const hre = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("coffeeShop", function () {
  async function deployInstance() {
    const coffeeShop = await hre.ethers.getContractFactory("coffeeShop");
    const coffeeShopInstance = await coffeeShop.deploy();
    const [owner, otherAcc] = await hre.ethers.getSigners();
    const val = 20;
    await coffeeShopInstance.connect(otherAcc).buyCoffee({ value: val });

    return { coffeeShopInstance };
  }
  it("is possible to buy coffee", async () => {
    const { coffeeShopInstance } = await loadFixture(deployInstance);
    const [owner, otherAcc] = await hre.ethers.getSigners();

    const balAfter = await coffeeShopInstance.connect(owner).getBalance();
    const amount = await coffeeShopInstance
      .connect(owner)
      .getOrderAmount(otherAcc.address);

    expect(balAfter).to.equal(20);
    expect(amount).to.equal(2);
  });

  it("should emit an event when coffee is delivered", async () => {
    const { coffeeShopInstance } = await loadFixture(deployInstance);
    const [owner, otherAcc] = await hre.ethers.getSigners();

    await expect(
      coffeeShopInstance.connect(owner).deliverCoffee(otherAcc.address)
    )
      .to.emit(coffeeShopInstance, "boughtCoffee")
      .withArgs(otherAcc.address, 2, false);
  });

  it("should fail when any other address tries to withdraw contract balance", async () => {
    const { coffeeShopInstance } = await loadFixture(deployInstance);
    const [owner, otherAcc] = await hre.ethers.getSigners();

    await expect(
      coffeeShopInstance.connect(otherAcc).withdrawTips()
    ).to.be.revertedWith("you are not allowed this action!");
  });
});
