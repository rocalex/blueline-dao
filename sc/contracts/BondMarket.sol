// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./interfaces/IBondMarket.sol";
import "./interfaces/IBond.sol";
import "./interfaces/IUserAuth.sol";

// Create smart contracts to facilitate the peer-to-peer trading of bonds on the marketplace,
// and deploy them to the Polygon network using the Polygon SDK.
contract BondMarket is IBondMarket {
    address bondAddress;
    address authAddress;

    mapping(uint256 => Exchange) exchanges;

    modifier onlyLoggedInUser(address caller) {
        IUserAuth auth = IUserAuth(authAddress);
        require(auth.checkIsUserLogged(msg.sender), "Auth: user didn't login");
        _;
    }

    constructor(address _bondAddress, address _authAddress) payable {
        bondAddress = _bondAddress;
        authAddress = _authAddress;
    }

    function listBond(
        uint256 _bondId,
        uint256 _price
    ) external payable onlyLoggedInUser(msg.sender) {
        IBond bond = IBond(bondAddress);
        require(
            bond.checkIfInvestor(_bondId, msg.sender),
            "Bond: seller should be investor"
        );

        // TODO: check if bondId is valid

        exchanges[_bondId] = Exchange(_price, msg.sender);

        emit BondListed(_bondId, msg.sender, _price);
    }

    function buyBond(
        uint256 _bondId
    ) external payable onlyLoggedInUser(msg.sender) {
        uint256 price = exchanges[_bondId].price;
        require(
            exchanges[_bondId].price == msg.value,
            "Market: insufficient fund to buy"
        );

        address seller = exchanges[_bondId].seller;
        (bool sent, ) = seller.call{value: msg.value}("");
        require(sent, "Failed to send Ether to seller");

        IBond bond = IBond(bondAddress);
        bond.setInvestor(_bondId, msg.sender);

        emit BondSold(_bondId, msg.sender, price);

        delete exchanges[_bondId];
    }

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
        )
    {
        uint256 _price = exchanges[_bondId].price;
        // TODO: calcualte yieldToMaturity
        return (_bondId, _price, 0, 0);
    }
}
