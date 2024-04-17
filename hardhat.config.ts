import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-network-helpers";
import "hardhat-abi-exporter";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "tsconfig-paths/register";

dotenv.config();

import "./tasks";


const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const mnemonic = process.env.MNEMONIC;
const accounts = {
  mnemonic: mnemonic,
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 10,
  passphrase: "",
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 250,
          },
        },
      },
    ],
  },
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: 31337,
      loggingEnabled: true,
      accounts,
      forking: {
        url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    amoy: {
      url: `https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 80002,
    },
    mumbai: {
      url: "https://matic-testnet-archive-rpc.bwarelabs.com",
      accounts,
      chainId: 80001,
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 137,
      live: true,
    }
  },
  namedAccounts: {
    owner: 0,
    bridge: {
      localhost: process.env.LOCAL_JASMINE_BRIDGE ?? 1,
      hardhat: process.env.LOCAL_JASMINE_BRIDGE ?? 1,
      polygon: process.env.POLYGON_JASMINE_BRIDGE ?? "0xf752f0300333d53982dd8c128ca077f17cb8c405",
      amoy: process.env.AMOY_JASMINE_BRIDGE ?? "0x2dcad29de8a67d70b7b5bf32b19f1480f333d8dd",
      mumbai: process.env.MUMBAI_JASMINE_BRIDGE ?? "0x2dcad29de8a67d70b7b5bf32b19f1480f333d8dd",
    }
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "src",
    tests: "./test",
  },
  abiExporter: {
    path: "./abi",
    format: "json",
    except: [
      "@openzeppelin",
    ],
    runOnCompile: true,
    clear: true,
  },
  typechain: {
    outDir: "./typechain",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      }
    ]
  }
};

export default config;
