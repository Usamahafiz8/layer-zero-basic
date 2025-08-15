const { ethers } = require("hardhat");

async function main() {
  const endpointSepolia = "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab"; // LayerZero Sepolia endpoint
  const UserState = await ethers.getContractFactory("UserState");
  const contract = await UserState.deploy(endpointSepolia);
  await contract.deployed();
  console.log("UserState deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
