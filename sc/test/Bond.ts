import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Bond", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBondFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, escrow, otherAccount, investor] = await ethers.getSigners();

    const Bond = await ethers.getContractFactory("Bond");
    const bond = await Bond.deploy(escrow.address);
    await bond.deployed();

    const UserAuth = await ethers.getContractFactory("UserAuth");
    const userAuth = await UserAuth.deploy();
    await userAuth.deployed();

    const InvestBond = await ethers.getContractFactory("InvestBond");
    const investBond = await InvestBond.deploy(
      bond.address,
      userAuth.address
    );
    await investBond.deployed();

    return { bond, owner, otherAccount, userAuth, investBond, investor };
  }

  it("deploy", async () => {
    const { bond, owner } = await loadFixture(deployBondFixture);
    expect(await bond.owner()).to.equal(owner.address);

    expect(await bond.totalBonds()).to.equal("0");
  });

  it("issue bond", async () => {
    const faceValue = ethers.utils.parseEther("0.1");
    const couponRate = ethers.BigNumber.from("0");
    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
    const maturityDate = Math.floor(fiveYearsFromNow.getTime() / 1000);

    const { bond, owner } = await loadFixture(deployBondFixture);
    await expect(bond.issueBond(faceValue, couponRate, maturityDate))
      .to.emit(bond, "BondIssued")
      .withArgs("0", owner.address);

    const totalBonds = await bond.totalBonds();
    const bondDetails = await bond.getBondDetails(totalBonds.sub(1));

    expect(bondDetails[0]).to.equal(faceValue);
    expect(bondDetails[1]).to.equal(couponRate);
  });

  it("issue bond from other account", async () => {
    const faceValue = ethers.utils.parseEther("0.1");
    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
    const maturityDate = Math.floor(fiveYearsFromNow.getTime() / 1000);
    const couponRate = ethers.BigNumber.from("0");

    const { bond, otherAccount } = await loadFixture(deployBondFixture);
    await expect(
      bond.connect(otherAccount).issueBond(faceValue, couponRate, maturityDate)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("invest bond", async () => {
    const { bond, investBond, investor, userAuth } = await loadFixture(
      deployBondFixture
    );
    const faceValue = ethers.utils.parseEther("0.1");
    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
    const maturityDate = Math.floor(fiveYearsFromNow.getTime() / 1000);
    const couponRate = ethers.BigNumber.from("0");

    await bond.issueBond(faceValue, couponRate, maturityDate);

    await userAuth
      .connect(investor)
      .registerUser(investor.address, "investor", "password");

    await userAuth.connect(investor).loginUser(investor.address, "password");

    const bondId = (await bond.totalBonds()).sub(1);
    await investBond.connect(investor).investBond(bondId, { value: faceValue });

    expect(await bond.checkIfInvestor(bondId, investor.address)).to.equal(true);
  });
});
