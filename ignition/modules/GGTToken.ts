import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { encodeFunctionData, parseAbi } from "viem";
import ERC1967ProxyArtifact from "@openzeppelin/contracts/build/contracts/ERC1967Proxy.json";

export default buildModule("GGTTokenModule", (m) => {
  const ggt = m.contract("GGTTokenUpgradeable");

  const initData = encodeFunctionData({
    abi: parseAbi([
      "function initialize(string name_, string symbol_, uint256 initialSupply_)",
    ]),
    functionName: "initialize",
    args: ["GGT Token", "GGT", 1_000_000n * 10n ** 6n],
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
