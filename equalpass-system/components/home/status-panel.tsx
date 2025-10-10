"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

export function StatusPanel() {
  // TODO: Connect to actual state management
  const steps = [
    { id: "zk", label: "Verificación ZK", completed: false },
    { id: "webauthn", label: "WebAuthn", completed: false },
    { id: "mint", label: "Mint NFT", completed: false },
  ]

  return (
    <Card className="border-2 shadow-lg sticky top-8">
      <CardHeader>
        <CardTitle className="text-xl">Estado del Proceso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              {step.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <span className={step.completed ? "text-foreground font-medium" : "text-muted-foreground"}>
                {index + 1}. {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">TX Hash:</span>
            <p className="font-mono text-xs mt-1 text-muted-foreground/70">Pendiente...</p>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Nota:</strong> Todos los pasos deben completarse en orden para recibir tu badge verificado.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
