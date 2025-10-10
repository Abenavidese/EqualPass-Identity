"use client"

import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const scrollToDemo = () => {
    document.getElementById("evidence-card")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="text-center space-y-6 py-12">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
        <ShieldCheck className="w-4 h-4" />
        <span>Verificación Zero-Knowledge</span>
      </div>

      <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
        Demuestra que eres estudiante <span className="text-primary">sin revelar tus datos</span>
      </h1>

      <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
        EqualPass combina pruebas de conocimiento cero, autenticación biométrica y NFTs soulbound para proteger tu
        privacidad mientras verificas tu identidad estudiantil.
      </p>

      <Button size="lg" onClick={scrollToDemo} className="bg-primary hover:bg-primary/90 text-lg px-8">
        Probar ahora
      </Button>
    </div>
  )
}
