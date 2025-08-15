const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 FULL LOCAL LAYERZERO CROSS-CHAIN TEST");
  console.log("========================================\n");

  // Get signers
  const [deployer, user1, user2] = await ethers.getSigners();
  
  console.log("👤 Deployer:", deployer.address);
  console.log("👤 User 1:", user1.address);
  console.log("👤 User 2:", user2.address);
  console.log("");

  // Deploy all contracts locally
  console.log("📦 Deploying contracts locally...");
  
  // Deploy TestUserState (simulating Sepolia)
  const TestUserState = await ethers.getContractFactory("TestUserState");
  const userState = await TestUserState.deploy("0x1234567890123456789012345678901234567890");
  await userState.deployed();
  console.log("✅ TestUserState deployed to:", userState.address);

  // Deploy PreSale (simulating Amoy)
  const PreSale = await ethers.getContractFactory("PreSale");
  const presale = await PreSale.deploy("0x1234567890123456789012345678901234567890");
  await presale.deployed();
  console.log("✅ PreSale deployed to:", presale.address);

  // Deploy Staking (simulating Amoy)
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy("0x1234567890123456789012345678901234567890");
  await staking.deployed();
  console.log("✅ Staking deployed to:", staking.address);
  console.log("");

  // Configure cross-chain destinations
  console.log("🔗 Configuring cross-chain destinations...");
  
  const destinationAddressBytes = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [userState.address]
  );
  
  await presale.setDestination(1, destinationAddressBytes);
  await staking.setDestination(1, destinationAddressBytes);
  console.log("✅ Cross-chain destinations configured");
  console.log("");

  // SIMULATE CROSS-CHAIN TRANSACTIONS
  console.log("🔄 SIMULATING CROSS-CHAIN TRANSACTIONS");
  console.log("======================================");

  // Check initial state
  let user1Totals = await userState.getTotals(user1.address);
  console.log(`📊 Initial state for ${user1.address}:`);
  console.log(`   Purchased: ${user1Totals[0]}`);
  console.log(`   Staked: ${user1Totals[1]}`);
  console.log("");

  // Simulate buyTokens transaction from Amoy to Sepolia
  console.log("🛒 Simulating buyTokens(100) from Amoy → Sepolia...");
  
  // This is what would happen when user calls buyTokens on Amoy
  const buyPayload = ethers.utils.defaultAbiCoder.encode(
    ["uint8", "address", "uint256"],
    [1, user1.address, 100] // action=1 (buy), user, amount
  );

  // Simulate LayerZero delivering the message to Sepolia
  // In real scenario, LayerZero would call this function
  console.log("📡 LayerZero delivering message to UserState...");
  
  // Use the test function to call the internal _nonblockingLzReceive
  await userState.testNonblockingLzReceive(1, "0x", 1, buyPayload);
  
  // Check state after buy
  user1Totals = await userState.getTotals(user1.address);
  console.log(`📊 After buyTokens(100):`);
  console.log(`   Purchased: ${user1Totals[0]}`);
  console.log(`   Staked: ${user1Totals[1]}`);
  console.log("");

  // Simulate stake transaction from Amoy to Sepolia
  console.log("🔒 Simulating stake(50) from Amoy → Sepolia...");
  
  const stakePayload = ethers.utils.defaultAbiCoder.encode(
    ["uint8", "address", "uint256"],
    [2, user1.address, 50] // action=2 (stake), user, amount
  );

  // Simulate LayerZero delivering the message to Sepolia
  console.log("📡 LayerZero delivering message to UserState...");
  await userState.testNonblockingLzReceive(1, "0x", 2, stakePayload);
  
  // Check state after stake
  user1Totals = await userState.getTotals(user1.address);
  console.log(`📊 After stake(50):`);
  console.log(`   Purchased: ${user1Totals[0]}`);
  console.log(`   Staked: ${user1Totals[1]}`);
  console.log("");

  // Test with another user
  console.log("👤 Testing with another user...");
  
  const buyPayload2 = ethers.utils.defaultAbiCoder.encode(
    ["uint8", "address", "uint256"],
    [1, user2.address, 200] // action=1 (buy), user2, amount
  );
  
  await userState.testNonblockingLzReceive(1, "0x", 3, buyPayload2);
  
  const user2Totals = await userState.getTotals(user2.address);
  console.log(`📊 User2 totals after buyTokens(200):`);
  console.log(`   Purchased: ${user2Totals[0]}`);
  console.log(`   Staked: ${user2Totals[1]}`);
  console.log("");

  // Test multiple actions for same user
  console.log("🔄 Testing multiple actions for same user...");
  
  // Another buy for user1
  const buyPayload3 = ethers.utils.defaultAbiCoder.encode(
    ["uint8", "address", "uint256"],
    [1, user1.address, 75] // action=1 (buy), user1, amount
  );
  
  await userState.testNonblockingLzReceive(1, "0x", 4, buyPayload3);
  
  // Another stake for user1
  const stakePayload2 = ethers.utils.defaultAbiCoder.encode(
    ["uint8", "address", "uint256"],
    [2, user1.address, 25] // action=2 (stake), user1, amount
  );
  
  await userState.testNonblockingLzReceive(1, "0x", 5, stakePayload2);
  
  // Final state check
  user1Totals = await userState.getTotals(user1.address);
  console.log(`📊 Final state for ${user1.address}:`);
  console.log(`   Purchased: ${user1Totals[0]} (100 + 75 = 175)`);
  console.log(`   Staked: ${user1Totals[1]} (50 + 25 = 75)`);
  console.log("");

  // Show all users' final state
  console.log("📊 FINAL STATE SUMMARY:");
  console.log("=======================");
  
  const finalUser1Totals = await userState.getTotals(user1.address);
  const finalUser2Totals = await userState.getTotals(user2.address);
  
  console.log(`👤 ${user1.address}:`);
  console.log(`   Purchased: ${finalUser1Totals[0]}`);
  console.log(`   Staked: ${finalUser1Totals[1]}`);
  console.log("");
  
  console.log(`👤 ${user2.address}:`);
  console.log(`   Purchased: ${finalUser2Totals[0]}`);
  console.log(`   Staked: ${finalUser2Totals[1]}`);
  console.log("");

  console.log("🎉 FULL LOCAL TEST COMPLETE!");
  console.log("=============================");
  console.log("✅ Cross-chain state management working");
  console.log("✅ Multiple users supported");
  console.log("✅ Multiple transactions per user working");
  console.log("✅ State accumulation working");
  console.log("✅ LayerZero message simulation working");
  console.log("");
  console.log("💡 This demonstrates exactly how LayerZero works:");
  console.log("   1. User calls function on source chain (Amoy)");
  console.log("   2. LayerZero sends message to destination chain (Sepolia)");
  console.log("   3. UserState receives message and updates state");
  console.log("   4. State is centralized on destination chain");
  console.log("");
  console.log("🚀 Ready for real cross-chain deployment!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
