import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@parity/hardhat-polkadot";
import dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.warn(
    "⚠️   WARNING: PRIVATE_KEY environment variable not found. Please set it in your .env file for network deployments."
  );
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1, // Optimize for size over gas efficiency
      },
      viaIR: true, // Enable the new IR-based code generator for better optimization
    },
  },
  resolc: {
    compilerSource: "npm",
    settings: {},
  },
  networks: {
    passetHubTestnet: {
      polkavm: true,
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
      accounts: privateKey ? [privateKey] : [],
    },
  },
};

export default config;