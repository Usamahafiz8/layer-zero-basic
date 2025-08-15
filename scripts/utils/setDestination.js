const { ethers } = require("hardhat");

async function main() {
  const presaleAddress = "0x7Dda431a9e4F451Dd8Ea50788B63df69f3D18BA4"; // Existing PreSale on Amoy
  const destinationChainId = 10161; // Sepolia LayerZero chain ID
  const userStateAddressOnSepolia = "0x0f46E2c871Ab9B891caCF986EAa55c28e7751cE7"; // Existing UserState on Sepolia
  const destinationAddressBytes = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [userStateAddressOnSepolia]
  );

  const presale = await ethers.getContractAt("PreSale", presaleAddress);
  const tx = await presale.setDestination(destinationChainId, destinationAddressBytes);
  await tx.wait();
  console.log("Destination set!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
