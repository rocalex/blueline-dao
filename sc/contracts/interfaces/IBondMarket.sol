// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IBondMarket {
    struct Exchange {
        uint256 price;
        address seller;
    }

    function listBond(uint256 _bondId, uint256 _price) external payable;

    function buyBond(uint256 _bondId) external payable;

    function getBond(
        uint256 _bondId
    )
        external
        view
        returns (
            uint256 bondId,
            uint256 price,
            uint256 yieldToMaturity,
            uint256 state
        );

    event BondListed(uint256 bondId, address seller, uint256 price);
    event BondSold(uint256 bondId, address buyer, uint256 price);
}
