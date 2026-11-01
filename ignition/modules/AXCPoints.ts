import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { encodeFunctionData, parseAbi } from "viem";
import ERC1967ProxyArtifact from "@openzeppelin/contracts/build/contracts/ERC1967Proxy.json";

const INITIAL_SUPPLY: bigint = 100_000_000n * 10n ** 18n;
export default buildModule("AXCPointsModule", (m) => {
  const ggt = m.contract("SimpleTokenUpgradeable");

  const initData = encodeFunctionData({
    abi: parseAbi([
      "function initialize(string name_, string symbol_, uint256 initialSupply_)",
    ]),
    functionName: "initialize",
    args: ["AXC Points", "AXCPOINTS", INITIAL_SUPPLY],
  });

  const proxyAdminOwner = m.getAccount(0);
  const proxy = m.contract("ERC1967Proxy",
  ERC1967ProxyArtifact,
  [
    ggt,
    initData,
  ]);

  return { proxy, ggt };
});
