import { ethers } from "hardhat";

async function main() {
  const UserAuth = await ethers.getContractFactory("UserAuth");
  const userAuth = await UserAuth.deploy();

  await userAuth.deployed();

  console.log("UserAuth:", userAuth.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
