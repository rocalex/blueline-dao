// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./interfaces/IBond.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Create smart contracts to represent the bonds to be listed on the marketplace,
// and deploy them to the Polygon network using the Polygon SDK.
contract Bond is IBond, Ownable {
    // Create an mapping to store all of the bonds that have been issued
    mapping(uint256 => BondStruct) bonds;
    mapping(uint256 => address) investors;
    uint256 public totalBonds;

    constructor() payable {
        totalBonds = 0;
    }

    function issueBond(
        uint256 _faceValue,
        uint256 _couponRate,
        uint256 _maturityDate
    ) external payable onlyOwner {
        require(_faceValue > 0, "Bond: invalid face value");
        require(_maturityDate > block.timestamp, "Bond: invalid maturity date");

        bonds[totalBonds] = BondStruct(
            _faceValue,
            _couponRate,
            _maturityDate,
            msg.sender
        );

        emit BondIssued(totalBonds, msg.sender);

        totalBonds = totalBonds + 1;
    }

    function getBondDetails(
        uint256 bondId
    ) external view returns (uint256, uint256, uint256, address) {
        BondStruct storage bondDetail = bonds[bondId];
        return (
            bondDetail.faceValue,
            bondDetail.couponRate,
            bondDetail.maturityDate,
            bondDetail.issuer
        );
    }

    function setInvestor(uint256 bondId, address investor) external payable {
        investors[bondId] = investor;
    }

    function checkIfInvestor(
        uint256 bondId,
        address investor
    ) external view returns (bool) {
        return investors[bondId] == investor;
    }
}
