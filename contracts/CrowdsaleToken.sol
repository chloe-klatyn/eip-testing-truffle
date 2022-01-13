//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdsaleToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("CrowdsaleToken", "CRWD") {
        _mint(msg.sender, initialSupply);
    }
}