// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {

    uint public initialSupply = 1000 * 10 ** 18;
    mapping (address => bool) public lockedAddresses; // list of locked address

    constructor() ERC20 ("Test", "T") {
        _mint(msg.sender, initialSupply);
    }

    function lock() public {
        lockedAddresses[msg.sender] = true;
    }

    function unlock() public {
        lockedAddresses[msg.sender] = false;
    }

    function isLocked() public view returns(bool){
        return lockedAddresses[msg.sender];
    }
}