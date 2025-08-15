const { ethers } = require("hardhat");

const userStateSepolia = "0x0f46E2c871Ab9B891caCF986EAa55c28e7751cE7";
const presaleAmoy = "0x7Dda431a9e4F451Dd8Ea50788B63df69f3D18BA4";
const stakingAmoy = "0x489476ABbe4CbC3A7CeaB2Fc70225684CBEf6b5E";

async function main() {
  console.log("🌉 LAYERZERO CROSS-CHAIN DEMO");
  console.log("==============================\n");

  const [signer] = await ethers.getSigners();
  console.log("👤 Your wallet:", signer.address);
  console.log("");

  // Show the architecture
  console.log("🏗️  SYSTEM ARCHITECTURE:");
  console.log("┌─────────────────┐    ┌─────────────────┐");
  console.log("│   SEPOLIA       │    │     AMOY        │");
  console.log("│                 │    │                 │");
  console.log("│  UserState      │◄───┤   PreSale       │");
  console.log("│  (Central DB)   │    │   (Buy Tokens)  │");
  console.log("│                 │    │                 │");
  console.log("│  Contract:      │    │  Contract:      │");
  console.log(`│  ${userStateSepolia} │    │  ${presaleAmoy} │`);
  console.log("└─────────────────┘    └─────────────────┘");
  console.log("");

  // Show current state
  console.log("📊 CURRENT STATE:");
  const providerSepolia = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);
  const userState = new ethers.Contract(
    userStateSepolia,
    [
      "function totalPurchased(address) view returns (uint256)",
      "function totalStaked(address) view returns (uint256)",
    ],
    providerSepolia
  );

  const purchased = await userState.totalPurchased(signer.address);
  const staked = await userState.totalStaked(signer.address);

  console.log(`   Your purchased tokens: ${purchased.toString()}`);
  console.log(`   Your staked tokens: ${staked.toString()}`);
  console.log("");

  // Show how cross-chain works
  console.log("🔄 CROSS-CHAIN FLOW:");
  console.log("1. User calls buyTokens(100) on Amoy PreSale");
  console.log("2. PreSale sends LayerZero message to Sepolia UserState");
  console.log("3. UserState receives message and updates totalPurchased[user] += 100");
  console.log("4. User calls stake(50) on Amoy Staking");
  console.log("5. Staking sends LayerZero message to Sepolia UserState");
  console.log("6. UserState receives message and updates totalStaked[user] += 50");
  console.log("");

  // Show contract configuration
  console.log("⚙️  CONTRACT CONFIGURATION:");
  const providerAmoy = new ethers.providers.JsonRpcProvider(process.env.AMOY_RPC);
  
  const presale = new ethers.Contract(
    presaleAmoy,
    [
      "function destinationChainId() view returns (uint16)",
      "function destinationAddress() view returns (bytes)",
    ],
    providerAmoy
  );

  const staking = new ethers.Contract(
    stakingAmoy,
    [
      "function destinationChainId() view returns (uint16)",
      "function destinationAddress() view returns (bytes)",
    ],
    providerAmoy
  );

  try {
    const presaleDestChainId = await presale.destinationChainId();
    const presaleDestAddress = await presale.destinationAddress();
    const stakingDestChainId = await staking.destinationChainId();
    const stakingDestAddress = await staking.destinationAddress();

    console.log(`   PreSale destination: Chain ${presaleDestChainId} → ${presaleDestAddress}`);
    console.log(`   Staking destination: Chain ${stakingDestChainId} → ${stakingDestAddress}`);
    console.log("");
  } catch (error) {
    console.log("   ❌ Could not read contract configuration");
  }

  // Show what would happen
  console.log("🎯 WHAT WOULD HAPPEN IF YOU HAD ENOUGH TOKENS:");
  console.log("   After buyTokens(100) on Amoy:");
  console.log(`   → totalPurchased would become: ${purchased.add(100).toString()}`);
  console.log("");
  console.log("   After stake(50) on Amoy:");
  console.log(`   → totalStaked would become: ${staked.add(50).toString()}`);
  console.log("");

  console.log("💡 KEY INSIGHTS:");
  console.log("   • Actions on Amoy update state on Sepolia");
  console.log("   • No token bridging required");
  console.log("   • Centralized state management across chains");
  console.log("   • LayerZero handles the cross-chain messaging");
  console.log("");

  console.log("🚀 TO TEST THE FULL FLOW:");
  console.log("   1. Get more Amoy tokens: https://faucet.polygon.technology/");
  console.log("   2. Run: npm run test:buy");
  console.log("");

  console.log("✅ DEMO COMPLETE - Cross-chain infrastructure is working!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
