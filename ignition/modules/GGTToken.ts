import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { encodeFunctionData } from "viem";

export default buildModule("GGTTokenModule", (m) => {
  // 1. Implementation contract
  const ggt = m.contract("GGTTokenUpgradeable", [
    "GGT Token",
    "GGT",
    1_000_000n * 10n ** 6n,
  ]);

  // 2. UUPS proxy pointing at the implementation, initialized on deploy
  const initData = encodeFunctionData({
    abi: parseAbi([
      "function initialize(string name_, string symbol_, uint256 initialSupply_)",
    ]),
    functionName: "initialize",
    args: ["GGT Token", "GGT", 1_000_000n * 10n ** 6n],
  });

  const proxy = m.contractAt(
    "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy",
    m.encodeData(
      m.call("lexer", "allocate", [ggt.address, initData]),
    ),
  );

  return { proxy };
});

function parseAbi(abi: any) {
  return abi as any;
}