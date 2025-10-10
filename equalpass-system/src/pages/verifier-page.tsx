"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function VerifierPage() {
  const [tokenId, setTokenId] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean
    owner: string
    issuedAt: string
    expiresAt: string
  } | null>(null)

  const handleVerify = async () => {
    setLoading(true)
    setVerificationResult(null)

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock verification results
    const mockResults: Record<string, any> = {
      "1": {
        isValid: true,
        owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f5e89",
        issuedAt: "2025-01-15",
        expiresAt: "2026-01-15",
      },
      "2": {
        isValid: true,
        owner: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
        issuedAt: "2025-02-01",
        expiresAt: "2026-02-01",
      },
      "3": {
        isValid: false,
        owner: "0x0000000000000000000000000000000000000000",
        issuedAt: "N/A",
        expiresAt: "N/A",
      },
    }

    const result = mockResults[tokenId] || {
      isValid: false,
      owner: "0x0000000000000000000000000000000000000000",
      issuedAt: "N/A",
      expiresAt: "N/A",
    }

    setVerificationResult(result)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
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
            <h1 className="text-3xl font-bold">Verificador Institucional</h1>
          </div>
          <p className="text-muted-foreground">Verifica la autenticidad de credenciales estudiantiles</p>
        </div>

        {/* Verification Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Verificar Credencial</CardTitle>
            <CardDescription>Ingresa el Token ID del NFT para verificar su validez</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokenId">Token ID</Label>
              <Input
                id="tokenId"
                type="number"
                placeholder="Ej: 1234"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </div>
            <Button
              onClick={handleVerify}
              disabled={loading || !tokenId}
              className="w-full bg-[#0ea5e9] hover:bg-[#0284c7]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Verificar Credencial
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {verificationResult && (
          <Card className={verificationResult.isValid ? "border-[#22c55e]" : "border-red-500"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {verificationResult.isValid ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-[#22c55e]" />
                    Credencial Válida
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-500" />
                    Credencial Inválida
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <Badge className={verificationResult.isValid ? "bg-[#22c55e]" : "bg-red-500"}>
                    {verificationResult.isValid ? "Activo" : "Inválido"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Propietario:</span>
                  <span className="font-mono text-xs">
                    {verificationResult.owner.slice(0, 10)}...{verificationResult.owner.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de Emisión:</span>
                  <span className="text-sm font-medium">{verificationResult.issuedAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de Expiración:</span>
                  <span className="text-sm font-medium">{verificationResult.expiresAt}</span>
                </div>
              </div>

              {verificationResult.isValid && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Esta credencial es válida y fue emitida por EqualPass. El portador es un estudiante verificado.
                  </p>
                </div>
              )}

              {!verificationResult.isValid && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">✗ Esta credencial no es válida o no existe en el sistema.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-6 bg-sky-50 border-[#0ea5e9]">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#0ea5e9]" />
              Verificación Segura
            </h3>
            <p className="text-sm text-muted-foreground">
              Todas las verificaciones se realizan on-chain en Polkadot Paseo Testnet. Los datos personales del
              estudiante nunca son revelados durante el proceso de verificación.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
