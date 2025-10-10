import { getApiUrl, CONTRACT_CONFIG } from './api-config';

// Helper functions for base64url conversion
function base64urlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binary = atob(padded);
  return new Uint8Array(binary.split('').map(char => char.charCodeAt(0)));
}

function uint8ArrayToBase64url(uint8Array: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...uint8Array));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// API Functions
export const equalPassApi = {
  // Check WebAuthn status
  async checkWebAuthnStatus(userAddress: string) {
    try {
      const response = await fetch(`${getApiUrl('/webauthn/status')}/${userAddress}`);
      return await response.json();
    } catch (error) {
      console.error('Error checking WebAuthn status:', error);
      throw error;
    }
  },

  // Register WebAuthn device
  async registerWebAuthn(userAddress: string) {
    try {
      // Step 1: Begin registration
      const beginResponse = await fetch(getApiUrl('/webauthn/register/begin'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress })
      });

      if (!beginResponse.ok) {
        const error = await beginResponse.json();
        throw new Error(error.error);
      }

      const options = await beginResponse.json();

      // Step 2: Create credential
      const credential = await navigator.credentials.create({
        publicKey: {
          ...options,
          challenge: base64urlToUint8Array(options.challenge),
          user: {
            ...options.user,
            id: base64urlToUint8Array(options.user.id)
          },
          excludeCredentials: options.excludeCredentials?.map((cred: any) => ({
            ...cred,
            id: base64urlToUint8Array(cred.id)
          }))
        }
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('No se pudo crear la credencial');
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      // Step 3: Finish registration
      const finishResponse = await fetch(getApiUrl('/webauthn/register/complete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress,
          credential: {
            id: credential.id,
            rawId: uint8ArrayToBase64url(new Uint8Array(credential.rawId)),
            response: {
              attestationObject: uint8ArrayToBase64url(new Uint8Array(response.attestationObject)),
              clientDataJSON: uint8ArrayToBase64url(new Uint8Array(response.clientDataJSON))
            },
            type: credential.type
          }
        })
      });

      const result = await finishResponse.json();
      
      if (result.success) {
        // Save to localStorage
        localStorage.setItem(`webauthn_registered_${userAddress}`, 'true');
      }

      // Return result with verified flag for compatibility
      return { ...result, verified: result.success };
    } catch (error) {
      console.error('Error registering WebAuthn:', error);
      throw error;
    }
  },

  // Generate ZK Proof (standard mint)
  async generateZKProof(studentData: {
    userAddress: string;
    studentStatus: string;
    enrollmentYear: string;
    universityHash: string;
    userSecret: string;
  }) {
    try {
      const response = await fetch(getApiUrl('/mint'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      return await response.json();
    } catch (error) {
      console.error('Error generating ZK proof:', error);
      throw error;
    }
  },

  // Mint with WebAuthn (high security)
  async mintWithWebAuthn(studentData: {
    userAddress: string;
    studentStatus: string;
    enrollmentYear: string;
    universityHash: string;
    userSecret: string;
  }) {
    try {
      // Step 1: Begin authentication
      const beginResponse = await fetch(getApiUrl('/webauthn/authenticate/begin'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: studentData.userAddress })
      });

      if (!beginResponse.ok) {
        const error = await beginResponse.json();
        throw new Error(error.error);
      }

      const options = await beginResponse.json();

      // Step 2: Authenticate
      const credential = await navigator.credentials.get({
        publicKey: {
          ...options,
          challenge: base64urlToUint8Array(options.challenge),
          allowCredentials: options.allowCredentials.map((cred: any) => ({
            ...cred,
            id: base64urlToUint8Array(cred.id)
          }))
        }
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Autenticación WebAuthn cancelada');
      }

      const response = credential.response as AuthenticatorAssertionResponse;

      // Step 3: Mint with WebAuthn verification
      const mintResponse = await fetch(getApiUrl('/mint'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...studentData,
          requireWebAuthn: true,
          webAuthnCredential: {
            id: credential.id,
            response: {
              clientDataJSON: uint8ArrayToBase64url(new Uint8Array(response.clientDataJSON)),
              authenticatorData: uint8ArrayToBase64url(new Uint8Array(response.authenticatorData)),
              signature: uint8ArrayToBase64url(new Uint8Array(response.signature))
            }
          }
        })
      });

      return await mintResponse.json();
    } catch (error) {
      console.error('Error minting with WebAuthn:', error);
      throw error;
    }
  },

  // Simulate fraud attempt
  async simulateFraud(userAddress: string) {
    try {
      const response = await fetch(getApiUrl('/demo-fraud'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userAddress,
          stolenCredential: "datos_robados_zkp"
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error simulating fraud:', error);
      throw error;
    }
  },

  // Verifier functions
  async generateChallenge(verifierInfo: { verifierName: string; purpose: string }) {
    try {
      const response = await fetch(getApiUrl('/generate-challenge'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifierInfo)
      });

      return await response.json();
    } catch (error) {
      console.error('Error generating challenge:', error);
      throw error;
    }
  },

  async verifyOwnership(verificationData: {
    challengeId: string;
    signature: string;
    walletAddress: string;
    verifierName?: string;
    purpose?: string;
  }) {
    try {
      const response = await fetch(getApiUrl('/verify-ownership'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Error en verificación');
      }

      // Transform the backend response to match our expected format
      return {
        success: result.verified,
        verified: result.verified,
        isStudent: result.isStudent,
        walletAddress: result.walletAddress,
        badges: result.studentBadges?.map((badge: any) => ({
          tokenId: badge.tokenId?.toString() || badge.id?.toString() || 'N/A',
          badgeType: badge.badgeType || 'Student Credential',
          securityLevel: result.securityLevel || 'Standard',
          issuedAt: badge.issuedAt || new Date().toISOString()
        })) || [],
        totalBadges: result.totalBadges || 0,
        securityLevel: result.securityLevel,
        hasWebAuthn: result.hasWebAuthn,
        verificationDetails: result.verificationLevel,
        message: result.summary
      };
    } catch (error) {
      console.error('Error verifying ownership:', error);
      throw error;
    }
  },

  // Simple verification by token ID or address
  async verifyByTokenId(tokenId: string) {
    try {
      // Try to get NFT metadata first
      const metadataResponse = await fetch(`${getApiUrl('')}/metadata/${tokenId}`);
      if (!metadataResponse.ok) {
        throw new Error('Token no encontrado');
      }

      const metadata = await metadataResponse.json();
      
      // Simulate getting token info from contract
      return {
        verified: true,
        tokenId: tokenId,
        owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // This would come from contract
        badgeType: 'Student Credential',
        securityLevel: 'High',
        issuedAt: new Date().toISOString(),
        metadata: metadata
      };
    } catch (error) {
      console.error('Error verifying by token ID:', error);
      throw error;
    }
  },

  async verifyByAddress(address: string) {
    try {
      // This would query the contract for badges owned by this address
      // For now, we'll simulate the response
      return {
        verified: true,
        address: address,
        badges: [
          {
            tokenId: '1',
            badgeType: 'Student Credential',
            securityLevel: 'High',
            issuedAt: new Date().toISOString()
          }
        ]
      };
    } catch (error) {
      console.error('Error verifying by address:', error);
      throw error;
    }
  }
};

// MetaMask Integration
export const metaMaskHelpers = {
  async switchToPolkadotNetwork() {
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado');
    }

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CONTRACT_CONFIG.chainIdHex }],
      });
      return true;
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: CONTRACT_CONFIG.chainIdHex,
              chainName: CONTRACT_CONFIG.networkName,
              nativeCurrency: {
                name: CONTRACT_CONFIG.currency,
                symbol: CONTRACT_CONFIG.currency,
                decimals: 18
              },
              rpcUrls: [CONTRACT_CONFIG.rpcUrl],
              blockExplorerUrls: [CONTRACT_CONFIG.blockExplorer]
            }]
          });
          return true;
        } catch (addError) {
          console.error('Error adding network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching network:', switchError);
        throw switchError;
      }
    }
  },

  async addNFTToWallet(tokenId: string) {
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado');
    }

    try {
      // First ensure we're on the right network
      await this.switchToPolkadotNetwork();

      // Then try to add the NFT
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: CONTRACT_CONFIG.address,
            tokenId: tokenId,
            symbol: 'EPIB',
            image: `${getApiUrl('')}/nft/nft.png`
          }
        }
      });
      return true;
    } catch (error) {
      console.error('Error adding NFT to wallet:', error);
      return false;
    }
  }
};