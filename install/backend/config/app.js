require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  RPC_URL: process.env.RPC_URL || 'https://testnet-passet-hub-eth-rpc.polkadot.io',
  CHAIN_ID: process.env.CHAIN_ID || 420420422,
  
  // URLs del explorer
  BLOCKSCOUT_BASE: 'https://blockscout-passet-hub.parity-testnet.parity.io',
  
  // Configuraciones de seguridad
  CHALLENGE_EXPIRY_MINUTES: 5,
  MAX_TOKEN_SEARCH: 100,
  
  // Configuraciones WebAuthn
  WEBAUTHN_RP_NAME: 'EqualPass',
  WEBAUTHN_RP_ID: 'localhost', // En producción usar tu dominio
  
  // Configuraciones ZK
  CIRCUITS_DIR: 'circuits',
  WASM_FILE: 'eligibility_student_js/eligibility_student.wasm',
  ZKEY_FILE: 'eligibility_student.zkey',
  VKEY_FILE: 'verification_key.json'
};