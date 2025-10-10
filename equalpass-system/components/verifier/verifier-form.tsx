"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { BADGE_TYPE_LABELS } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const MOCK_BADGES: Record<
  string,
  {
    owner: string
    badgeType: 1 | 2 | 3
    issuedAt: number
    issuer: string
  } | null
> = {
  "1": {
    owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    badgeType: 1,
    issuedAt: Date.now() / 1000 - 86400 * 30, // 30 days ago
    issuer: "0x1234567890123456789012345678901234567890",
  },
  "2": {
    owner: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    badgeType: 2,
    issuedAt: Date.now() / 1000 - 86400 * 60, // 60 days ago
    issuer: "0x1234567890123456789012345678901234567890",
  },
  "3": {
    owner: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    badgeType: 3,
    issuedAt: Date.now() / 1000 - 86400 * 90, // 90 days ago
    issuer: "0x1234567890123456789012345678901234567890",
  },
}

interface VerificationResult {
  owner: string
  badgeType: 1 | 2 | 3
  issuedAt: number
  issuer: string
}

export function VerifierForm() {
  const [tokenId, setTokenId] = useState("")
  const [address, setAddress] = useState("")
  const [queryType, setQueryType] = useState<"token" | "address">("token")
  const [isLoading, setIsLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleVerifyToken = async () => {
    if (!tokenId) {
      toast({ title: "Error", description: "Ingresa un Token ID", variant: "destructive" })
      return
    }

    setIsLoading(true)
    setVerificationResult(null)
    setVerificationError(null)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockBadge = MOCK_BADGES[tokenId]

    if (mockBadge) {
      setVerificationResult(mockBadge)
    } else {
      setVerificationError("Badge no encontrado. Intenta con Token ID: 1, 2, o 3")
    }

    setIsLoading(false)
  }

  const handleVerifyAddress = async () => {
    if (!address) {
      toast({ title: "Error", description: "Ingresa una dirección", variant: "destructive" })
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    toast({
      title: "Info",
      description: "Funcionalidad de verificación por dirección en desarrollo",
    })
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle>Verificar Credencial</CardTitle>
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
                placeholder="Ej: 1, 2, o 3"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Demo: Prueba con Token ID 1, 2, o 3</p>
            </div>

            <Button onClick={handleVerifyToken} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Badge"
              )}
            </Button>

            {verificationResult && (
              <Alert className="border-success bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="ml-2">
                  <div className="space-y-2 mt-2">
                    <p className="font-medium">Badge Verificado ✓</p>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Tipo:</strong> {BADGE_TYPE_LABELS[verificationResult.badgeType]}
                      </p>
                      <p>
                        <strong>Emitido:</strong>{" "}
                        {new Date(verificationResult.issuedAt * 1000).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="font-mono text-xs break-all">
                        <strong>Propietario:</strong> {verificationResult.owner}
                      </p>
                      <p className="font-mono text-xs break-all">
                        <strong>Emisor:</strong> {verificationResult.issuer}
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {verificationError && (
              <Alert className="border-destructive bg-destructive/10">
                <XCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="ml-2">
                  <p className="font-medium">Error de Verificación</p>
                  <p className="text-sm mt-1">{verificationError}</p>
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
              />
            </div>

            <Button
              onClick={handleVerifyAddress}
              disabled={isLoading}
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
