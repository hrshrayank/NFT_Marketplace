const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const {
  PRESALE_CONTRACT_ADDRESS,
  BASE_URL,
  HIDDEN_URL,
} = require("../constants");

async function main() {
  const whitelistContract = PRESALE_CONTRACT_ADDRESS;
  const baseurl = BASE_URL;
  const hiddenurl = HIDDEN_URL;

  const nftContract = await ethers.getContractFactory("NFT");

  // deploy the contract
  const deployNFTContract = await nftContract.deploy(whitelistContract);

  console.log("NFT Contract Address:", deployNFTContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// NFT Contract Address: 0x56663e5b86554DA70aA0Cba5c53092DCd780c8B8
