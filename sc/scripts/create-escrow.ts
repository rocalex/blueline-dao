import {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from "@safe-global/protocol-kit";
import { ethers } from "hardhat";

async function main() {
  const [owner1, owner2, owner3] = await ethers.getSigners();

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: owner1,
  });

  const safeFactory = await SafeFactory.create({ ethAdapter });

  const safeAccountConfig: SafeAccountConfig = {
    owners: [
      await owner1.getAddress(),
      await owner2.getAddress(),
      await owner3.getAddress(),
    ],
    threshold: 2,
  };

  const safeEscrow = await safeFactory.deploySafe({ safeAccountConfig });
  const safeEscrowAddress = safeEscrow.getAddress();

  console.log("Safe Escrow has been deployed:", safeEscrowAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
