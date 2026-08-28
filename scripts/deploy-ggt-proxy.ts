/**
 * Deploy GGTTokenUpgradeable via ERC1967 UUPS proxy using viem.
 * Reads OpenZeppelin artifact directly from node_modules.
 *
 * Usage:
 *   npx hardhat node        (terminal 1)
 *   npx hardhat run scripts/deploy-ggt-proxy.ts --network localhost   (terminal 2)
 */
import { parseAbi, encodeFunctionData, createWalletClient, http, encodeDeployData } from "viem";
import { network } from "hardhat";
import { readFileSync } from "fs";
import { join } from "path";

async function main() {
  const { viem } = await network.create();
  const [deployer] = await viem.getWalletClients();
  console.log(`Deploying from: ${deployer.account.address}`);

  // 1. Deploy implementation
  const impl = await viem.deployContract("GGTTokenUpgradeable");
  console.log(`Implementation: ${impl.address}`);

  // 2. Load ERC1967Proxy artifact from OZ in node_modules
  const ozProxyPath = join(process.cwd(), "node_modules/@openzeppelin/contracts/build/contracts/ERC1967Proxy.json");
  const proxyArtifact = JSON.parse(readFileSync(ozProxyPath, "utf8"));

  // 3. Encode initialize call
  const initData = encodeFunctionData({
    abi: [
      { type: "function", name: "initialize", inputs: [
        { name: "name_", type: "string" },
        { name: "symbol_", type: "string" },
        { name: "initialSupply_", type: "uint256" },
      ] },
    ],
    functionName: "initialize",
    args: ["GGT Token", "GGT", 1_000_000n * 10n ** 6n],
  });

  // 4. Deploy proxy via raw wallet tx (Creation code = ctor-args prepended to bytecode)
  const ctorArgs = encodeFunctionData({
    abi: [
      { type: "constructor", stateMutability: "payable", inputs: [
        { name: "implementation", type: "address" },
        { name: "_data", type: "bytes" },
      ] },
    ],
    functionName: "constructor",
    args: [impl.address, initData],
  });
  const deploymentData = (proxyArtifact.bytecode as `0x${string}`) + ctorArgs.slice(2);

  const { createPublicClient } = await import("viem");
  const hash = await deployer.sendTransaction({
    data: deploymentData as `0x${string}`,
  });
  const receipt = await viem.getPublicClient().waitForTransactionReceipt({ hash });
  const proxyAddress = receipt.contractAddress!;
  console.log(`Proxy: ${proxyAddress}`);

  // 5. Interact via proxy
  const ggt = await viem.getContractAt("GGTTokenUpgradeable", proxyAddress);
  
  console.log(`Name:    ${await ggt.read.name()}`);
  console.log(`Symbol:  ${await ggt.read.symbol()}`);
  console.log(`Total supply: ${await ggt.read.totalSupply()}`);
  console.log(`Deployer balance: ${await ggt.read.balanceOf([deployer.account.address])}`);
  console.log(`Admin role: ${await ggt.read.hasRole([await ggt.read.DEFAULT_ADMIN_ROLE(), deployer.account.address])}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});