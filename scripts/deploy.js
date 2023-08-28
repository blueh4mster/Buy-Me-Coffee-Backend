const { ethers } = require("hardhat");
(async () => {
  try {
    const coffeeShop = await ethers.getContractFactory("coffeeShop");

    const coffeeShopInstance = await coffeeShop.deploy();

    await coffeeShopInstance.deployed();

    console.log(`deployed at ${coffeeShopInstance.address}`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
