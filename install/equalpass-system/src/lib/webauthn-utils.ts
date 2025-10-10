// WebAuthn utility functions for base64url conversion

export function base64urlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  return new Uint8Array(binary.split("").map((char) => char.charCodeAt(0)));
}

export function uint8ArrayToBase64url(uint8Array: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...uint8Array));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

// MetaMask integration functions
export async function addNFTToMetaMask(contractAddress: string, tokenId: number): Promise<boolean> {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask no detectado");
  }

  // Check if we're on the correct network
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId !== "0x190f1b46") {
    // 420420422 in hex
    const shouldSwitch = window.confirm(
      "⚠️ Necesitas estar en la red Paseo PassetHub.\n¿Quieres cambiar automáticamente?"
    );
    if (shouldSwitch) {
      await switchToPolkadotNetwork();
    } else {
      return false;
    }
  }

  // Try to add the NFT
  const wasAdded = await window.ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC721",
      options: {
        address: contractAddress,
        tokenId: tokenId.toString(),
        name: `ZK-Scholar Student Badge #${tokenId}`,
        description: "Credencial estudiantil verificada con Zero-Knowledge Proofs y WebAuthn",
        image: `${process.env.NEXT_PUBLIC_NFT_BASE_URL || "http://localhost:3001"}/nft/nft.png`,
      },
    },
  });

  return wasAdded;
}

export async function switchToPolkadotNetwork(): Promise<void> {
  try {
    // Try to switch to Polkadot Paseo network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x190f1b46" }], // 420420422 in hex
    });
  } catch (switchError: any) {
    // If the network doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x190f1b46",
            chainName: "Paseo PassetHub",
            nativeCurrency: {
              name: "PAS",
              symbol: "PAS",
              decimals: 18,
            },
            rpcUrls: ["https://testnet-passet-hub-eth-rpc.polkadot.io"],
            blockExplorerUrls: ["https://blockscout-passet-hub.parity-testnet.parity.io"],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
