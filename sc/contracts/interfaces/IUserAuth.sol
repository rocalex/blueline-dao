// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IUserAuth {
    function checkIsUserLogged(address _address) external view returns (bool);
}
