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
  });

  // describe("Deployment", function () {
  //   it("Should set the right unlockTime", async function () {
  //     const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

  //     expect(await lock.unlockTime()).to.equal(unlockTime);
  //   });

  //   it("Should set the right owner", async function () {
  //     const { lock, owner } = await loadFixture(deployOneYearLockFixture);

  //     expect(await lock.owner()).to.equal(owner.address);
  //   });

  //   it("Should receive and store the funds to lock", async function () {
  //     const { lock, lockedAmount } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     expect(await ethers.provider.getBalance(lock.address)).to.equal(
  //       lockedAmount
  //     );
  //   });

  //   it("Should fail if the unlockTime is not in the future", async function () {
  //     // We don't use the fixture here because we want a different deployment
  //     const latestTime = await time.latest();
  //     const Lock = await ethers.getContractFactory("Lock");
  //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
  //       "Unlock time should be in the future"
  //     );
  //   });
  // });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
