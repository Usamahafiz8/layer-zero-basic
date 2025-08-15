const { ethers } = require("hardhat");

const presaleAmoy = "0x7Dda431a9e4F451Dd8Ea50788B63df69f3D18BA4";
const userStateSepolia = "0x0f46E2c871Ab9B891caCF986EAa55c28e7751cE7";

const buyAmount = 10; // Minimal amount

async function main() {
  console.log("🚀 MINIMAL CROSS-CHAIN TEST");
  console.log("============================\n");

  const [signer] = await ethers.getSigners();
  console.log("👤 Your wallet:", signer.address);
  console.log("");

  // Check balance first
  const providerAmoy = new ethers.providers.JsonRpcProvider(process.env.AMOY_RPC);
  const balance = await providerAmoy.getBalance(signer.address);
  console.log(`💰 Current Amoy balance: ${ethers.utils.formatEther(balance)} ETH`);
  console.log("");

  // Try to buy tokens with minimal gas
  console.log(`🛒 Attempting to buy ${buyAmount} tokens...`);
  
  const presale = await ethers.getContractAt("PreSale", presaleAmoy, signer);

  // Ultra-minimal LayerZero fee
  const hardcodedFee = ethers.utils.parseEther("0.001"); // Very small fee

  try {
    const txBuy = await presale.buyTokens(buyAmount, {
      value: hardcodedFee,
      gasLimit: 200000, // Minimal gas limit
      gasPrice: ethers.utils.parseUnits("25", "gwei") // Minimum gas price
    });

    console.log("⏳ Transaction sent! Hash:", txBuy.hash);
    console.log("⏳ Waiting for confirmation...");
    
    await txBuy.wait();
    console.log("✅ Buy transaction confirmed!");
    console.log("");

    console.log("⏳ Waiting 30 seconds for LayerZero message to deliver...");
    await new Promise((r) => setTimeout(r, 30000));

    // Check the result
    console.log("📡 Checking result on Sepolia...");
    const providerSepolia = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);
    const userState = new ethers.Contract(
      userStateSepolia,
      [
        "function totalPurchased(address) view returns (uint256)",
      ],
      providerSepolia
    );

    const purchased = await userState.totalPurchased(signer.address);
    console.log(`📊 Your total purchased tokens: ${purchased.toString()}`);
    
    if (purchased.gt(0)) {
      console.log("🎉 SUCCESS! Cross-chain transaction worked!");
    } else {
      console.log("⏳ Still waiting for LayerZero message...");
    }

  } catch (error) {
    console.log("❌ Transaction failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("");
      console.log("💡 SOLUTION: Get more Amoy tokens");
      console.log("   1. Visit: https://faucet.polygon.technology/");
      console.log("   2. Select 'Amoy' network");
      console.log("   3. Enter your address:", signer.address);
      console.log("   4. Request tokens");
      console.log("   5. Try again!");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
