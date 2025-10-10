// API configuration and helper functions for ZK-Scholar backend
const API_BASE = "http://localhost:3001/api";
const NFT_BASE = "http://localhost:3001";

// Types for API responses
export interface WebAuthnStatusResponse {
  hasCredential: boolean;
  credentialId?: string;
}

export interface MintResponse {
  success: boolean;
  verified?: boolean;
  webAuthnVerified?: boolean;
  securityLevel?: string;
  txHash?: string;
  blockscoutUrl?: string;
  tokenId?: number;
  error?: string;
}

export interface ContractInfoResponse {
  address: string;
  chainId: number;
}

export interface FraudResponse {
  fraudDetected: boolean;
  fraudSuccess: boolean;
  message: string;
  details?: {
    webAuthnPrevented: boolean;
  };
}

// WebAuthn Status Check
export async function checkWebAuthnStatus(userAddress: string): Promise<WebAuthnStatusResponse> {
  const response = await fetch(`${API_BASE}/webauthn/status/${userAddress}`);
  if (!response.ok) throw new Error("Error checking WebAuthn status");
  return response.json();
}

// WebAuthn Registration - Begin
export async function beginWebAuthnRegistration(userAddress: string) {
  const response = await fetch(`${API_BASE}/webauthn/register/begin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userAddress }),
  });
  if (!response.ok) throw new Error("Error starting WebAuthn registration");
  return response.json();
}

// WebAuthn Registration - Complete
export async function completeWebAuthnRegistration(userAddress: string, credential: any) {
  const response = await fetch(`${API_BASE}/webauthn/register/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userAddress, credential }),
  });
  if (!response.ok) throw new Error("Error completing WebAuthn registration");
  return response.json();
}

// WebAuthn Authentication - Begin
export async function beginWebAuthnAuthentication(userAddress: string) {
  const response = await fetch(`${API_BASE}/webauthn/authenticate/begin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userAddress }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error starting WebAuthn authentication");
  }
  return response.json();
}

// Mint Badge (Standard or with WebAuthn)
export async function mintBadge(data: {
  userAddress: string;
  studentStatus: string;
  enrollmentYear: string;
  universityHash: string;
  userSecret: string;
  requireWebAuthn?: boolean;
  webAuthnCredential?: any;
}): Promise<MintResponse> {
  const response = await fetch(`${API_BASE}/mint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error minting badge");
  return response.json();
}

// Simulate Fraud
export async function simulateFraud(userAddress: string): Promise<FraudResponse> {
  const response = await fetch(`${API_BASE}/demo-fraud`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userAddress,
      stolenCredential: "datos_robados_zkp",
    }),
  });
  if (!response.ok) throw new Error("Error simulating fraud");
  return response.json();
}

// Get Contract Info
export async function getContractInfo(): Promise<ContractInfoResponse> {
  const response = await fetch(`${API_BASE}/contract-info`);
  if (!response.ok) throw new Error("Error getting contract info");
  return response.json();
}

// Get NFT Image URL
export function getNFTImageUrl(): string {
  return `${NFT_BASE}/nft/nft.png`;
}
