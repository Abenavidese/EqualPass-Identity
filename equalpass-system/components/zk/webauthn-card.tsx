"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Fingerprint, CheckCircle2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function WebAuthnCard() {
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const { toast } = useToast()

  const handleRegister = async () => {
    setLoading(true)
    try {
      // WebAuthn registration flow
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: "EqualPass",
          id: window.location.hostname,
        },
        user: {
          id: new Uint8Array(16),
          name: "student@example.com",
          displayName: "Estudiante",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none",
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })

      if (credential) {
        // TODO: Replace with actual endpoint
        const response = await fetch("http://localhost:3001/api/webauthn/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        })

        const data = await response.json()

        if (data.ok) {
          setRegistered(true)
          toast({
            title: "✓ Dispositivo registrado",
            description: "Tu autenticación biométrica está activa",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el dispositivo. Verifica que tu navegador soporte WebAuthn.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Fingerprint className="w-6 h-6 text-primary" />
          2. Autenticación WebAuthn
        </CardTitle>
        <CardDescription className="text-base">
          Protege tu cuenta con tu rostro o huella. Sin contraseñas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-muted-foreground">
            WebAuthn utiliza la biometría de tu dispositivo para garantizar que solo tú puedas reclamar tu credencial
            verificada.
          </p>
        </div>

        <Button
          onClick={handleRegister}
          disabled={loading || registered}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registrando dispositivo...
            </>
          ) : registered ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Dispositivo registrado
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4 mr-2" />
              Registrar dispositivo
            </>
          )}
        </Button>

        {registered && (
          <Alert className="border-success bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="ml-2">Autenticación biométrica configurada correctamente</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
