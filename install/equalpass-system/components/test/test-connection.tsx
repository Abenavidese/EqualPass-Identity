"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { PASEO_CHAIN } from "@/lib/contract"

export function TestConnection() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const isCorrectChain = chainId === PASEO_CHAIN.id

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conexión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <ConnectButton />
        </div>

        {isConnected && !isCorrectChain && (
          <>
            <Alert className="border-warning bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="ml-2">
                No estás conectado a la red Paseo (Chain ID: {PASEO_CHAIN.id})
              </AlertDescription>
            </Alert>
            <Button onClick={() => switchChain({ chainId: PASEO_CHAIN.id })} className="w-full" variant="outline">
              Cambiar a Paseo
            </Button>
          </>
        )}

        {isConnected && isCorrectChain && (
          <Alert className="border-success bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="ml-2">Conectado a Paseo correctamente</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
