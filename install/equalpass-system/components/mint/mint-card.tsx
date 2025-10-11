"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { API_CONFIG } from "@/lib/api-config"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi"
import { Award, Loader2, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react"
import { CONTRACT, PASEO_CHAIN, generateClaimId } from "@/lib/contract"
import { BADGE_TYPE_LABELS, type BadgeType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function MintCard() {
  const [badgeType, setBadgeType] = useState<BadgeType>(1)
  const [claimId, setClaimId] = useState<`0x${string}`>(generateClaimId())
  const [, setAuthToken] = useState<string | null>(null)
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { toast } = useToast()

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const isCorrectChain = chainId === PASEO_CHAIN.id

  const handleClaim = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Error",
        description: "Por favor conecta tu wallet primero",
        variant: "destructive",
      })
      return
    }

    if (!isCorrectChain) {
      toast({
        title: "Red incorrecta",
        description: "Por favor cambia a la red Paseo",
        variant: "destructive",
      })
      return
    }

    try {
      // TODO: Replace with actual endpoint
      const response = await fetch(`${API_CONFIG.BASE_URL}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, badgeType, claimId }),
      })

      const data = await response.json()
      setAuthToken(data.auth)

      // Mint the badge
      writeContract({
        address: CONTRACT.address,
        abi: CONTRACT.abi,
        functionName: "mintBadge",
        args: [address, badgeType, claimId],
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud de claim",
        variant: "destructive",
      })
    }
  }

  const regenerateClaimId = () => {
    setClaimId(generateClaimId())
    toast({
      title: "Claim ID regenerado",
      description: "Se ha generado un nuevo identificador único",
    })
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          3. Reclamar Badge NFT
        </CardTitle>
        <CardDescription className="text-base">Tu credencial verificada, como NFT soulbound en Paseo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <ConnectButton />
        </div>

        {!isCorrectChain && isConnected && (
          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="ml-2">
              Debes estar conectado a la red Paseo (Chain ID: {PASEO_CHAIN.id})
            </AlertDescription>
          </Alert>
        )}

        {isConnected && isCorrectChain && (
          <>
            <div className="space-y-2">
              <Label htmlFor="badge-type">Tipo de Badge</Label>
              <Select value={badgeType.toString()} onValueChange={(v) => setBadgeType(Number(v) as BadgeType)}>
                <SelectTrigger id="badge-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{BADGE_TYPE_LABELS[1]}</SelectItem>
                  <SelectItem value="2">{BADGE_TYPE_LABELS[2]}</SelectItem>
                  <SelectItem value="3">{BADGE_TYPE_LABELS[3]}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="claim-id">Claim ID</Label>
              <div className="flex gap-2">
                <Input id="claim-id" value={claimId} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={regenerateClaimId} title="Regenerar Claim ID">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleClaim}
              disabled={isPending || isConfirming}
              className="w-full bg-success hover:bg-success/90 text-success-foreground"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isPending ? "Confirmando..." : "Minteando..."}
                </>
              ) : (
                "Claim Badge"
              )}
            </Button>

            {isSuccess && hash && (
              <Alert className="border-success bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="ml-2 space-y-1">
                  <p className="font-medium">¡Badge minteado exitosamente!</p>
                  <p className="text-xs font-mono break-all">TX: {hash}</p>
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
