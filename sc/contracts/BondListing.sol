// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// Implement a search and filter functionality for users to discover available bonds
// based on their preferences.
contract BondListing {
    address bondAddress;

    constructor(address _bondAddress) {
        bondAddress = _bondAddress;
    }
}
