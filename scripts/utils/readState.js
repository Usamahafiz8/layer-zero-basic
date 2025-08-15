const { ethers } = require("hardhat");

const userStateSepolia = "0x0f46E2c871Ab9B891caCF986EAa55c28e7751cE7"; // Existing UserState on Sepolia
const presaleAmoy = "0x7Dda431a9e4F451Dd8Ea50788B63df69f3D18BA4"; // Existing PreSale on Amoy
const stakingAmoy = "0x489476ABbe4CbC3A7CeaB2Fc70225684CBEf6b5E"; // Existing Staking on Amoy

async function main() {
  console.log("📡 Reading current state from deployed contracts...");

  const [signer] = await ethers.getSigners();
  console.log("Your wallet address:", signer.address);

  // --- READ FROM USERSTATE ON SEPOLIA ---
  console.log("\n📊 Reading from UserState on Sepolia...");
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

  console.log(`✅ Total purchased: ${purchased.toString()}`);
  console.log(`✅ Total staked: ${staked.toString()}`);

  // --- READ FROM PRESALE ON AMOY ---
  console.log("\n📊 Reading from PreSale on Amoy...");
  const providerAmoy = new ethers.providers.JsonRpcProvider(process.env.AMOY_RPC);
  const presale = new ethers.Contract(
    presaleAmoy,
    [
      "function destinationChainId() view returns (uint16)",
      "function destinationAddress() view returns (bytes)",
    ],
    providerAmoy
  );

  try {
    const destChainId = await presale.destinationChainId();
    const destAddress = await presale.destinationAddress();
    console.log(`✅ Destination Chain ID: ${destChainId.toString()}`);
    console.log(`✅ Destination Address: ${destAddress}`);
  } catch (error) {
    console.log("❌ Could not read PreSale destination (contract might not be configured)");
  }

  // --- READ FROM STAKING ON AMOY ---
  console.log("\n📊 Reading from Staking on Amoy...");
  const staking = new ethers.Contract(
    stakingAmoy,
    [
      "function destinationChainId() view returns (uint16)",
      "function destinationAddress() view returns (bytes)",
      "function staked(address) view returns (uint256)",
    ],
    providerAmoy
  );

  try {
    const stakingDestChainId = await staking.destinationChainId();
    const stakingDestAddress = await staking.destinationAddress();
    const userStaked = await staking.staked(signer.address);
    console.log(`✅ Destination Chain ID: ${stakingDestChainId.toString()}`);
    console.log(`✅ Destination Address: ${stakingDestAddress}`);
    console.log(`✅ Your staked amount: ${userStaked.toString()}`);
  } catch (error) {
    console.log("❌ Could not read Staking contract (contract might not be configured)");
  }

  console.log("\n🎉 State reading complete!");
  console.log("\n💡 To test the full cross-chain flow, you need more Amoy tokens.");
  console.log("   Visit: https://faucet.polygon.technology/ and select 'Amoy' network");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
