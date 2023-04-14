import { ethers } from "hardhat";

async function main() {
  const Bond = await ethers.getContractFactory("Bond");
  const bond = await Bond.deploy();

  await bond.deployed();

  console.log("Bond:", bond.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
