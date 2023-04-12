import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/JatwtURyL3elFraitMBXxdfYl4oC2MXD",
      accounts: [
        process.env.OWNER_1_PRIVATE_KEY!,
        process.env.OWNER_2_PRIVATE_KEY!,
        process.env.OWNER_3_PRIVATE_KEY!,
      ]
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/tM2m7HN9DdVQYU27vNBgegbRBGWBJ3iB",
      accounts: [
        process.env.OWNER_1_PRIVATE_KEY!,
        process.env.OWNER_2_PRIVATE_KEY!,
        process.env.OWNER_3_PRIVATE_KEY!,
      ]
    }
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY!
    }
  }
};

export default config;
