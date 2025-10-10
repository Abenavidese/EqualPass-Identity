import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ZK-ScholarModule = buildModule("ZK-ScholarModule", (m) => {
  const ZK-ScholarBadge = m.contract("ZK-ScholarIdentityBadge", []);

  return { ZK-ScholarBadge };
});

export default ZK-ScholarModule;