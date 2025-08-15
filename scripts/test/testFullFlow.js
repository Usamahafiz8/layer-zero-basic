const { ethers } = require("hardhat");

// Existing deployed contract addresses
const CONTRACTS = {
    userState: "0x0f46E2c871Ab9B891caCF986EAa55c28e7751cE7", // Sepolia
    presale: "0x7Dda431a9e4F451Dd8Ea50788B63df69f3D18BA4", // Amoy
    staking: "0x489476ABbe4CbC3A7CeaB2Fc70225684CBEf6b5E"  // Amoy
};

async function main() {
    console.log("🚀 TESTING FULL CROSS-CHAIN FLOW");
    console.log("================================\n");

    const [signer] = await ethers.getSigners();
    console.log("👤 Your wallet:", signer.address);
    console.log("");

    // Check balances first
    console.log("💰 CHECKING BALANCES");
    console.log("===================");
    
    const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);
    const amoyProvider = new ethers.providers.JsonRpcProvider(process.env.AMOY_RPC);
    
    const sepoliaBalance = await sepoliaProvider.getBalance(signer.address);
    const amoyBalance = await amoyProvider.getBalance(signer.address);
    
    console.log(`Sepolia balance: ${ethers.utils.formatEther(sepoliaBalance)} ETH`);
    console.log(`Amoy balance: ${ethers.utils.formatEther(amoyBalance)} ETH`);
    console.log("");

    if (amoyBalance.lt(ethers.utils.parseEther("0.05"))) {
        console.log("❌ Insufficient Amoy balance for testing");
        console.log("💡 Get more Amoy tokens from: https://faucet.polygon.technology/");
        console.log("   Select 'Amoy' network and enter your address:", signer.address);
        return;
    }

    // Initialize contracts
    console.log("📋 INITIALIZING CONTRACTS");
    console.log("=========================");
    
    const userState = new ethers.Contract(
        CONTRACTS.userState,
        [
            "function totalPurchased(address) view returns (uint256)",
            "function totalStaked(address) view returns (uint256)",
            "function getTotals(address) view returns (uint256 purchased, uint256 staked)"
        ],
        sepoliaProvider
    );

    const presale = new ethers.Contract(
        CONTRACTS.presale,
        [
            "function buyTokens(uint256 amount) external payable",
            "function destinationChainId() view returns (uint16)",
            "function destinationAddress() view returns (bytes)"
        ],
        amoyProvider
    );

    const staking = new ethers.Contract(
        CONTRACTS.staking,
        [
            "function stake(uint256 amount) external payable",
            "function destinationChainId() view returns (uint16)",
            "function destinationAddress() view returns (bytes)"
        ],
        amoyProvider
    );

    console.log("✅ Contracts initialized");
    console.log("");

    // Check initial state
    console.log("📊 CHECKING INITIAL STATE");
    console.log("=========================");
    
    const initialTotals = await userState.getTotals(signer.address);
    console.log(`Initial state for ${signer.address}:`);
    console.log(`   Purchased: ${initialTotals[0]}`);
    console.log(`   Staked: ${initialTotals[1]}`);
    console.log("");

    // Check contract configuration
    console.log("🔗 CHECKING CONTRACT CONFIGURATION");
    console.log("=================================");
    
    const presaleDestChainId = await presale.destinationChainId();
    const presaleDestAddress = await presale.destinationAddress();
    const stakingDestChainId = await staking.destinationChainId();
    const stakingDestAddress = await staking.destinationAddress();
    
    console.log(`PreSale destination: Chain ${presaleDestChainId} → ${presaleDestAddress}`);
    console.log(`Staking destination: Chain ${stakingDestChainId} → ${stakingDestAddress}`);
    console.log("");

    // Test 1: Buy tokens
    console.log("🛒 TEST 1: BUYING TOKENS");
    console.log("=========================");
    
    const buyAmount = 100;
    const buyFee = ethers.utils.parseEther("0.01"); // LayerZero fee
    
    console.log(`Buying ${buyAmount} tokens on Amoy...`);
    console.log(`LayerZero fee: ${ethers.utils.formatEther(buyFee)} ETH`);
    
    try {
        const buyTx = await presale.connect(signer).buyTokens(buyAmount, {
            value: buyFee,
            gasLimit: 300000,
            gasPrice: ethers.utils.parseUnits("25", "gwei")
        });
        
        console.log("⏳ Buy transaction sent:", buyTx.hash);
        console.log("⏳ Waiting for confirmation...");
        
        await buyTx.wait();
        console.log("✅ Buy transaction confirmed!");
        
        // Wait for LayerZero message
        console.log("⏳ Waiting 30 seconds for LayerZero message to deliver...");
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // Check state after buy
        const afterBuyTotals = await userState.getTotals(signer.address);
        console.log(`📊 State after buy:`);
        console.log(`   Purchased: ${afterBuyTotals[0]} (was ${initialTotals[0]})`);
        console.log(`   Staked: ${afterBuyTotals[1]}`);
        
        if (afterBuyTotals[0].gt(initialTotals[0])) {
            console.log("✅ Cross-chain buy successful!");
        } else {
            console.log("⏳ Still waiting for LayerZero message...");
        }
        
    } catch (error) {
        console.log("❌ Buy transaction failed:", error.message);
        return;
    }
    
    console.log("");

    // Test 2: Stake tokens
    console.log("🔒 TEST 2: STAKING TOKENS");
    console.log("==========================");
    
    const stakeAmount = 50;
    
    console.log(`Staking ${stakeAmount} tokens on Amoy...`);
    
    try {
        const stakeTx = await staking.connect(signer).stake(stakeAmount, {
            gasLimit: 300000,
            gasPrice: ethers.utils.parseUnits("25", "gwei")
        });
        
        console.log("⏳ Stake transaction sent:", stakeTx.hash);
        console.log("⏳ Waiting for confirmation...");
        
        await stakeTx.wait();
        console.log("✅ Stake transaction confirmed!");
        
        // Wait for LayerZero message
        console.log("⏳ Waiting 30 seconds for LayerZero message to deliver...");
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        // Check final state
        const finalTotals = await userState.getTotals(signer.address);
        console.log(`📊 Final state:`);
        console.log(`   Purchased: ${finalTotals[0]}`);
        console.log(`   Staked: ${finalTotals[1]} (was ${afterBuyTotals[1]})`);
        
        if (finalTotals[1].gt(afterBuyTotals[1])) {
            console.log("✅ Cross-chain stake successful!");
        } else {
            console.log("⏳ Still waiting for LayerZero message...");
        }
        
    } catch (error) {
        console.log("❌ Stake transaction failed:", error.message);
        return;
    }
    
    console.log("");

    // Final summary
    console.log("🎉 TEST SUMMARY");
    console.log("===============");
    
    const summaryTotals = await userState.getTotals(signer.address);
    console.log(`Final totals for ${signer.address}:`);
    console.log(`   Total Purchased: ${summaryTotals[0]}`);
    console.log(`   Total Staked: ${summaryTotals[1]}`);
    console.log("");
    
    if (summaryTotals[0].gt(initialTotals[0]) || summaryTotals[1].gt(initialTotals[1])) {
        console.log("🎉 SUCCESS! Cross-chain flow is working!");
        console.log("✅ Actions on Amoy successfully updated state on Sepolia");
        console.log("✅ LayerZero messaging is functioning correctly");
        console.log("✅ Centralized state management is working");
    } else {
        console.log("⏳ Still waiting for LayerZero messages to be processed");
        console.log("💡 LayerZero messages can take 1-5 minutes to deliver");
        console.log("💡 Check again in a few minutes with: npm run readState");
    }
    
    console.log("");
    console.log("🔍 To monitor progress, run:");
    console.log("   npm run readState");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
