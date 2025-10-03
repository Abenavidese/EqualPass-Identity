import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EqualPassModule = buildModule("EqualPassModule", (m) => {
  const equalPassBadge = m.contract("EqualPassIdentityBadge", []);

  return { equalPassBadge };
});

export default EqualPassModule;