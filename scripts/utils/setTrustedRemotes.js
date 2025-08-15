const { ethers } = require("hardhat");

/// LayerZero chain IDs
const CHAIN_ID_SEPOLIA = 10161;
const CHAIN_ID_AMOY = 10109;

async function main() {
  // ===== Replace with your deployed addresses =====
  const userStateSepolia = "0x0f46E2c871Ab9B891caCF986EAa55c28e7751cE7";
  const presaleAmoy = "0x7Dda431a9e4F451Dd8Ea50788B63df69f3D18BA4";
  const stakingAmoy = "0x489476ABbe4CbC3A7CeaB2Fc70225684CBEf6b5E";

  // ========== SET TRUST FOR PRESALE ↔ USERSTATE ==========
  console.log("Setting trusted remotes for PreSale ↔ UserState...");

  // PreSale trusts UserState (Sepolia)
  const presale = await ethers.getContractAt("PreSale", presaleAmoy);
  let tx = await presale.setTrustedRemote(
    CHAIN_ID_SEPOLIA,
    ethers.utils.solidityPack(["address", "address"], [userStateSepolia, presaleAmoy])
  );
  await tx.wait();
  console.log("✅ PreSale trusts UserState");

  // UserState trusts PreSale (Amoy)
  const userState = await ethers.getContractAt("UserState", userStateSepolia);
  tx = await userState.setTrustedRemote(
    CHAIN_ID_AMOY,
    ethers.utils.solidityPack(["address", "address"], [presaleAmoy, userStateSepolia])
  );
  await tx.wait();
  console.log("✅ UserState trusts PreSale");

  // ========== SET TRUST FOR STAKING ↔ USERSTATE ==========
  console.log("Setting trusted remotes for Staking ↔ UserState...");

  // Staking trusts UserState (Sepolia)
  const staking = await ethers.getContractAt("Staking", stakingAmoy);
  tx = await staking.setTrustedRemote(
    CHAIN_ID_SEPOLIA,
    ethers.utils.solidityPack(["address", "address"], [userStateSepolia, stakingAmoy])
  );
  await tx.wait();
  console.log("✅ Staking trusts UserState");

  // UserState trusts Staking (Amoy)
  tx = await userState.setTrustedRemote(
    CHAIN_ID_AMOY,
    ethers.utils.solidityPack(["address", "address"], [stakingAmoy, userStateSepolia])
  );
  await tx.wait();
  console.log("✅ UserState trusts Staking");

  console.log("🎉 All trusted remotes set!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// npx hardhat run scripts/setTrustedRemotes.js --network amoy
// npx hardhat run scripts/setTrustedRemotes.js --network sepolia
