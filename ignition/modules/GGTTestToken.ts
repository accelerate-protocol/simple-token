import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { encodeFunctionData, parseAbi } from "viem";
import ERC1967ProxyArtifact from "@openzeppelin/contracts/build/contracts/ERC1967Proxy.json";

export default buildModule("GGTTokenModule", (m) => {
  const ggt = m.contract("SimpleTokenUpgradeable");

  const initData = encodeFunctionData({
    abi: parseAbi([
      "function initialize(string name_, string symbol_, uint256 initialSupply_)",
    ]),
    functionName: "initialize",
    args: ["GGT Test Token", "GGT", 0],
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
