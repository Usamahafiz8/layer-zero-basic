const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 DEPLOYING TO TESTNETS");
  console.log("========================\n");

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("");

  // LayerZero endpoints
  const sepoliaEndpoint = "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab";
  const amoyEndpoint = "0xf69186dfba60ddb133e91e9a4b5673624293df17";

  console.log("📦 Deploying contracts...");
  console.log("");

  // Deploy UserState to Sepolia
  console.log("🌐 Deploying UserState to Sepolia...");
  const UserState = await ethers.getContractFactory("UserState");
  const userState = await UserState.deploy(sepoliaEndpoint);
  await userState.deployed();
  console.log("✅ UserState deployed to:", userState.address);
  console.log("");

  // Deploy PreSale to Amoy
  console.log("🌐 Deploying PreSale to Amoy...");
  const PreSale = await ethers.getContractFactory("PreSale");
  const presale = await PreSale.deploy(amoyEndpoint);
  await presale.deployed();
  console.log("✅ PreSale deployed to:", presale.address);
  console.log("");

  // Deploy Staking to Amoy
  console.log("🌐 Deploying Staking to Amoy...");
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(amoyEndpoint);
  await staking.deployed();
  console.log("✅ Staking deployed to:", staking.address);
  console.log("");

  // Configure cross-chain destinations
  console.log("🔗 Configuring cross-chain destinations...");
  
  const destinationAddressBytes = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [userState.address]
  );

  // Set PreSale destination
  await presale.setDestination(10161, destinationAddressBytes); // Sepolia chain ID
  console.log("✅ PreSale destination set to UserState on Sepolia");

  // Set Staking destination
  await staking.setDestination(10161, destinationAddressBytes); // Sepolia chain ID
  console.log("✅ Staking destination set to UserState on Sepolia");
  console.log("");

  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=======================");
  console.log("📋 Contract Addresses:");
  console.log(`   UserState (Sepolia): ${userState.address}`);
  console.log(`   PreSale (Amoy): ${presale.address}`);
  console.log(`   Staking (Amoy): ${staking.address}`);
  console.log("");
  console.log("🔗 Cross-chain configuration:");
  console.log("   PreSale → UserState (Amoy → Sepolia)");
  console.log("   Staking → UserState (Amoy → Sepolia)");
  console.log("");
  console.log("🚀 Ready for cross-chain testing!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
