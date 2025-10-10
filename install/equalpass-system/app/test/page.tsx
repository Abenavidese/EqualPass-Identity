import type { Metadata } from "next"
import { TestConnection } from "@/components/test/test-connection"
import { TestContract } from "@/components/test/test-contract"
import { TestWrite } from "@/components/test/test-write"
import { TestRead } from "@/components/test/test-read"
import { TestResults } from "@/components/test/test-results"

export const metadata: Metadata = {
  robots: "noindex",
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Pruebas</h1>
          <p className="text-muted-foreground">Interfaz para jueces - Interacción directa con el contrato en Paseo</p>
        </div>

        <div className="grid gap-6">
          <TestConnection />
          <TestContract />

          <div className="grid md:grid-cols-2 gap-6">
            <TestWrite />
            <TestRead />
          </div>

          <TestResults />
        </div>
      </div>
    </div>
  )
}
