const { ethers } = require("hardhat");

async function main() {
  const presaleContract = await ethers.getContractFactory("Presale");
  const deployContract = await presaleContract.deploy(20);
  await deployContract.deployed();
  console.log("Presale Contract Address:", deployContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
