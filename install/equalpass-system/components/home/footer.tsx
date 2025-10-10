import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 py-8 border-t">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm">No se almacena información personal identificable (PII)</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Demo de ZK-Scholar - Sistema de verificación estudiantil con Zero-Knowledge Proofs
        </p>
      </div>
    </footer>
  );
}
