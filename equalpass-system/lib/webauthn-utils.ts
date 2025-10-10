// Utils universales (Node + Browser) para base64url
export function base64urlToUint8Array(base64url: string): Uint8Array {
  const base64 =
    base64url.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (base64url.length % 4)) % 4);
  if (typeof window === "undefined") {
    const buf = Buffer.from(base64, "base64");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  } else {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
}

export function uint8ArrayToBase64url(bytes: Uint8Array): string {
  if (typeof window === "undefined") {
    const b64 = Buffer.from(bytes).toString("base64");
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  } else {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const b64 = btoa(binary);
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
}

// Copiar al portapapeles con fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback (solo browser)
    if (typeof document !== "undefined") {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Agregar un NFT (ERC-721) a MetaMask
export async function addNFTToMetaMask(opts: {
  address: `0x${string}`;
  tokenId: string;
  image?: string;
  chainIdHex?: string; // ej: "0x6969a" para Paseo si lo usas; opcional
}): Promise<boolean> {
  const eth = (globalThis as any)?.ethereum;
  if (!eth?.request) throw new Error("MetaMask no está disponible");

  // Cambiar de red si se indica (opcional)
  if (opts.chainIdHex) {
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: opts.chainIdHex }],
      });
    } catch (e: any) {
      if (e?.code === 4902) {
        // La red no existe en MM; aquí podrías llamar a wallet_addEthereumChain con tu config
        // await eth.request({ method: "wallet_addEthereumChain", params: [ { chainId: opts.chainIdHex, ... } ] })
      } else {
        throw e;
      }
    }
  }

  // MetaMask soporta watchAsset para ERC721
  const added = await eth.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC721",
      options: {
        address: opts.address,
        tokenId: opts.tokenId,
        image: opts.image,
      },
    },
  });
  return !!added;
}
