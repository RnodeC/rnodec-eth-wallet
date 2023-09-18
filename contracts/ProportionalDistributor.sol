// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProportionalDistributor {
    address public owner;
    mapping(address => uint256) public proportions;
    address[] public addresses;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setProportions(address[] memory _addresses, uint256[] memory _proportions) public onlyOwner {
        require(_addresses.length == _proportions.length, "Mismatch in array lengths");

        uint256 totalProportions = 0;
        for(uint i = 0; i < _proportions.length; i++) {
            totalProportions += _proportions[i];
        }
        require(totalProportions == 100, "Proportions must sum to 100");

        // Clear existing proportions
        for(uint i = 0; i < addresses.length; i++) {
            delete proportions[addresses[i]];
        }

        // Update with new proportions
        addresses = _addresses;
        for(uint i = 0; i < _addresses.length; i++) {
            proportions[_addresses[i]] = _proportions[i];
        }
    }

    receive() external payable {
        for(uint i = 0; i < addresses.length; i++) {
            payable(addresses[i]).transfer(msg.value * proportions[addresses[i]] / 100);
        }
    }
}
