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
      accounts: [configVariable("BASEMAIN_PRIVATE_KEY")],
      chainId: 8453
    },
    baseSepolia: {
      type: "http",
      url: "https://sepolia.base.org",
      accounts: [configVariable("BASETEST_PRIVATE_KEY")],
      chainId: 84532
    },
    bscTestnet: {
      // BSC Testnet RPC
      type: "http",
      url: "https://bsc-testnet.bnbchain.org",
      accounts: [configVariable("BSCTEST_PRIVATE_KEY")],
      chainId: 97
    },
    bscMainnet:{
      type: "http",
      url: "https://bsc-dataseed.bnbchain.org",
      accounts: [configVariable("BSCMAIN_PRIVATE_KEY")],
      chainId: 56
    },

    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
    }
  },
  verify: {
    blockscout: { enabled: false },
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: configVariable("COINMARKETCAP_API_KEY"),
    showTimeSpent: true,
    onlyCalledMethods: false,
  },
  coverage: {
    exclude: [
      "contracts/mocks/**",
      "contracts/interfaces/**",
      "ignition/**"
    ]
  }
});
