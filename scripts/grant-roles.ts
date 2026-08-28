#!/usr/bin/env node
import { network } from "hardhat";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log("Usage: npx hardhat run scripts/grant-roles.ts --network <network> -- <tokenAddress> <address> <role>");
    console.log("  role: MINT_ROLE | BURN_ROLE | UPGRADE_ROLE");
    process.exit(1);
  }

  const [tokenAddress, target, roleStr] = args;

  const { viem } = await network.create();
  const [client] = await viem.getWalletClients();
  const sender = client.account.address;

  const token = await viem.getContractAt("SimpleTokenUpgradeable", tokenAddress as `0x${string}`, {
    client: { wallet: client },
  });

  const roleMap: Record<string, `0x${string}`> = {
    MINT_ROLE: await token.read.MINT_ROLE(),
    BURN_ROLE: await token.read.BURN_ROLE(),
    UPGRADE_ROLE: await token.read.UPGRADE_ROLE(),
  };

  const role = roleMap[roleStr];
  if (!role) throw new Error(`Unknown role: ${roleStr}`);

  console.log(`Granting ${roleStr} (${role}) to ${target} on token ${tokenAddress}`);
  console.log(`Caller: ${sender}`);

  const hasAdmin = await token.read.hasRole([await token.read.DEFAULT_ADMIN_ROLE(), sender]);
  if (!hasAdmin) throw new Error(`Caller lacks DEFAULT_ADMIN_ROLE`);

  const tx = await token.write.grantRole([role, target as `0x${string}`]);
  await viem.getPublicClient().waitForTransactionReceipt({ hash: tx });
  console.log(`Done. ${target} now has ${roleStr}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});