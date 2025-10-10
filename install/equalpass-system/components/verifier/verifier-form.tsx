"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { equalPassApi } from "@/lib/equal-pass-api"

interface TokenVerificationResult {
  verified: boolean
  tokenId?: string
  owner?: string
  badgeType?: string
  securityLevel?: string
  issuedAt?: string
  metadata?: any
}

interface AddressVerificationResult {
  verified: boolean
  address?: string
  badges?: Array<{
    tokenId: string
    badgeType: string
    securityLevel: string
    issuedAt: string
  }>
}

export function VerifierForm() {
  const [tokenId, setTokenId] = useState("")
  const [address, setAddress] = useState("")
  const [queryType, setQueryType] = useState<"token" | "address">("token")
  const [isLoading, setIsLoading] = useState(false)
  const [tokenResult, setTokenResult] = useState<TokenVerificationResult | null>(null)
  const [addressResult, setAddressResult] = useState<AddressVerificationResult | null>(null)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleVerifyToken = async () => {
    if (!tokenId) {
      toast({ title: "Error", description: "Ingresa un Token ID", variant: "destructive" })
      return
    }

    setIsLoading(true)
    setTokenResult(null)
    setAddressResult(null)
    setVerificationError(null)

    try {
      const result = await equalPassApi.verifyByTokenId(tokenId.trim())
      setTokenResult(result)
    } catch (error) {
      console.error('Token verification error:', error)
      setVerificationError(error instanceof Error ? error.message : "Error durante la verificación")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyAddress = async () => {
    if (!address) {
      toast({ title: "Error", description: "Ingresa una dirección", variant: "destructive" })
      return
    }

    setIsLoading(true)
    setTokenResult(null)
    setAddressResult(null)
    setVerificationError(null)

    try {
      // Check if MetaMask is available
      if (!(window as any).ethereum) {
        throw new Error("MetaMask no está instalado. Por favor instala MetaMask para verificar.")
      }

      // PASO 1: Conectar/verificar wallet
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
      const connectedAddress = accounts[0].toLowerCase()
      const inputAddress = address.trim().toLowerCase()

      if (connectedAddress !== inputAddress) {
        throw new Error(`La dirección conectada (${connectedAddress}) no coincide con la dirección ingresada (${inputAddress})`)
      }

      // PASO 2: Generar challenge
      const challengeResult = await equalPassApi.generateChallenge({
        verifierName: "EqualPass Verifier",
        purpose: "Verificar propiedad de badges de identidad"
      })

      // PASO 3: Firmar mensaje con MetaMask
      const signature = await (window as any).ethereum.request({
        method: "personal_sign",
        params: [challengeResult.message, connectedAddress],
      })

      // PASO 4: Verificar firma y obtener badges
      const verificationResult = await equalPassApi.verifyOwnership({
        challengeId: challengeResult.challengeId,
        signature: signature,
        walletAddress: connectedAddress
      })

      if (verificationResult.success) {
        setAddressResult({
          verified: true,
          address: connectedAddress,
          badges: verificationResult.badges || []
        })
        toast({ 
          title: "Verificación exitosa", 
          description: verificationResult.message || `Se encontraron ${verificationResult.badges?.length || 0} badges verificados`
        })
      } else {
        throw new Error(verificationResult.message || "No se pudo verificar la propiedad de los badges")
      }

    } catch (error) {
      console.error('Address verification error:', error)
      setVerificationError(error instanceof Error ? error.message : "Error durante la verificación")
      toast({ 
        title: "Error de verificación", 
        description: error instanceof Error ? error.message : "Error durante la verificación",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setTokenId("")
    setAddress("")
    setTokenResult(null)
    setAddressResult(null)
    setVerificationError(null)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Glows sutiles */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-500/40 via-cyan-400/30 to-emerald-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-tr from-amber-400/35 via-pink-500/25 to-violet-500/25 blur-[80px]" />
      {/* Anillo sutil tipo vidrio */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/12" />

      <Card className="relative border bg-background/70 backdrop-blur-md shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            Verificar Credencial
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="ml-2"
              aria-label="Reiniciar formulario"
            >
              🔄
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={queryType} onValueChange={(v) => setQueryType(v as "token" | "address")}>
            <TabsList className="grid w-full grid-cols-2 bg-background/60 backdrop-blur-sm">
              <TabsTrigger value="token">Por Token ID</TabsTrigger>
              <TabsTrigger value="address">Por Dirección</TabsTrigger>
            </TabsList>

            {/* --- TAB POR TOKEN --- */}
            <TabsContent value="token" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verify-token-id">Token ID del Badge</Label>
                <Input
                  id="verify-token-id"
                  type="number"
                  placeholder="Ej: 1"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/70"
                />
              </div>

              {/* Botón sólido/claramente botón (coherente con pasos anteriores) */}
              <Button
                onClick={handleVerifyToken}
                disabled={isLoading || !tokenId.trim()}
                className={[
                  "group w-full relative overflow-hidden rounded-xl border text-white shadow-lg transition-all",
                  isLoading
                    ? "border-white/10 bg-gradient-to-r from-blue-700 via-cyan-700 to-emerald-700 opacity-85"
                    : "border-white/10 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:shadow-xl hover:brightness-110 active:scale-[0.99]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                ].join(" ")}
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-15 group-active:opacity-20 bg-white" />
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </span>
                ) : (
                  "Verificar Badge"
                )}
              </Button>

              {tokenResult && tokenResult.verified && (
                <Alert className="bg-card/60 backdrop-blur-sm border-green-500/70">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="ml-2">
                    <div className="mt-2 space-y-2">
                      <p className="font-medium">Badge Verificado ✓</p>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Token ID:</strong> {tokenResult.tokenId}
                        </p>
                        <p>
                          <strong>Tipo:</strong> {tokenResult.badgeType}
                        </p>
                        <p>
                          <strong>Seguridad:</strong> {tokenResult.securityLevel}
                        </p>
                        {tokenResult.issuedAt && (
                          <p>
                            <strong>Emitido:</strong>{" "}
                            {new Date(tokenResult.issuedAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                        <p className="font-mono text-xs break-all">
                          <strong>Propietario:</strong> {tokenResult.owner}
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* --- TAB POR ADDRESS --- */}
            <TabsContent value="address" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verify-address">Dirección de Wallet</Label>
                <Input
                  id="verify-address"
                  placeholder="0x..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isLoading}
                  className="bg-background/70"
                />
              </div>

              <Button
                onClick={handleVerifyAddress}
                disabled={isLoading || !address.trim()}
                className={[
                  "group w-full relative overflow-hidden rounded-xl border text-white shadow-lg transition-all",
                  isLoading
                    ? "border-white/10 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-85"
                    : "border-white/10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-xl hover:brightness-110 active:scale-[0.99]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                ].join(" ")}
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-15 group-active:opacity-20 bg-white" />
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </span>
                ) : (
                  "Verificar Dirección"
                )}
              </Button>

              {addressResult && addressResult.verified && (
                <Alert className="bg-card/60 backdrop-blur-sm border-green-500/70">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="ml-2">
                    <div className="mt-2 space-y-2">
                      <p className="font-medium">Dirección Verificada ✓</p>
                      <p className="font-mono text-xs break-all">
                        <strong>Dirección:</strong> {addressResult.address}
                      </p>
                      <div className="text-sm space-y-2">
                        <p>
                          <strong>Badges Encontrados:</strong>
                        </p>
                        {addressResult.badges?.length ? (
                          addressResult.badges.map((badge, index) => (
                            <div key={index} className="rounded border bg-white/50 p-2">
                              <p>
                                <strong>Token ID:</strong> {badge.tokenId}
                              </p>
                              <p>
                                <strong>Tipo:</strong> {badge.badgeType}
                              </p>
                              <p>
                                <strong>Seguridad:</strong> {badge.securityLevel}
                              </p>
                              <p>
                                <strong>Emitido:</strong>{" "}
                                {new Date(badge.issuedAt).toLocaleDateString("es-ES")}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No se encontraron badges</p>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>

          {verificationError && (
            <Alert className="mt-4 bg-destructive/10 border-destructive">
              <XCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="ml-2">
                <p className="font-medium">Error de Verificación</p>
                <p className="mt-1 text-sm">{verificationError}</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        {/* Acento inferior para cohesión */}
        <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400/90" />
      </Card>
    </div>
  );

}
