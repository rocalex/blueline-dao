// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./interfaces/IUserAuth.sol";
import "./interfaces/IBond.sol";

// Create a system for users to invest in the listed bonds and transfer funds to the escrow account
contract InvestBond {
    address bondAddress;
    address authAddress;

    event BondPurchased(uint256 bondId, address buyer);

    modifier onlyLoggedInUser(address caller) {
        IUserAuth auth = IUserAuth(authAddress);
        require(auth.checkIsUserLogged(msg.sender), "Auth: user didn't login");
        _;
    }

    constructor(
        address _bondAddress,
        address _authAddress
    ) payable {
        bondAddress = _bondAddress;
        authAddress = _authAddress;
    }

    function investBond(
        uint256 bondId
    ) public payable onlyLoggedInUser(msg.sender) {
        IBond bond = IBond(bondAddress);
        (uint256 faceValue, , , ) = bond.getBondDetails(bondId);

        require(msg.value == faceValue, "Bond: Insufficient fund");
        address escrow = bond.getEscrow();
        (bool sent, ) = escrow.call{value: msg.value}("");
        require(sent, "Failed to send Ether to escrow");
        bond.setInvestor(bondId, msg.sender);

        emit BondPurchased(bondId, msg.sender);
    }
}
