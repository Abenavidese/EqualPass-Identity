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
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Verificar Credencial
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="ml-2"
          >
            🔄
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={queryType} onValueChange={(v) => setQueryType(v as "token" | "address")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="token">Por Token ID</TabsTrigger>
            <TabsTrigger value="address">Por Dirección</TabsTrigger>
          </TabsList>

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
              />
            </div>

            <Button onClick={handleVerifyToken} disabled={isLoading || !tokenId.trim()} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Badge"
              )}
            </Button>

            {tokenResult && tokenResult.verified && (
              <Alert className="border-success bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="ml-2">
                  <div className="space-y-2 mt-2">
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

          <TabsContent value="address" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verify-address">Dirección de Wallet</Label>
              <Input
                id="verify-address"
                placeholder="0x..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleVerifyAddress}
              disabled={isLoading || !address.trim()}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Dirección"
              )}
            </Button>

            {addressResult && addressResult.verified && (
              <Alert className="border-success bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="ml-2">
                  <div className="space-y-2 mt-2">
                    <p className="font-medium">Dirección Verificada ✓</p>
                    <p className="font-mono text-xs break-all">
                      <strong>Dirección:</strong> {addressResult.address}
                    </p>
                    <div className="text-sm space-y-2">
                      <p><strong>Badges Encontrados:</strong></p>
                      {addressResult.badges?.map((badge, index) => (
                        <div key={index} className="bg-white/50 p-2 rounded border">
                          <p><strong>Token ID:</strong> {badge.tokenId}</p>
                          <p><strong>Tipo:</strong> {badge.badgeType}</p>
                          <p><strong>Seguridad:</strong> {badge.securityLevel}</p>
                          <p><strong>Emitido:</strong> {new Date(badge.issuedAt).toLocaleDateString()}</p>
                        </div>
                      )) || <p className="text-gray-500">No se encontraron badges</p>}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        {verificationError && (
          <Alert className="border-destructive bg-destructive/10 mt-4">
            <XCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="ml-2">
              <p className="font-medium">Error de Verificación</p>
              <p className="text-sm mt-1">{verificationError}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
