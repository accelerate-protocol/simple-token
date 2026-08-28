#!/usr/bin/env node
import { network } from "hardhat";
import { parseAbi } from "viem";

const SIMPLE_TOKEN_ABI = parseAbi([
  "function mint(address to, uint256 amount) external",
  "function burn(address from, uint256 amount) external",
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function MINT_ROLE() view returns (bytes32)",
  "function BURN_ROLE() view returns (bytes32)",
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function grantRole(bytes32 role, address account) external",
]);

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log("Usage: npx hardhat run scripts/mint-burn.ts --network <network> -- <mint|burn> <tokenAddress> <amount> [to/from]");
    console.log("  mint:  npx hardhat run scripts/mint-burn.ts --network baseSepolia -- mint 0xToken 1000 [toAddress]");
    console.log("  burn:  npx hardhat run scripts/mint-burn.ts --network baseSepolia -- burn 0xToken 1000 [fromAddress]");
    process.exit(1);
  }

  const [action, tokenAddress, amountStr, targetAddress] = args;
  const amount = BigInt(amountStr);

  const { viem } = await network.create();
  const [client] = await viem.getWalletClients();
  const sender = client.account.address;

  const token = await viem.getContractAt("SimpleTokenUpgradeable", tokenAddress as `0x${string}`, {
    client: { wallet: client },
  });

  console.log(`Network: ${(await viem.getPublicClient()).chain?.name}`);
  console.log(`Sender:  ${sender}`);
  console.log(`Token:   ${tokenAddress}`);
  console.log(`Action:  ${action} ${amount}`);

  // Check roles
  const mintRole = await token.read.MINT_ROLE();
  const burnRole = await token.read.BURN_ROLE();
  const hasMint = await token.read.hasRole([mintRole, sender]);
  const hasBurn = await token.read.hasRole([burnRole, sender]);

  if (action === "mint") {
    if (!hasMint) throw new Error(`Sender lacks MINT_ROLE`);
    const to = targetAddress as `0x${string}` || sender;
    console.log(`Minting to: ${to}`);
    const tx = await token.write.mint([to, amount]);
    await viem.getPublicClient().waitForTransactionReceipt({ hash: tx });
    console.log(`Minted ${amount} to ${to}. New balance: ${await token.read.balanceOf([to])}`);
  } else if (action === "burn") {
    if (!hasBurn) throw new Error(`Sender lacks BURN_ROLE`);
    const from = targetAddress as `0x${string}` || sender;
    console.log(`Burning from: ${from}`);
    const tx = await token.write.burn([from, amount]);
    await viem.getPublicClient().waitForTransactionReceipt({ hash: tx });
    console.log(`Burned ${amount} from ${from}. New balance: ${await token.read.balanceOf([from])}`);
  } else {
    throw new Error(`Unknown action: ${action}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});