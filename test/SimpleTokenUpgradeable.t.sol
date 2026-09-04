// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { Test } from "forge-std/Test.sol";
import { SimpleTokenUpgradeable } from "../contracts/SimpleTokenUpgradeable.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/// @dev Dummy implementation for testing successful upgrades
contract SimpleTokenUpgradeableV2 is SimpleTokenUpgradeable {
    uint256 public constant VERSION = 2;
}

contract SimpleTokenUpgradeableTest is Test {
    SimpleTokenUpgradeable token;
    address owner = address(0x1);
    address minter = address(0x2);
    address burner = address(0x3);
    address recipient = address(0x4);
    address pauser = address(0x5);

    function setUp() public {
        SimpleTokenUpgradeable impl = new SimpleTokenUpgradeable();
        bytes memory initData = abi.encodeWithSelector(
            SimpleTokenUpgradeable.initialize.selector,
            "GGT",
            "GGT",
            1000 ether
        );
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
        token = SimpleTokenUpgradeable(address(proxy));
        token.grantRole(token.MINT_ROLE(), minter);
        token.grantRole(token.BURN_ROLE(), burner);
        token.grantRole(token.PAUSE_ROLE(), pauser);
    }

    function test_MintIncreasesBalance() public {
        vm.prank(minter);
        token.mint(minter, 500 ether);
        assertEq(token.balanceOf(minter), 500 ether);
        assertEq(token.totalSupply(), 1500 ether);
    }

    function test_BurnDecreasesBalance() public {
        vm.prank(minter);
        token.mint(minter, 500 ether);
        vm.prank(burner);
        token.burn(minter, 200 ether);
        assertEq(token.balanceOf(minter), 300 ether);
        assertEq(token.totalSupply(), 1300 ether);
    }

    function test_MintOnlyMintRole() public {
        vm.prank(burner);
        vm.expectRevert();
        token.mint(recipient, 100 ether);
    }

    function test_MintOnlyToSender() public {
        vm.prank(minter);
        vm.expectRevert("mint to sender");
        token.mint(recipient, 100 ether);
    }

    function test_BurnOnlyBurnRole() public {
        vm.prank(minter);
        vm.expectRevert();
        token.burn(recipient, 100 ether);
    }

    function test_PauseBlocksTransfers() public {
        vm.prank(pauser);
        token.pause();
        vm.expectRevert();
        vm.prank(owner);
        token.transfer(recipient, 100 ether);
    }

    function test_UnpauseRestoresTransfers() public {
        vm.prank(pauser);
        token.pause();
        vm.prank(pauser);
        token.unpause();
        token.transfer(recipient, 100 ether);
        vm.prank(recipient);
        token.transfer(address(this), 50 ether);
        assertEq(token.balanceOf(recipient), 50 ether);
    }

    function test_PauseWithoutRoleReverts() public {
        vm.prank(minter);
        vm.expectRevert();
        token.pause();
    }

    function test_PausedBlocksMint() public {
        vm.prank(pauser);
        token.pause();
        vm.prank(minter);
        vm.expectRevert();
        token.mint(recipient, 100 ether);
    }

    function test_PausedBlocksBurn() public {
        vm.prank(pauser);
        token.pause();
        vm.prank(burner);
        vm.expectRevert();
        token.burn(owner, 100 ether);
    }

    function test_UpgradeWithoutUpgradeRoleReverts() public {
        SimpleTokenUpgradeableV2 newImpl = new SimpleTokenUpgradeableV2();
        vm.prank(minter);
        vm.expectRevert();
        token.upgrade(address(newImpl));
    }

    function test_UpgradeWithRoleSucceeds() public {
        SimpleTokenUpgradeableV2 newImpl = new SimpleTokenUpgradeableV2();
        token.upgrade(address(newImpl));
        // Verify the implementation changed by calling a function only on V2
        assertEq(SimpleTokenUpgradeableV2(address(token)).VERSION(), 2);
    }

    function test_UnpauseWithoutRoleReverts() public {
        vm.prank(pauser);
        token.pause();
        vm.prank(minter);
        vm.expectRevert();
        token.unpause();
    }
}
