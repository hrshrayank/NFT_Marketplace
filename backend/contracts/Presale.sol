//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Presale {
    uint8 public maxPresaleAddr;
    uint8 public countAddr;
    mapping(address => bool) public presaleAddresses;

    constructor(uint8 _maxPresaleAddr) {
        maxPresaleAddr = _maxPresaleAddr;
    }

    function addAddress() public {
        require(
            !presaleAddresses[msg.sender],
            "Your already Registered for Presale"
        );
        require(countAddr < maxPresaleAddr, "Limit exceeded  for Register");
        presaleAddresses[msg.sender] = true;
        countAddr += 1;
    }
}
