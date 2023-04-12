// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IBond {
    // Define the BondStruct struct to represent a bond
    struct BondStruct {
        uint256 faceValue;
        uint256 couponRate;
        uint256 maturityDate;
        address issuer;
    }

    event BondIssued(uint256 bondId, address issuer);

    function issueBond(
        uint256 _faceValue,
        uint256 _couponRate,
        uint256 _maturityDate
    ) external payable;

    function getBondDetails(
        uint256 bondId
    ) external view returns (uint256, uint256, uint256, address);

    function setInvestor(uint256 bondId, address investor) external payable;

    function checkIfInvestor(
        uint256 bondId,
        address investor
    ) external view returns (bool);

    function setEscrow(address _escrow) external payable;

    function getEscrow() external view returns (address);
}
