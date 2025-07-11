// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Mock Token", "MKT") {
        _mint(msg.sender, initialSupply);
    }
}
