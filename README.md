# Sample Hardhat 3 Project (`node:test` and `viem`)

This project showcases a Hardhat 3 project using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.

To learn more about Hardhat 3, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3](https://hardhat.org/hardhat3-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

## Project Overview

This example project includes:

- A simple Hardhat configuration file.
- Foundry-compatible Solidity unit tests (`test/*.t.sol`).
- TypeScript integration via `viem` (scripts / Ignition).
- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
```

### Test Coverage

To run tests with coverage report:

```shell
npx hardhat test --coverage
```

Or use the npm script:

```shell
npm run test:coverage
```

Coverage results are generated in the `coverage/` directory. Open `coverage/html/index.html` in a browser to view the detailed line-by-line coverage report.

### Gas Reporting

To run tests with gas report, set the `REPORT_GAS` environment variable:

```shell
npx hardhat test --gas-stats
```

Or use the npm script:

```shell
npm run test:gas
```

The gas report will be displayed in the terminal output.

### Make a deployment to localhost

```shell
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/GGTToken.ts --network localhost
```

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to Sepolia, you need an account with funds to send the transaction. The `bscTestnet` network uses `BSCTEST_PRIVATE_KEY`. To deploy to `baseSepolia` set `BASETEST_PRIVATE_KEY`.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `BASETEST_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set BASETEST_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network baseSepolia ignition/modules/GGTToken.ts
```
