const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });


async function main() {

  const nftContract = await ethers.getContractFactory("NFT");

  // deploy the contract
  const deployNFTContract = await nftContract.deploy();

  console.log("NFT Contract Address:", deployNFTContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// NFT Contract Address: 0xc8D111186510928a9Cf660b50dD1846e73E05456
