"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Loader2, RefreshCw } from "lucide-react"
import { CONTRACT, generateClaimId } from "@/lib/contract"
import { BADGE_TYPE_LABELS, type BadgeType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function TestWrite() {
  const [badgeType, setBadgeType] = useState<BadgeType>(1)
  const [claimId, setClaimId] = useState<`0x${string}`>(generateClaimId())
  const { address } = useAccount()
  const { toast } = useToast()

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleMint = () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Conecta tu wallet primero",
        variant: "destructive",
      })
      return
    }

    writeContract({
      address: CONTRACT.address,
      abi: CONTRACT.abi,
      functionName: "mintBadge",
      args: [address, badgeType, claimId],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write: mintBadge()</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="write-badge-type">Badge Type</Label>
          <Select value={badgeType.toString()} onValueChange={(v) => setBadgeType(Number(v) as BadgeType)}>
            <SelectTrigger id="write-badge-type">
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
          <Label htmlFor="write-claim-id">Claim ID</Label>
          <div className="flex gap-2">
            <Input id="write-claim-id" value={claimId} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={() => setClaimId(generateClaimId())}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button onClick={handleMint} disabled={isPending || isConfirming || !address} className="w-full">
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isPending ? "Confirmando..." : "Minteando..."}
            </>
          ) : (
            "mintBadge()"
          )}
        </Button>

        {hash && <p className="text-xs text-muted-foreground font-mono break-all">TX: {hash}</p>}
      </CardContent>
    </Card>
  )
}
