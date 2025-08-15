const { ethers } = require("hardhat");

async function main() {
  // Updated LayerZero endpoint for Amoy
  const endpointAmoy = "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab"; // Sepolia endpoint works for Amoy too
  const PreSale = await ethers.getContractFactory("PreSale");
  
  // Use minimum required gas price
  const gasPrice = ethers.utils.parseUnits("25", "gwei"); // Minimum required
  
  const contract = await PreSale.deploy(endpointAmoy, {
    gasPrice: gasPrice,
    gasLimit: 1000000 // Much reduced gas limit
  });
  
  await contract.deployed();
  console.log("✅ PreSale deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
