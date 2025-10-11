"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useReadContract } from "wagmi"
import { Loader2 } from "lucide-react"
import { CONTRACT } from "@/lib/contract"
import { useToast } from "@/hooks/use-toast"

export function TestRead() {
  const [tokenId, setTokenId] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [activeQuery, setActiveQuery] = useState<"ownerOf" | "badgeInfo" | "balanceOf" | null>(null)
  const { toast } = useToast()

  const {
    data: ownerData,
    isLoading: ownerLoading,
    refetch: refetchOwner,
  } = useReadContract({
    address: CONTRACT.address,
    abi: CONTRACT.abi,
    functionName: "ownerOf",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: false },
  })

  const {
    data: badgeData,
    isLoading: badgeLoading,
    refetch: refetchBadge,
  } = useReadContract({
    address: CONTRACT.address,
    abi: CONTRACT.abi,
    functionName: "badgeInfo",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: false },
  })

  const {
    data: balanceData,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: CONTRACT.address,
    abi: CONTRACT.abi,
    functionName: "balanceOf",
    args: addressInput ? [addressInput as `0x${string}`] : undefined,
    query: { enabled: false },
  })

  const handleOwnerOf = () => {
    if (!tokenId) {
      toast({ title: "Error", description: "Ingresa un Token ID", variant: "destructive" })
      return
    }
    setActiveQuery("ownerOf")
    refetchOwner()
  }

  const handleBadgeInfo = () => {
    if (!tokenId) {
      toast({ title: "Error", description: "Ingresa un Token ID", variant: "destructive" })
      return
    }
    setActiveQuery("badgeInfo")
    refetchBadge()
  }

  const handleBalanceOf = () => {
    if (!addressInput) {
      toast({ title: "Error", description: "Ingresa una dirección", variant: "destructive" })
      return
    }
    setActiveQuery("balanceOf")
    refetchBalance()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Read: Consultas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="owner">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="owner">ownerOf</TabsTrigger>
            <TabsTrigger value="badge">badgeInfo</TabsTrigger>
            <TabsTrigger value="balance">balanceOf</TabsTrigger>
          </TabsList>

          <TabsContent value="owner" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="owner-token-id">Token ID</Label>
              <Input
                id="owner-token-id"
                type="number"
                placeholder="1"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </div>
            <Button onClick={handleOwnerOf} disabled={ownerLoading} className="w-full">
              {ownerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ownerOf()"}
            </Button>
            {activeQuery === "ownerOf" && ownerData && (
              <p className="text-xs font-mono break-all bg-muted p-2 rounded">{ownerData as string}</p>
            )}
          </TabsContent>

          <TabsContent value="badge" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="badge-token-id">Token ID</Label>
              <Input
                id="badge-token-id"
                type="number"
                placeholder="1"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </div>
            <Button onClick={handleBadgeInfo} disabled={badgeLoading} className="w-full">
              {badgeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "badgeInfo()"}
            </Button>
            {activeQuery === "badgeInfo" && badgeData && (
              <div className="text-xs space-y-1 bg-muted p-2 rounded">
                <p>
                  <strong>Badge Type:</strong> {(badgeData as any)[0]?.toString()}
                </p>
                <p>
                  <strong>Issued At:</strong> {new Date(Number((badgeData as any)[1]) * 1000).toUTCString()}
                </p>
                <p className="font-mono break-all">
                  <strong>Issuer:</strong> {(badgeData as any)[2]}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="balance" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="balance-address">Address</Label>
              <Input
                id="balance-address"
                placeholder="0x..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
              />
            </div>
            <Button onClick={handleBalanceOf} disabled={balanceLoading} className="w-full">
              {balanceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "balanceOf()"}
            </Button>
            {activeQuery === "balanceOf" && balanceData !== undefined && (
              <p className="text-xs bg-muted p-2 rounded">
                <strong>Balance:</strong> {balanceData.toString()}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
