"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy } from "lucide-react"
import { CONTRACT } from "@/lib/contract"
import { useToast } from "@/hooks/use-toast"
import contractConfig from "@/lib/contract-config.json"

export function TestContract() {
  const { toast } = useToast()

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT.address)
    toast({
      title: "Copiado",
      description: "Dirección del contrato copiada al portapapeles",
    })
  }

  const explorerUrl = contractConfig.chain.blockExplorers.default.url

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Contrato</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Dirección del Contrato</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono break-all">{CONTRACT.address}</code>
            <Button variant="outline" size="icon" onClick={copyAddress}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-transparent" asChild>
          <a href={`${explorerUrl}/address/${CONTRACT.address}`} target="_blank" rel="noopener noreferrer">
            Ver en Explorer
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
