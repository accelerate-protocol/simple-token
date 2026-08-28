# GGT Token — Hardhat 3 Upgradeable ERC20

Upgradeable ERC20 token with role-based access control (MINT, BURN, UPGRADE, PAUSE), built with Hardhat 3, viem, and OpenZeppelin Upgradeable contracts.

## Project Layout

```
contracts/        Solidity source: SimpleTokenUpgradeable.sol
test/             Solidity unit tests (forge-std): SimpleTokenUpgradeable.t.sol
ignition/         Hardhat Ignition deployment modules
scripts/          Standalone viem scripts: grant-roles.ts, mint-burn.ts
hardhat.config.ts
```

## Networks (hardhat.config.ts)

| Network | Type | Chain ID |
| --------- | ------ | ---------- |
| hardhatMainnet | edr-simulated L1 | 31337 |
| hardhatOp | edr-simulated OP | 31337 |
| baseMainnet | http | 8453 |
| baseSepolia | http | 84532 |
| bscTestnet | http | 97 |
| bscMainnet | http | 56 |
| localhost | http | 31337 |

Environment variables (see `.env` and `.env.example`): `BASEMAIN_PRIVATE_KEY`, `BASETEST_PRIVATE_KEY`, `BSCTEST_PRIVATE_KEY`, `BSCMAIN_PRIVATE_KEY`, `ETHERSCAN_API_KEY`, `COINMARKETCAP_API_KEY`.

## Commands

```bash
# Compile
npm run compile

# Lint Solidity
npm run lint

# Run tests (Solidity only)
npm run test

# Coverage
npm run test:coverage

# Gas report
npm run test:gas

# Deploy locally
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/GGTToken.ts --network localhost

# Deploy to baseSepolia
npx hardhat ignition deploy ./ignition/modules/GGTToken.ts --network baseSepolia

# Deploy to bscTestnet
npx hardhat ignition deploy ./ignition/modules/GGTToken.ts --network bscTestnet

# Run scripts
npx hardhat run scripts/grant-roles.ts --network <network>
npx hardhat run scripts/mint-burn.ts --network <network>
```

## Contract

`SimpleTokenUpgradeable` — UUPS upgradeable, ERC20Pausable, AccessControl. Roles: `DEFAULT_ADMIN_ROLE`, `MINT_ROLE`, `BURN_ROLE`, `UPGRADE_ROLE`, `PAUSE_ROLE`. Initialize with name, symbol, initialSupply.
