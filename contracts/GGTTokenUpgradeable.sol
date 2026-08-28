// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GGTTokenUpgradeable is Initializable, UUPSUpgradeable, OwnableUpgradeable, ERC20Upgradeable {
    function initialize(string memory name_, string memory symbol_, uint256 initialSupply_) public initializer {
        __ERC20_init(name_, symbol_);
        __Ownable_init(msg.sender);
        _mint(msg.sender, initialSupply_);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}