import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GGTTokenModule", (m) => {
  const ggtToken = m.contract("GGTTokenUpgradeable", [
    "GGT Token",
    "GGT",
    1000000 * 10 ** 6, // initial supply
  ]);

  return { ggtToken };
});