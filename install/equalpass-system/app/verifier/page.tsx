import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { VerifierForm } from "@/components/verifier/verifier-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function VerifierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header igual al de la otra página */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-4xl px-4 py-5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="Volver">
              <BackButton />
            </Link>
            <div className="flex items-center gap-3">
              <Image src="/logo_zks.png" alt="EqualPass Logo" width={32} height={32} className="h-8 w-8" />
              <h1 className="text-2xl font-semibold">Verificador de Credenciales</h1>
            </div>
          </div>
        </div>
        {/* Barra de acento */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
        {/* Intro como Card (mismo estilo/glows) */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Glows */}
          <div className="pointer-events-none absolute -top-28 -right-28 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-500/60 via-cyan-400/50 to-emerald-400/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-tr from-amber-400/60 via-pink-500/50 to-violet-500/40 blur-[90px]" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />

          <Card className="relative border bg-background/70 backdrop-blur-md">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background/80 shadow-sm">
                  <ShieldCheck className="h-5 w-5 opacity-80" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base md:text-lg">Portal Institucional</CardTitle>
                    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                      Zero-Knowledge • WebAuthn • NFT
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    Verifica la autenticidad de badges estudiantiles{" "}
                    <span className="font-medium">sin acceder a información personal</span>. Ingresa el
                    identificador del badge o escanéalo para validar su estado y tipo.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Puedes añadir pasos cortos si quieres */}
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  { t: "Ingresa/escanea el Badge", d: "Usa el ID o QR del credencial." },
                  { t: "Verificación on-chain", d: "Comprobación contra el contrato." },
                  { t: "Privacidad garantizada", d: "No se exponen datos personales." },
                  { t: "Resultado inmediato", d: "Estado y tipo del badge." },
                ].map((s, i) => (
                  <li
                    key={i}
                    className="group relative flex gap-3 rounded-xl border bg-card/50 p-3 transition hover:bg-card/70"
                  >
                    <div className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{s.t}</div>
                      <div className="text-xs text-muted-foreground">{s.d}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                Nota: este verificador solo confirma validez y tipo del badge; no revela PII.
              </div>
            </CardContent>

            {/* Acento inferior */}
            <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400/90" />
          </Card>
        </div>

        {/* Formulario de verificación */}
        <VerifierForm />

        {/* Nota de privacidad (mismo look glass, más compacto) */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/12" />
          <Card className="relative border bg-background/70 backdrop-blur-md">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Privacidad:</strong> El sistema confirma la validez del badge y su tipo sin exponer
                datos personales identificables (PII).
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
