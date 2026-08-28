// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { Test } from "forge-std/Test.sol";
import { SimpleTokenUpgradeable } from "../contracts/SimpleTokenUpgradeable.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract SimpleTokenUpgradeableMintBurnTest is Test {
    SimpleTokenUpgradeable token;
    address owner = address(0x1);
    address minter = address(0x2);
    address burner = address(0x3);
    address recipient = address(0x4);
    address pauser = address(0x5);

    function setUp() public {
        token = new SimpleTokenUpgradeable();
        token.initialize("GGT", "GGT", 1000 ether);
        token.grantRole(token.MINT_ROLE(), minter);
        token.grantRole(token.BURN_ROLE(), burner);
        token.grantRole(token.PAUSE_ROLE(), pauser);
    }

    function setUpProxy() internal returns (SimpleTokenUpgradeable, address) {
        SimpleTokenUpgradeable impl = new SimpleTokenUpgradeable();
        bytes memory initData = abi.encodeWithSignature("initialize(string,string,uint256)", "GGT", "GGT", 1000 ether);
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
        SimpleTokenUpgradeable proxyToken = SimpleTokenUpgradeable(address(proxy));
        proxyToken.grantRole(proxyToken.MINT_ROLE(), minter);
        proxyToken.grantRole(proxyToken.BURN_ROLE(), burner);
        proxyToken.grantRole(proxyToken.PAUSE_ROLE(), pauser);
        proxyToken.grantRole(proxyToken.UPGRADE_ROLE(), owner);
        return (proxyToken, address(proxy));
    }

    function test_MintIncreasesBalance() public {
        vm.prank(minter);
        token.mint(recipient, 500 ether);
        assertEq(token.balanceOf(recipient), 500 ether);
        assertEq(token.totalSupply(), 1500 ether);
    }

    function test_BurnDecreasesBalance() public {
        vm.prank(minter);
        token.mint(recipient, 500 ether);
        vm.prank(burner);
        token.burn(recipient, 200 ether);
        assertEq(token.balanceOf(recipient), 300 ether);
        assertEq(token.totalSupply(), 1300 ether);
    }

    function test_MintOnlyMintRole() public {
        vm.prank(burner);
        vm.expectRevert();
        token.mint(recipient, 100 ether);
    }

    function test_BurnOnlyBurnRole() public {
        vm.prank(minter);
        vm.expectRevert();
        token.burn(recipient, 100 ether);
    }

    function test_UpgradeWithRole() public {
        SimpleTokenUpgradeable newImpl = new SimpleTokenUpgradeable();
        (SimpleTokenUpgradeable proxyToken, ) = setUpProxy();
        vm.prank(owner);
        proxyToken.upgrade(address(newImpl));
    }

    function test_UpgradeWithoutRoleReverts() public {
        SimpleTokenUpgradeable newImpl = new SimpleTokenUpgradeable();
        (SimpleTokenUpgradeable proxyToken, ) = setUpProxy();
        vm.prank(burner);
        vm.expectRevert();
        proxyToken.upgrade(address(newImpl));
    }

    function test_AuthorizeUpgradeWithoutRoleReverts() public {
        SimpleTokenUpgradeable newImpl = new SimpleTokenUpgradeable();
        (SimpleTokenUpgradeable proxyToken, ) = setUpProxy();
        vm.prank(minter);
        vm.expectRevert();
        proxyToken.upgrade(address(newImpl));
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
        vm.prank(minter);
        token.mint(recipient, 100 ether);
        vm.prank(recipient);
        token.transfer(owner, 50 ether);
        assertEq(token.balanceOf(recipient), 50 ether);
    }

    function test_PauseWithoutRoleReverts() public {
        vm.prank(minter);
        vm.expectRevert();
        token.pause();
    }

    function test_UnpauseWithoutRoleReverts() public {
        vm.prank(pauser);
        token.pause();
        vm.prank(minter);
        vm.expectRevert();
        token.unpause();
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
}
