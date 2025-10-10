"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { API_CONFIG } from "@/lib/api-config"

export function EvidenceCard() {
  const [evidence, setEvidence] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ eligible: boolean; sessionId: string } | null>(null)
  const { toast } = useToast()

  const handleValidate = async () => {
    if (!evidence.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu evidencia estudiantil",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // TODO: Replace with actual endpoint
      const response = await fetch(`${API_CONFIG.BASE_URL}/eligible`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidence }),
      })

      const data = await response.json()
      setResult(data)

      if (data.eligible) {
        toast({
          title: "✓ Elegible",
          description: "Tu evidencia ha sido verificada exitosamente",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar al servidor de verificación",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card id="evidence-card" className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">1. Evidencia Estudiantil</CardTitle>
        <CardDescription className="text-base">
          Verificamos tu elegibilidad sin ver tus datos personales
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Pega aquí tu ID estudiantil ofuscado o evidencia (no incluyas información personal identificable)..."
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          rows={4}
          className="resize-none"
        />

        <Button onClick={handleValidate} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validando...
            </>
          ) : (
            "Validar Elegibilidad"
          )}
        </Button>

        {result && (
          <Alert className={result.eligible ? "border-success bg-success/10" : "border-destructive bg-destructive/10"}>
            {result.eligible ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <AlertDescription className="ml-2">
              {result.eligible
                ? `Elegible confirmado (Sesión: ${result.sessionId.slice(0, 8)}...)`
                : "No se pudo verificar la elegibilidad con esta evidencia"}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
