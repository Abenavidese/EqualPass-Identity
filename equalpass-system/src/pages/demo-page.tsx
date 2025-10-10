"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Copy } from "lucide-react"
import { Link } from "react-router-dom"
import {
  checkWebAuthnStatus,
  beginWebAuthnRegistration,
  completeWebAuthnRegistration,
  beginWebAuthnAuthentication,
  mintBadge,
  simulateFraud,
  getContractInfo,
  getNFTImageUrl,
  type MintResponse,
} from "@/lib/api"
import { base64urlToUint8Array, uint8ArrayToBase64url, copyToClipboard, addNFTToMetaMask } from "@/lib/webauthn-utils"

export default function DemoPage() {
  const [userAddress, setUserAddress] = useState("0x6388681e6A22F8Fc30e3150733795255D4250db1")
  const [loading, setLoading] = useState(false)
  const [webauthnStatus, setWebauthnStatus] = useState<boolean | null>(null)
  const [studentData, setStudentData] = useState({
    studentStatus: "1",
    enrollmentYear: "2025",
    universityHash: "12345",
    userSecret: "67890",
  })

  const [zkProofResult, setZkProofResult] = useState<MintResponse | null>(null)
  const [webauthnRegistered, setWebauthnRegistered] = useState(false)
  const [secureProofResult, setSecureProofResult] = useState<MintResponse | null>(null)
  const [fraudResult, setFraudResult] = useState<any>(null)
  const [nftData, setNftData] = useState<{ tokenId: number; contractAddress: string } | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const status = await checkWebAuthnStatus(userAddress)
      setWebauthnStatus(status.hasCredential)
      setWebauthnRegistered(status.hasCredential)
    } catch (error) {
      console.error("Error checking status:", error)
    }
  }

  const handleGenerateZKProof = async () => {
    setLoading(true)
    try {
      const result = await mintBadge({
        userAddress,
        ...studentData,
        requireWebAuthn: false,
      })
      setZkProofResult(result)
      if (result.success && result.tokenId) {
        const contractInfo = await getContractInfo()
        setNftData({ tokenId: result.tokenId, contractAddress: contractInfo.address })
      }
    } catch (error: any) {
      setZkProofResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleWebAuthnRegistration = async () => {
    setLoading(true)
    try {
      // Step 1: Get challenge from server
      const options = await beginWebAuthnRegistration(userAddress)

      // Step 2: Create credential with WebAuthn
      const credential = await navigator.credentials.create({
        publicKey: {
          ...options,
          challenge: base64urlToUint8Array(options.challenge),
          user: {
            ...options.user,
            id: base64urlToUint8Array(options.user.id),
          },
        },
      })

      if (!credential) throw new Error("No se pudo crear la credencial")

      // Step 3: Send credential to server
      const publicKeyCredential = credential as PublicKeyCredential
      const response = publicKeyCredential.response as AuthenticatorAttestationResponse

      await completeWebAuthnRegistration(userAddress, {
        id: credential.id,
        response: {
          clientDataJSON: uint8ArrayToBase64url(new Uint8Array(response.clientDataJSON)),
          publicKey: uint8ArrayToBase64url(new Uint8Array(response.getPublicKey()!)),
        },
      })

      setWebauthnRegistered(true)
      await checkStatus()
    } catch (error: any) {
      alert(`Error en registro WebAuthn: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCombinedProof = async () => {
    setLoading(true)
    try {
      // Step 1: Get authentication challenge
      const options = await beginWebAuthnAuthentication(userAddress)

      // Step 2: Authenticate with WebAuthn
      const credential = await navigator.credentials.get({
        publicKey: {
          ...options,
          challenge: base64urlToUint8Array(options.challenge),
          allowCredentials: options.allowCredentials.map((cred: any) => ({
            ...cred,
            id: base64urlToUint8Array(cred.id),
          })),
        },
      })

      if (!credential) throw new Error("No se pudo autenticar")

      // Step 3: Mint with WebAuthn verification
      const publicKeyCredential = credential as PublicKeyCredential
      const response = publicKeyCredential.response as AuthenticatorAssertionResponse

      const result = await mintBadge({
        userAddress,
        ...studentData,
        requireWebAuthn: true,
        webAuthnCredential: {
          id: credential.id,
          response: {
            clientDataJSON: uint8ArrayToBase64url(new Uint8Array(response.clientDataJSON)),
            authenticatorData: uint8ArrayToBase64url(new Uint8Array(response.authenticatorData)),
            signature: uint8ArrayToBase64url(new Uint8Array(response.signature)),
          },
        },
      })

      setSecureProofResult(result)
      if (result.success && result.tokenId) {
        const contractInfo = await getContractInfo()
        setNftData({ tokenId: result.tokenId, contractAddress: contractInfo.address })
      }
    } catch (error: any) {
      setSecureProofResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSimulateFraud = async () => {
    setLoading(true)
    try {
      const result = await simulateFraud(userAddress)
      setFraudResult(result)
    } catch (error: any) {
      setFraudResult({ fraudDetected: false, fraudSuccess: false, message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleClaimNFT = async () => {
    if (!nftData) return

    try {
      const success = await addNFTToMetaMask(nftData.contractAddress, nftData.tokenId)
      if (success) {
        alert("🎉 ¡NFT agregado a MetaMask exitosamente!")
      } else {
        // Show manual instructions
        const manual = `📝 Instrucciones manuales:\n1. Abre MetaMask → NFTs → "Importar NFT"\n2. Dirección: ${nftData.contractAddress}\n3. Token ID: ${nftData.tokenId}`
        alert(manual)
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await copyToClipboard(text)
      alert("✅ Copiado al portapapeles")
    } catch (error) {
      alert("❌ Error copiando al portapapeles")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-10 w-10 text-[#0ea5e9]" />
            <h1 className="text-3xl font-bold">EqualPass - Demo Seguridad WebAuthn + ZK</h1>
          </div>
          <p className="text-muted-foreground">
            Demostración del flujo completo de verificación de identidad estudiantil
          </p>
        </div>

        <Card className="mb-6 border-[#0ea5e9]">
          <CardHeader>
            <CardTitle className="text-lg">Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="userAddress">Dirección de Wallet</Label>
                <div className="flex gap-2">
                  <Input
                    id="userAddress"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={checkStatus}>
                    Verificar
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado WebAuthn:</span>
                {webauthnStatus === null ? (
                  <Badge variant="outline">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Verificando...
                  </Badge>
                ) : webauthnStatus ? (
                  <Badge className="bg-[#22c55e]">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Registrado
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    No Registrado
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Paso 1: Datos de Estudiante</CardTitle>
            <CardDescription>Ingresa tu información estudiantil (procesada localmente)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentStatus">Estado Estudiante (1=activo)</Label>
              <Input
                id="studentStatus"
                value={studentData.studentStatus}
                onChange={(e) => setStudentData({ ...studentData, studentStatus: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentYear">Año de Matrícula</Label>
              <Input
                id="enrollmentYear"
                value={studentData.enrollmentYear}
                onChange={(e) => setStudentData({ ...studentData, enrollmentYear: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="universityHash">Hash Universidad</Label>
              <Input
                id="universityHash"
                value={studentData.universityHash}
                onChange={(e) => setStudentData({ ...studentData, universityHash: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userSecret">Secreto Usuario</Label>
              <Input
                id="userSecret"
                value={studentData.userSecret}
                onChange={(e) => setStudentData({ ...studentData, userSecret: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Paso 2: Generar Prueba ZK</CardTitle>
            <CardDescription>Crea una prueba matemática de que eres estudiante sin revelar tus datos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerateZKProof}
              disabled={loading || !!zkProofResult?.success}
              className="w-full bg-[#0ea5e9] hover:bg-[#0284c7]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando Prueba ZK...
                </>
              ) : zkProofResult?.success ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Prueba ZK Generada
                </>
              ) : (
                "Generar Prueba ZK"
              )}
            </Button>
            {zkProofResult && (
              <div
                className={`mt-4 p-4 rounded-lg border ${
                  zkProofResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                {zkProofResult.success ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-green-800 font-semibold">✅ Badge minteado exitosamente</p>
                    <p className="text-green-700">
                      <strong>Seguridad:</strong> {zkProofResult.securityLevel || "STANDARD"}
                    </p>
                    {zkProofResult.txHash && (
                      <p className="text-green-700">
                        <strong>TX:</strong>{" "}
                        <a
                          href={zkProofResult.blockscoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {zkProofResult.txHash.slice(0, 10)}...
                        </a>
                      </p>
                    )}
                    {zkProofResult.tokenId && (
                      <p className="text-green-700">
                        <strong>Token ID:</strong> {zkProofResult.tokenId}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-red-800">❌ Error: {zkProofResult.error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Paso 3: Registro WebAuthn</CardTitle>
            <CardDescription>Registra tu dispositivo biométrico (una sola vez)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleWebAuthnRegistration}
              disabled={loading || webauthnRegistered}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando Dispositivo...
                </>
              ) : webauthnRegistered ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Dispositivo Registrado
                </>
              ) : (
                "Registrar WebAuthn"
              )}
            </Button>
            {webauthnRegistered && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Dispositivo biométrico registrado. Ahora puedes usar tu huella o Face ID.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 bg-amber-50/50">
          <CardHeader>
            <CardTitle>Paso 4: Prueba ZK + WebAuthn (Alta Seguridad)</CardTitle>
            <CardDescription>Genera una prueba de alta seguridad combinando ambas tecnologías</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCombinedProof}
              disabled={loading || !webauthnRegistered || !!secureProofResult?.success}
              className="w-full bg-[#f59e0b] hover:bg-[#d97706]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando Prueba Combinada...
                </>
              ) : secureProofResult?.success ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Prueba Combinada Generada
                </>
              ) : (
                "Generar Prueba ZK + WebAuthn"
              )}
            </Button>
            {secureProofResult && (
              <div
                className={`mt-4 p-4 rounded-lg border ${
                  secureProofResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                {secureProofResult.success ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-green-800 font-semibold">✅ Badge minteado con alta seguridad</p>
                    <p className="text-green-700">
                      <strong>ZK Verificada:</strong> {secureProofResult.verified ? "✅" : "❌"}
                    </p>
                    <p className="text-green-700">
                      <strong>WebAuthn Verificada:</strong> {secureProofResult.webAuthnVerified ? "✅" : "❌"}
                    </p>
                    <p className="text-green-700">
                      <strong>Nivel de Seguridad:</strong> {secureProofResult.securityLevel}
                    </p>
                    {secureProofResult.txHash && (
                      <p className="text-green-700">
                        <strong>TX:</strong>{" "}
                        <a
                          href={secureProofResult.blockscoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {secureProofResult.txHash.slice(0, 10)}...
                        </a>
                      </p>
                    )}
                    {secureProofResult.tokenId && (
                      <p className="text-green-700">
                        <strong>Token ID:</strong> {secureProofResult.tokenId}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-red-800">❌ Error: {secureProofResult.error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-300 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-red-600">🚨 Demo Anti-Fraude (Para Jueces)</CardTitle>
            <CardDescription>
              Escenario: Un atacante robó los datos ZK pero NO tiene tu dispositivo biométrico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleSimulateFraud}
              variant="outline"
              className="w-full border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
              disabled={loading || !webauthnRegistered}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simulando...
                </>
              ) : (
                "Simular Intento de Fraude"
              )}
            </Button>
            {fraudResult && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">🚨 Resultado del Intento de Fraude:</h4>
                <div className="space-y-1 text-sm text-amber-800">
                  <p>
                    <strong>Fraude Detectado:</strong> {fraudResult.fraudDetected ? "✅ SÍ" : "❌ NO"}
                  </p>
                  <p>
                    <strong>Fraude Exitoso:</strong> {fraudResult.fraudSuccess ? "❌ SÍ (MALO)" : "✅ NO (BUENO)"}
                  </p>
                  <p>
                    <strong>WebAuthn Previno Fraude:</strong>{" "}
                    {fraudResult.details?.webAuthnPrevented ? "✅ SÍ" : "❌ NO"}
                  </p>
                  <p className="mt-2">
                    <strong>Explicación:</strong> {fraudResult.message}
                  </p>
                  <div className="mt-3 p-3 bg-white rounded border border-amber-300">
                    <strong>Para los Jueces:</strong> Aunque el atacante tenga los datos ZK válidos, WebAuthn requiere
                    el dispositivo físico original (huella dactilar, Face ID, etc.). Sin el dispositivo correcto, el
                    fraude es imposible.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gradient-to-br from-sky-50 to-green-50">
          <CardHeader>
            <CardTitle>🎫 Paso 5: Obtener NFT de Estudiante</CardTitle>
            <CardDescription>
              ¡Solo disponible después de mint exitoso! Obtén tu NFT que prueba tu estatus de estudiante verificado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nftData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-6 bg-white rounded-lg border-2 border-[#0ea5e9]">
                  <img
                    src={getNFTImageUrl() || "/placeholder.svg"}
                    alt="NFT Estudiante"
                    className="max-w-[200px] max-h-[200px] rounded-lg"
                    onError={(e) => {
                      // Fallback to gradient if image fails to load
                      e.currentTarget.style.display = "none"
                      e.currentTarget.parentElement!.innerHTML = `
                        <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; text-align: center;">
                          <div style="font-size: 48px; margin-bottom: 10px;">🎓</div>
                          <div style="font-size: 16px; font-weight: bold;">EqualPass</div>
                          <div style="font-size: 12px;">Student Badge</div>
                          <div style="font-size: 10px; margin-top: 8px;">#${nftData.tokenId}</div>
                        </div>
                      `
                    }}
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-lg">🎓 EqualPass Student Badge</p>
                  <p>🛡️ Credencial Verificada con ZK + WebAuthn</p>
                  <p>🌐 Red: Polkadot Paseo</p>
                  <p>📅 Fecha: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="p-4 bg-white rounded-lg border space-y-3">
                  <h4 className="font-semibold">📱 Para agregar a MetaMask:</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Dirección del Contrato:</p>
                      <div className="flex gap-2">
                        <code className="flex-1 text-xs bg-gray-100 p-2 rounded font-mono break-all">
                          {nftData.contractAddress}
                        </code>
                        <Button size="sm" variant="outline" onClick={() => handleCopy(nftData.contractAddress)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Token ID:</p>
                      <div className="flex gap-2">
                        <code className="flex-1 text-xs bg-gray-100 p-2 rounded font-mono">{nftData.tokenId}</code>
                        <Button size="sm" variant="outline" onClick={() => handleCopy(nftData.tokenId.toString())}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleClaimNFT} className="w-full bg-[#ff6600] hover:bg-[#e55a00]">
                    🦊 Agregar a MetaMask
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                <p>Completa el mint para obtener tu NFT de estudiante</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
