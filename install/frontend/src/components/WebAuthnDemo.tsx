import React, { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Message } from "./ui/Message";
import { NFTCard } from "./ui/NFTCard";

const API_BASE = "http://localhost:3001/api";
const NFT_BASE = "http://localhost:3001";

function base64urlToUint8Array(base64url: string) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = window.atob(padded);
  return new Uint8Array(Array.from(binary).map((c) => c.charCodeAt(0)));
}

function uint8ArrayToBase64url(uint8Array: Uint8Array) {
  const base64 = window.btoa(String.fromCharCode(...Array.from(uint8Array)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export const WebAuthnDemo: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string>("0x6388681e6A22F8Fc30e3150733795255D4250db1");
  const [studentStatus, setStudentStatus] = useState<string>("1");
  const [enrollmentYear, setEnrollmentYear] = useState<string>("2025");
  const [universityHash, setUniversityHash] = useState<string>("12345");
  const [userSecret, setUserSecret] = useState<string>("67890");
  const [lastTokenId, setLastTokenId] = useState<number | null>(null);
  const [messages, setMessages] = useState<
    Record<string, { text: string; type?: "info" | "success" | "error" }>
  >({});

  const [nftImageSrc, setNftImageSrc] = useState<string | null>(null);
  const [nftTokenId, setNftTokenId] = useState<number | null>(null);
  const [nftContract, setNftContract] = useState<string | null>(null);

  // loading states for UX polish
  const [registerLoading, setRegisterLoading] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [mintSecureLoading, setMintSecureLoading] = useState(false);
  const [fraudLoading, setFraudLoading] = useState(false);
  const [nftLoading, setNftLoading] = useState(false);

  function showMessage(key: string, text: string, type: "info" | "success" | "error" = "info") {
    setMessages((m) => ({ ...m, [key]: { text, type } }));
  }

  function getMsgClass(key: string) {
    const t = messages[key]?.type;
    if (t === "error") return "text-red-600";
    if (t === "success") return "text-green-600";
    return "text-gray-600";
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/webauthn/status/${userAddress}`);
        if (res.ok) {
          const d = await res.json();
          showMessage(
            "status",
            d.hasCredential ? "✅ Dispositivo registrado" : "⚠️ Dispositivo no registrado"
          );
        }
      } catch (e: any) {
        showMessage("status", `Error: ${e.message}`);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getStudentData() {
    return {
      userAddress,
      studentStatus,
      enrollmentYear,
      universityHash,
      userSecret,
    };
  }

  async function registerWebAuthn() {
    if (!userAddress) return alert("Ingresa dirección");
    try {
      setRegisterLoading(true);
      const beginResp = await fetch(`${API_BASE}/webauthn/register/begin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress }),
      });
      const options = await beginResp.json();
      const credential = (await navigator.credentials.create({
        publicKey: {
          ...options,
          challenge: base64urlToUint8Array(options.challenge),
          user: { ...options.user, id: base64urlToUint8Array(options.user.id) },
        },
      })) as any;
      const completeResp = await fetch(`${API_BASE}/webauthn/register/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress,
          credential: {
            id: credential.id,
            response: {
              clientDataJSON: uint8ArrayToBase64url(new Uint8Array(credential.response.clientDataJSON)),
              publicKey: uint8ArrayToBase64url(new Uint8Array(credential.response.getPublicKey())),
            },
          },
        }),
      });
      const result = await completeResp.json();
      showMessage("register", `Dispositivo registrado. ID: ${result.credentialId}`, "success");
    } catch (err: any) {
      console.error(err);
      showMessage("register", `Error: ${err.message}`, "error");
    } finally {
      setRegisterLoading(false);
    }
  }

  async function mintStandard() {
    try {
      setMintLoading(true);
      showMessage("mintStandard", "Generando prueba ZK...", "info");
      const r = await fetch(`${API_BASE}/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getStudentData()),
      });
      const res = await r.json();
      showMessage(
        "mintStandard",
        `${res.success ? "Badge minteado" : "Error"} — Nivel: ${res.securityLevel || "STANDARD"}`,
        res.success ? "success" : "error"
      );
      if (res.success) {
        setLastTokenId(res.tokenId);
      }
    } catch (e: any) {
      showMessage("mintStandard", `Error: ${e.message}`, "error");
    } finally {
      setMintLoading(false);
    }
  }

  async function mintWithWebAuthn() {
    try {
      setMintSecureLoading(true);
      const beginResponse = await fetch(`${API_BASE}/webauthn/authenticate/begin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress }),
      });
      if (!beginResponse.ok) {
        const e = await beginResponse.json();
        throw new Error(e.error);
      }
      const options = await beginResponse.json();
      const credential = (await navigator.credentials.get({
        publicKey: {
          ...options,
          challenge: base64urlToUint8Array(options.challenge),
          allowCredentials: options.allowCredentials.map((c: any) => ({
            ...c,
            id: base64urlToUint8Array(c.id),
          })),
        },
      })) as any;
      const mintResponse = await fetch(`${API_BASE}/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...getStudentData(),
          requireWebAuthn: true,
          webAuthnCredential: {
            id: credential.id,
            response: {
              clientDataJSON: uint8ArrayToBase64url(new Uint8Array(credential.response.clientDataJSON)),
              authenticatorData: uint8ArrayToBase64url(new Uint8Array(credential.response.authenticatorData)),
              signature: uint8ArrayToBase64url(new Uint8Array(credential.response.signature)),
            },
          },
        }),
      });
      const result = await mintResponse.json();
      showMessage(
        "mintSecure",
        `${result.success ? "Badge minteado con ALTA SEGURIDAD" : "Error"} — ZK: ${
          result.verified ? "✅" : "❌"
        } — WebAuthn: ${result.webAuthnVerified ? "✅" : "❌"}`,
        result.success ? "success" : "error"
      );
      if (result.success) {
        setLastTokenId(result.tokenId);
      }
    } catch (err: any) {
      console.error(err);
      showMessage("mintSecure", `Error: ${err.message}`, "error");
    } finally {
      setMintSecureLoading(false);
    }
  }

  async function simulateFraud() {
    try {
      setFraudLoading(true);
      const r = await fetch(`${API_BASE}/demo-fraud`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress, stolenCredential: "datos_robados_zkp" }),
      });
      const res = await r.json();
      showMessage(
        "fraud",
        `Fraude detectado: ${res.fraudDetected ? "✅" : "❌"} — Éxito fraude: ${
          res.fraudSuccess ? "❌" : "✅"
        } — WebAuthn previno: ${res.details?.webAuthnPrevented ? "✅" : "❌"}`,
        "info"
      );
    } catch (e: any) {
      showMessage("fraud", `Error: ${e.message}`, "error");
    } finally {
      setFraudLoading(false);
    }
  }

  async function testImage() {
    showMessage("nft", `Probando imagen: ${NFT_BASE}/nft/nft.png`, "info");
    loadNFTImage("TEST");
  }

  async function getNFT() {
    try {
      setNftLoading(true);
      showMessage("nft", "Generando tu NFT de estudiante...", "info");
      const contractInfo = await fetch(`${API_BASE}/contract-info`);
      const contractData = await contractInfo.json();
      const tokenId = lastTokenId || Math.floor(Math.random() * 1000);
      showMessage("nft", `Contrato: ${contractData.address} — Token ID: #${tokenId}`, "success");
      // update React state so the NFTCard can render
      setNftTokenId(tokenId);
      setNftContract(contractData.address);
      loadNFTImage(tokenId);
    } catch (e: any) {
      showMessage("nft", `Error: ${e.message}`, "error");
    } finally {
      setNftLoading(false);
    }
  }

  function loadNFTImage(tokenId: number | string) {
    const img = new Image();
    img.onload = function () {
      setNftImageSrc(`${NFT_BASE}/nft/nft.png`);
    };
    (img as any).onerror = function () {
      setNftImageSrc(null);
    };
    // fallback in case load hangs
    const t = setTimeout(() => {
      if (!img.complete) {
        setNftImageSrc(null);
      }
    }, 5000);
    img.src = `${NFT_BASE}/nft/nft.png`;
    // clear timeout when image finishes (onload/onerror will have already set state)
    img.onload = img.onerror = () => clearTimeout(t);
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">🛡️ EqualPass — Demo WebAuthn + ZK</h2>
              <p className="text-sm text-gray-500 mt-1">
                Flujo de verificación paso a paso para jueces y evaluadores.
              </p>
            </div>
            <div className="text-xs text-gray-400">Demo interactiva</div>
          </div>

          <div className="space-y-4">
            <div className="rounded border p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">1 — Información del Usuario</div>
                  <div className="text-sm font-medium">Dirección de wallet</div>
                </div>
                <div className="text-sm text-gray-600">{userAddress}</div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Dirección de wallet"
                  value={userAddress}
                  onChange={(e) => setUserAddress((e.target as HTMLInputElement).value)}
                />
                <div>
                  {messages.status && <Message type={messages.status.type}>{messages.status.text}</Message>}
                </div>
              </div>
            </div>

            <div className="rounded border p-4 bg-white">
              <div className="text-sm text-gray-500">2 — Datos de Estudiante</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Input
                  label="Estatus"
                  value={studentStatus}
                  onChange={(e) => setStudentStatus((e.target as HTMLInputElement).value)}
                />
                <Input
                  label="Año de ingreso"
                  value={enrollmentYear}
                  onChange={(e) => setEnrollmentYear((e.target as HTMLInputElement).value)}
                />
                <Input
                  label="Hash Universidad"
                  value={universityHash}
                  onChange={(e) => setUniversityHash((e.target as HTMLInputElement).value)}
                />
                <Input
                  label="Secreto"
                  value={userSecret}
                  onChange={(e) => setUserSecret((e.target as HTMLInputElement).value)}
                />
              </div>
            </div>

            <div className="rounded border p-4 bg-white">
              <div className="text-sm text-gray-500">3 — Generar Prueba ZK</div>
              <div className="mt-3 flex items-center gap-3">
                <Button variant="success" onClick={mintStandard} loading={mintLoading}>
                  Generar Prueba ZK
                </Button>
                <div className="flex-1">
                  {messages.mintStandard && (
                    <Message type={messages.mintStandard.type}>{messages.mintStandard.text}</Message>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded border p-4 bg-white">
              <div className="text-sm text-gray-500">4 — Registro WebAuthn (una vez)</div>
              <div className="mt-3 flex items-center gap-3">
                <Button variant="secondary" onClick={registerWebAuthn} loading={registerLoading}>
                  Registrar Dispositivo
                </Button>
                <div className="flex-1">
                  {messages.register && (
                    <Message type={messages.register.type}>{messages.register.text}</Message>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded border p-4 bg-white">
              <div className="text-sm text-gray-500">5 — Prueba ZK + WebAuthn (Alta seguridad)</div>
              <div className="mt-3 flex items-center gap-3">
                <Button variant="primary" onClick={mintWithWebAuthn} loading={mintSecureLoading}>
                  Generar Prueba ZK + WebAuthn
                </Button>
                <div className="flex-1">
                  {messages.mintSecure && (
                    <Message type={messages.mintSecure.type}>{messages.mintSecure.text}</Message>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded border p-4 bg-white">
              <div className="text-sm text-gray-500">6 — Demo Anti-Fraude</div>
              <div className="mt-3 flex items-center gap-3">
                <Button variant="danger" onClick={simulateFraud} loading={fraudLoading}>
                  Simular Intento de Fraude
                </Button>
                <div className="flex-1">
                  {messages.fraud && <Message type={messages.fraud.type}>{messages.fraud.text}</Message>}
                </div>
              </div>
            </div>

            <div className="rounded border p-4 bg-white">
              <div className="text-sm text-gray-500">7 — NFT de Estudiante</div>
              <div className="mt-3 flex items-center gap-3">
                <Button variant="success" onClick={getNFT} loading={nftLoading}>
                  🎫 Obtener Mi NFT
                </Button>
                <Button variant="secondary" onClick={testImage}>
                  🧪 Probar Imagen NFT
                </Button>
              </div>
              <div className="mt-3">
                {messages.nft && <Message type={messages.nft.type}>{messages.nft.text}</Message>}
              </div>
            </div>
          </div>
        </div>

        <aside className="bg-white p-4 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Estado Rápido</h3>
            <div className="mt-2 text-sm">
              {messages.status ? (
                <Message type={messages.status.type}>{messages.status.text}</Message>
              ) : (
                <div className="text-gray-500">Estado WebAuthn no consultado</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600">Último Token</h3>
            <div className="mt-2">
              {lastTokenId ? (
                <div className="font-medium">#{lastTokenId}</div>
              ) : (
                <div className="text-gray-500">—</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600">NFT</h3>
            <div className="mt-2">
              {nftTokenId ? (
                <NFTCard title="EqualPass Badge" tokenId={nftTokenId} imageSrc={nftImageSrc} />
              ) : (
                <div className="text-gray-500 text-sm">Tu NFT aparecerá aquí después del mint</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Contract</h3>
            <div className="mt-2 text-xs text-gray-500">{nftContract ?? "No conectado"}</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WebAuthnDemo;
