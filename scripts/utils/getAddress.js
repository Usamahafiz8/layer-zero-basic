const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Wallet address:", signer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
