// API Configuration for EqualPass Backend
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  NFT_BASE: 'http://localhost:3001',
  ENDPOINTS: {
    // WebAuthn
    WEBAUTHN_REGISTER_BEGIN: '/webauthn/register/begin',
    WEBAUTHN_REGISTER_COMPLETE: '/webauthn/register/complete',
    WEBAUTHN_AUTH_BEGIN: '/webauthn/authenticate/begin',
    WEBAUTHN_AUTH_COMPLETE: '/webauthn/authenticate/complete',
    WEBAUTHN_STATUS: '/webauthn/status',
    
    // ZK Proofs & Minting
    VERIFY_ZK: '/verify-zk',
    MINT: '/mint',
    
    // NFT
    METADATA: '/metadata',
    
    // Demo
    DEMO_FRAUD: '/demo-fraud',
    
    // Verifier
    GENERATE_CHALLENGE: '/generate-challenge',
    VERIFY_OWNERSHIP: '/verify-ownership',
  }
};

// Helper function to build API URLs
export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;

// Contract Configuration
export const CONTRACT_CONFIG = {
  address: '0x60E9b9fe1fb298299534a8aBafB628B1279DaaD3',
  chainId: 420420422,
  chainIdHex: '0x190f1b46',
  networkName: 'Paseo PassetHub',
  rpcUrl: 'https://testnet-passet-hub-eth-rpc.polkadot.io',
  currency: 'PAS',
  blockExplorer: 'https://blockscout-passet-hub.parity-testnet.parity.io'
};