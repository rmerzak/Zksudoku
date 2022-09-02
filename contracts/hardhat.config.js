require("dotenv").config();
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers")
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs:200,
    },
  },
  networks: {
    polygon: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/RS00f4HGurL8w59-qMsB7nwdjdh1Ga0H",
      accounts:[process.env.PRIVATE_KEY]
    }
  }
};
