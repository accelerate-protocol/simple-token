import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatIgnitionPlugin from "@nomicfoundation/hardhat-ignition";
import { configVariable, defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin, hardhatIgnitionPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.34",
      },
      production: {
        version: "0.8.34",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    baseMainnet: {
      type: "http",
      url: "https://mainnet.base.org",
      accounts: process.env.BASEMAIN_PRIVATE_KEY ? [process.env.BASEMAIN_PRIVATE_KEY] : [],
      chainId: 8453
    },
    baseSepolia: {
      type: "http",
      url: "https://sepolia.base.org",
      accounts: process.env.BASETEST_PRIVATE_KEY ? [process.env.BASETEST_PRIVATE_KEY] : [],
      chainId: 84532
    },
    bscTestnet: {
      // BSC Testnet RPC
      type: "http",
      url: "https://bsc-testnet.bnbchain.org",
      accounts: process.env.BSCTEST_PRIVATE_KEY ? [process.env.BSCTEST_PRIVATE_KEY] : [],
      chainId: 97
    },
    bscMainnet:{
      type: "http",
      url: "https://bsc-dataseed.bnbchain.org",
      accounts: process.env.BSCMAIN_PRIVATE_KEY ? [process.env.BSCMAIN_PRIVATE_KEY] : [],
      chainId: 56
    },

    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
    }
  },
  etherscan: {
    apiKey: {
      bsc: process.env.ETHERSCAN_API_KEY || "",
      bscTestnet: process.env.ETHERSCAN_API_KEY || ""
    }
  },
});
