import { VerifierForm } from "@/components/verifier/verifier-form";
import { ShieldCheck } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function VerifierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Portal Institucional</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">Verificador de Credenciales</h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Verifica la autenticidad de badges estudiantiles sin acceder a información personal
          </p>
        </div>

        <VerifierForm />

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Nota de privacidad:</strong> Este sistema no revela información personal identificable
            (PII). Solo confirma el estado de validez del badge y su tipo.
          </p>
        </div>
      </div>
    </div>
  );
}
