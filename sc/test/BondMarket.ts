import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BondMarket", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBondFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, escrow, otherAccount, investor, otherInvestor] =
      await ethers.getSigners();

    const Bond = await ethers.getContractFactory("Bond");
    const bond = await Bond.deploy();
    await bond.deployed();

    const UserAuth = await ethers.getContractFactory("UserAuth");
    const userAuth = await UserAuth.deploy();
    await userAuth.deployed();

    const InvestBond = await ethers.getContractFactory("InvestBond");
    const investBond = await InvestBond.deploy(
      escrow.address,
      bond.address,
      userAuth.address
    );
    await investBond.deployed();

    const BondMarket = await ethers.getContractFactory("BondMarket");
    const bondMarket = await BondMarket.deploy(bond.address, userAuth.address);
    await bondMarket.deployed();

    return {
      bond,
      owner,
      otherAccount,
      userAuth,
      investBond,
      investor,
      bondMarket,
      otherInvestor,
    };
  }

  it("deploy", async () => {
    const { bond, owner } = await loadFixture(deployBondFixture);
    expect(await bond.owner()).to.equal(owner.address);

    expect(await bond.totalBonds()).to.equal("0");
  });

  it("list and buy bond", async () => {
    const faceValue = ethers.utils.parseEther("0.1");
    const couponRate = ethers.BigNumber.from("0");
    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
    const maturityDate = Math.floor(fiveYearsFromNow.getTime() / 1000);

    const {
      bond,
      owner,
      userAuth,
      investor,
      investBond,
      otherInvestor,
      bondMarket,
    } = await loadFixture(deployBondFixture);
    await expect(bond.issueBond(faceValue, couponRate, maturityDate))
      .to.emit(bond, "BondIssued")
      .withArgs("0", owner.address);

    const totalBonds = await bond.totalBonds();
    const bondDetails = await bond.getBondDetails(totalBonds.sub(1));

    expect(bondDetails[0]).to.equal(faceValue);
    expect(bondDetails[1]).to.equal(couponRate);

    await userAuth
      .connect(investor)
      .registerUser(investor.address, "investor", "password");
    await userAuth.connect(investor).loginUser(investor.address, "password");

    const bondId = (await bond.totalBonds()).sub(1);
    await investBond.connect(investor).investBond(bondId, { value: faceValue });

    await userAuth
      .connect(otherInvestor)
      .registerUser(otherInvestor.address, "investor2", "password");
    await userAuth
      .connect(otherInvestor)
      .loginUser(otherInvestor.address, "password");

    const price = faceValue.add(ethers.utils.parseEther("0.01"));
    await expect(bondMarket.connect(investor).listBond(bondId, price))
      .to.emit(bondMarket, "BondListed")
      .withArgs(bondId, investor.address, price);

    await expect(
      bondMarket.connect(otherInvestor).buyBond(bondId, { value: price })
    )
      .to.emit(bondMarket, "BondSold")
      .withArgs(bondId, otherInvestor.address, price);
  });
});
