const { ethers } = require("hardhat");

async function main() {
  const endpointAmoy = "0xf69186dfba60ddb133e91e9a4b5673624293df17"; // Polygon Amoy endpoint
  const Staking = await ethers.getContractFactory("Staking");
  const contract = await Staking.deploy(endpointAmoy);
  await contract.deployed();
  console.log("✅ Staking deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
