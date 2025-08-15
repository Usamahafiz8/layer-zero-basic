const { ethers } = require("hardhat");

const presaleAmoy = "0x7Dda431a9e4F451Dd8Ea50788B63df69f3D18BA4";
const stakingAmoy = "0x489476ABbe4CbC3A7CeaB2Fc70225684CBEf6b5E";
const userStateSepolia = "0x0f46E2c871Ab9B891caCF986EAa55c28e7751cE7";

const buyAmount = 300;
const stakeAmount = 150;

async function main() {
  console.log("🚀 Starting cross-chain buy + stake test...");

  const [signer] = await ethers.getSigners();

  // --- BUY TOKENS ---
  console.log(`Buying ${buyAmount} tokens from PreSale on Amoy...`);

  const presale = await ethers.getContractAt("PreSale", presaleAmoy, signer);

  // Hardcode LayerZero fee for testing instead of estimating
  const hardcodedFee = ethers.utils.parseEther("0.01"); // same as nativeFee in frontend

  const txBuy = await presale.buyTokens(buyAmount, {
    value: hardcodedFee,
    gasLimit: 500000,
  });

  await txBuy.wait();
  console.log("✅ Buy transaction sent on Amoy");

  console.log("⏳ Waiting 20 seconds for LayerZero message to deliver...");
  await new Promise((r) => setTimeout(r, 20000));

  // --- STAKE TOKENS ---
  const staking = await ethers.getContractAt("Staking", stakingAmoy, signer);
  console.log(`Staking ${stakeAmount} tokens from Staking on Amoy...`);
  const txStake = await staking.stake(stakeAmount, { gasLimit: 500000 });
  await txStake.wait();
  console.log("✅ Stake transaction sent on Amoy");

  console.log("⏳ Waiting 20 seconds for LayerZero message to deliver...");
  await new Promise((r) => setTimeout(r, 20000));

  // --- READ STATE FROM USERSTATE ---
  console.log("📡 Reading totals from UserState on Sepolia...");
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

  console.log(`📊 Total purchased: ${purchased.toString()}`);
  console.log(`📊 Total staked: ${staked.toString()}`);

  console.log("🎉 Test complete!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// npx hardhat run scripts/testAll.js --network amoy
