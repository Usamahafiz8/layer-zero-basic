const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Wallet address:", signer.address);
  
  // Check Sepolia balance
  const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);
  const sepoliaBalance = await sepoliaProvider.getBalance(signer.address);
  console.log("Sepolia balance:", ethers.utils.formatEther(sepoliaBalance), "ETH");
  
  // Check Amoy balance
  const amoyProvider = new ethers.providers.JsonRpcProvider(process.env.AMOY_RPC);
  const amoyBalance = await amoyProvider.getBalance(signer.address);
  console.log("Amoy balance:", ethers.utils.formatEther(amoyBalance), "ETH");
  
  if (amoyBalance.isZero()) {
    console.log("\n⚠️  You need Amoy testnet tokens!");
    console.log("Visit: https://faucet.polygon.technology/");
    console.log("Select 'Amoy' network and enter your address:", signer.address);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
