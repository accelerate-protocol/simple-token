// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @title Simple Token Upgradeable
/// @author AXC Labs
/// @notice Upgradeable ERC20 token with role-based access control
contract SimpleTokenUpgradeable is Initializable, UUPSUpgradeable, ERC20Upgradeable, AccessControlUpgradeable {
    /// @notice Mint role identifier
    bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE");
    /// @notice Burn role identifier
    bytes32 public constant BURN_ROLE = keccak256("BURN_ROLE");
    /// @notice Upgrade role identifier
    bytes32 public constant UPGRADE_ROLE = keccak256("UPGRADE_ROLE");

    /// @notice Initialize the token
    /// @param name_ Token name
    /// @param symbol_ Token symbol
    /// @param initialSupply_ Initial supply
    function initialize(string memory name_, string memory symbol_, uint256 initialSupply_) public initializer {
        __ERC20_init(name_, symbol_);
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADE_ROLE, msg.sender);
        _mint(msg.sender, initialSupply_);
    }

    /// @notice Mint tokens to an address
    /// @param to Recipient address
    /// @param amount Amount to mint
    function mint(address to, uint256 amount) external onlyRole(MINT_ROLE) {
        _mint(to, amount);
    }

    /// @notice Burn tokens from an address
    /// @param from Address to burn from
    /// @param amount Amount to burn
    function burn(address from, uint256 amount) external onlyRole(BURN_ROLE) {
        _burn(from, amount);
    }

    /// @notice Upgrade to a new implementation
    /// @param newImplementation New implementation address
    function upgrade(address newImplementation) external onlyRole(UPGRADE_ROLE) {
        upgradeToAndCall(newImplementation, "");
    }

    /// @notice Authorize upgrade
    /// @param newImplementation New implementation address
    // solhint-disable-next-line no-empty-blocks
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADE_ROLE) {}
}
