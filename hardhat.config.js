require("@nomiclabs/hardhat-ethers"); // ethers v5 plugin
require("@nomicfoundation/hardhat-toolbox"); // must be v2.0.2 for ethers v5
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 10
      }
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
    amoy: {
      url: process.env.AMOY_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
