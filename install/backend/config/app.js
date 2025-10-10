const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const globalEnvPath = path.resolve(__dirname, "../.env");

if (fs.existsSync(globalEnvPath)) {
  dotenv.config({ path: globalEnvPath });
  console.log("🧩 Cargando variables desde install/.env (modo local)");
} else {
  dotenv.config(); // busca .env local o usa variables de entorno
  console.log("☁️ Usando variables del entorno (Render u otro)");
}

module.exports = {
  PORT: process.env.BACKEND_PORT || process.env.PORT || 3001,
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3001",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  RPC_URL: process.env.RPC_URL || "https://testnet-passet-hub-eth-rpc.polkadot.io",
  CHAIN_ID: process.env.CHAIN_ID || 420420422,
  BLOCKSCOUT_BASE: "https://blockscout-passet-hub.parity-testnet.parity.io",
  CHALLENGE_EXPIRY_MINUTES: 5,
  MAX_TOKEN_SEARCH: 100,
  WEBAUTHN_RP_NAME: "ZK-Scholar",
  WEBAUTHN_RP_ID: new URL(process.env.FRONTEND_URL || "http://localhost:3000").hostname,
  CIRCUITS_DIR: "circuits",
  WASM_FILE: "eligibility_student_js/eligibility_student.wasm",
  ZKEY_FILE: "eligibility_student.zkey",
  VKEY_FILE: "verification_key.json",
};
