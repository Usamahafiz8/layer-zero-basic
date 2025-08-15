const { ethers } = require("hardhat");

async function main() {
    console.log("🔒 STAKE TOKENS");
    console.log("===============\n");

    // Get signers
    const [deployer, user] = await ethers.getSigners();
    
    console.log("👤 Your wallet:", user.address);
    console.log("");

    // Deploy contracts for local testing
    console.log("📦 SETTING UP CONTRACTS");
    console.log("=======================");
    
    const TestUserState = await ethers.getContractFactory("TestUserState");
    const userState = await TestUserState.deploy("0x1234567890123456789012345678901234567890");
    await userState.deployed();
    console.log("✅ UserState deployed to:", userState.address);

    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy("0x1234567890123456789012345678901234567890");
    await staking.deployed();
    console.log("✅ Staking deployed to:", staking.address);

    // Configure cross-chain destination
    const destinationAddressBytes = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [userState.address]
    );
    await staking.setDestination(1, destinationAddressBytes);
    console.log("✅ Cross-chain destination configured");
    console.log("");

    // Function to simulate staking
    async function stakeTokens(amount) {
        console.log(`🔒 Staking ${amount} tokens...`);
        
        const payload = ethers.utils.defaultAbiCoder.encode(
            ["uint8", "address", "uint256"],
            [2, user.address, amount] // action=2 (stake)
        );
        
        await userState.testNonblockingLzReceive(1, "0x", 1, payload);
        
        const totals = await userState.getTotals(user.address);
        console.log(`✅ Successfully staked ${amount} tokens!`);
        console.log(`📊 Your current state:`);
        console.log(`   Purchased: ${totals[0]} tokens`);
        console.log(`   Staked: ${totals[1]} tokens`);
        console.log("");
        
        return totals;
    }

    // Function to check current state
    async function checkState() {
        const totals = await userState.getTotals(user.address);
        console.log(`📊 Current State:`);
        console.log(`   Purchased: ${totals[0]} tokens`);
        console.log(`   Staked: ${totals[1]} tokens`);
        console.log("");
        return totals;
    }

    // Check initial state
    console.log("📊 INITIAL STATE");
    console.log("================");
    await checkState();

    // Let's stake some tokens!
    console.log("🔒 STAKE TOKENS");
    console.log("===============");
    
    // Stake 50 tokens
    await stakeTokens(50);
    
    // Stake 25 more tokens
    await stakeTokens(25);
    
    // Stake 100 more tokens
    await stakeTokens(100);
    
    // Final state
    console.log("📊 FINAL STATE");
    console.log("==============");
    const finalState = await checkState();
    
    console.log("🎉 STAKING COMPLETE!");
    console.log("===================");
    console.log(`✅ Total tokens staked: ${finalState[1]}`);
    console.log(`✅ Total tokens purchased: ${finalState[0]}`);
    console.log("");
    console.log("💡 You can stake more tokens by running this script again!");
    console.log("💡 Each stake adds to your total staked amount.");
    console.log("💡 Your staking state is tracked across chains!");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
