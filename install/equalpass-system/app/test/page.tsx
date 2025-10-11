"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  User,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Award,
  ArrowLeft,
  Zap,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { equalPassApi, metaMaskHelpers } from "@/lib/equal-pass-api";
import BackButton from "@/components/ui/BackButton";

export default function DemoPage() {
  // Form state
  const [userAddress, setUserAddress] = useState("0x6388681e6A22F8Fc30e3150733795255D4250db1");
  const [studentStatus, setStudentStatus] = useState("1");
  const [enrollmentYear, setEnrollmentYear] = useState("2025");
  const [universityHash, setUniversityHash] = useState("12345");
  const [userSecret, setUserSecret] = useState("67890");

  // Status state
  const [webauthnStatus, setWebauthnStatus] = useState<{ hasCredential: boolean } | null>(null);
  const [zkProofGenerated, setZkProofGenerated] = useState(false);
  const [webauthnRegistered, setWebauthnRegistered] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [lastTokenId, setLastTokenId] = useState<string | null>(null);

  // Loading states
  const [loading, setLoading] = useState({
    status: false,
    zkProof: false,
    webauthn: false,
    mintSecure: false,
    nft: false,
    fraud: false,
  });

  // Results state
  const [results, setResults] = useState({
    status: null as any,
    zkProof: null as any,
    webauthn: null as any,
    mintSecure: null as any,
    fraud: null as any,
  });

  // Check WebAuthn status on load
  useEffect(() => {
    checkWebAuthnStatus();
  }, [userAddress]);

  const setLoadingState = (key: string, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const setResult = (key: string, value: any) => {
    setResults((prev) => ({ ...prev, [key]: value }));
  };

  const checkWebAuthnStatus = async () => {
    setLoadingState("status", true);
    try {
      const status = await equalPassApi.checkWebAuthnStatus(userAddress);
      setWebauthnStatus(status);
      setResult("status", status);

      // El backend es la fuente de verdad
      if (status.hasCredential) {
        // Si el backend dice que sí está registrado, guardar en localStorage
        localStorage.setItem(`webauthn_registered_${userAddress}`, "true");
        setWebauthnRegistered(true);
      } else {
        // Si el backend dice que NO está registrado, limpiar localStorage
        localStorage.removeItem(`webauthn_registered_${userAddress}`);
        setWebauthnRegistered(false);
      }
    } catch (error: any) {
      // Si el backend no responde, usar localStorage como fallback
      console.warn("Backend no disponible, usando localStorage como fallback:", error.message);
      const isRegistered = localStorage.getItem(`webauthn_registered_${userAddress}`) === "true";
      setWebauthnRegistered(isRegistered);
      setResult("status", { error: error.message, fallback: true });
    } finally {
      setLoadingState("status", false);
    }
  };

  const handleGenerateZkProof = async () => {
    setLoadingState("zkProof", true);
    try {
      const studentData = {
        userAddress,
        studentStatus,
        enrollmentYear,
        universityHash,
        userSecret,
      };

      const result = await equalPassApi.generateZKProof(studentData);
      setResult("zkProof", result);

      if (result.success) {
        setZkProofGenerated(true);
        if (result.tokenId) {
          setLastTokenId(result.tokenId);
          setNftMinted(true);
        }
      }
    } catch (error: any) {
      setResult("zkProof", { error: error.message });
    } finally {
      setLoadingState("zkProof", false);
    }
  };

  const handleRegisterWebAuthn = async () => {
    setLoadingState("webauthn", true);
    try {
      const result = await equalPassApi.registerWebAuthn(userAddress);
      setResult("webauthn", result);

      if (result.verified) {
        setWebauthnRegistered(true);
        await checkWebAuthnStatus(); // Refresh status
      }
    } catch (error: any) {
      setResult("webauthn", { error: error.message });
    } finally {
      setLoadingState("webauthn", false);
    }
  };

  const handleMintWithWebAuthn = async () => {
    setLoadingState("mintSecure", true);
    try {
      const studentData = {
        userAddress,
        studentStatus,
        enrollmentYear,
        universityHash,
        userSecret,
      };

      const result = await equalPassApi.mintWithWebAuthn(studentData);
      setResult("mintSecure", result);

      if (result.success) {
        if (result.tokenId) {
          setLastTokenId(result.tokenId);
          setNftMinted(true);
        }
      }
    } catch (error: any) {
      setResult("mintSecure", { error: error.message });
    } finally {
      setLoadingState("mintSecure", false);
    }
  };

  const handleSimulateFraud = async () => {
    setLoadingState("fraud", true);
    try {
      const result = await equalPassApi.simulateFraud(userAddress);
      setResult("fraud", result);
    } catch (error: any) {
      setResult("fraud", { error: error.message });
    } finally {
      setLoadingState("fraud", false);
    }
  };

  const handleClaimNft = async () => {
    if (!lastTokenId) return;

    setLoadingState("nft", true);
    try {
      const success = await metaMaskHelpers.addNFTToWallet(lastTokenId);
      if (success) {
        alert("✅ NFT agregado a MetaMask exitosamente");
      } else {
        // Show manual instructions
        alert(
          `Para agregar manualmente:\n\nAddress: 0x60E9b9fe1fb298299534a8aBafB628B1279DaaD3\nToken ID: ${lastTokenId}\nSymbol: EPIB`
        );
      }
    } catch (error: any) {
      console.error("Error claiming NFT:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoadingState("nft", false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-4xl px-4 py-5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="Volver">
              <BackButton />
            </Link>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-semibold">Generación de Pruebas ZK</h1>
            </div>
          </div>
        </div>
        {/* Barra de acento */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Intro como Card (mismo tamaño) */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Glows más marcados */}
          <div className="pointer-events-none absolute -top-28 -right-28 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-500/60 via-cyan-400/50 to-emerald-400/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-tr from-amber-400/60 via-pink-500/50 to-violet-500/40 blur-[90px]" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />

          <Card className="relative border bg-background/70 backdrop-blur-md">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background/80 shadow-sm">
                  <span aria-hidden>🛡️</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base md:text-lg">¿Cómo funciona?</CardTitle>
                    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                      Zero-Knowledge • WebAuthn • NFT
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    Ingresa tu <span className="font-medium">wallet</span>, verifica/registrar tu{" "}
                    <span className="font-medium">WebAuthn</span> y luego{" "}
                    <span className="font-medium">mintea</span> tu credencial. Demuestras que eres estudiante{" "}
                    <span className="font-medium">sin exponer datos personales</span>.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ol className="grid gap-3 sm:grid-cols-2">
                {[
                  { t: "Verifica o registra WebAuthn", d: "Liga tu dispositivo de forma segura." },
                  { t: "Mintea tu ZK-Badge", d: "Con o sin WebAuthn requerido." },
                  { t: "Agrega el NFT a MetaMask", d: "Visualiza tu credencial en tu wallet." },
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
              <div className="mt-3 text-xs text-muted-foreground">
                Tip: si cambiaste de dispositivo, vuelve a registrar WebAuthn para sincronizar tus
                credenciales.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Info */}
        {/* User Info (matching header/intro) */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Glows (ligeramente más suaves que el Intro) */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-500/40 via-cyan-400/30 to-emerald-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-tr from-amber-400/35 via-pink-500/25 to-violet-500/25 blur-[80px]" />
          {/* Anillo sutil */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/12" />

          <Card className="relative border bg-background/70 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Usuario
                </span>
                {/* Chip opcional
                <span className="hidden sm:inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                  Wallet & WebAuthn
                </span> */}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userAddress">Dirección de Wallet</Label>
                  <Input
                    id="userAddress"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="0x..."
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={checkWebAuthnStatus}
                    disabled={loading.status}
                  >
                    {loading.status ? "Verificando..." : "Verificar Estado WebAuthn"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      localStorage.removeItem(`webauthn_registered_${userAddress}`);
                      setWebauthnRegistered(false);
                      setResults((prev) => ({ ...prev, status: null }));
                      alert("Estado local limpiado. Verifica el estado nuevamente.");
                    }}
                    title="Limpiar estado local en caso de desincronización"
                  >
                    🔄
                  </Button>
                </div>

                {results.status && (
                  <Alert variant={webauthnStatus?.hasCredential ? "default" : "destructive"}>
                    <AlertDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        {webauthnStatus?.hasCredential ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Estado: ✅ Dispositivo registrado</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4" />
                            <span>Estado: ⚠️ Dispositivo no registrado</span>
                          </>
                        )}
                      </div>
                      {results.status.fallback && (
                        <div className="text-xs text-orange-600">
                          ⚠️ Backend no disponible — usando esta do local
                        </div>
                      )}
                      {results.status.error && !results.status.fallback && (
                        <div className="text-xs text-red-600">Error: {results.status.error}</div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Acento inferior para cohesión con el header */}
                <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400/90" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Paso 1: Datos de Estudiante (matching header/intro) */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Glows suaves para no competir con el Intro */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-500/40 via-cyan-400/30 to-emerald-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-tr from-amber-400/40 via-pink-500/30 to-violet-500/25 blur-[80px]" />
          {/* Anillo sutil tipo vidrio */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/12" />

          <Card className="relative border bg-background/70 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Paso 1: Datos de Estudiante</CardTitle>
                  <CardDescription>Ingresa tus datos académicos para generar la prueba</CardDescription>
                </div>
                {/* Chip/acento que hereda la paleta del header */}
                <span className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                  ZK • WebAuthn
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentStatus">Estado Estudiante</Label>
                  <Input
                    id="studentStatus"
                    value={studentStatus}
                    onChange={(e) => setStudentStatus(e.target.value)}
                    placeholder="1 = activo"
                    className="font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollmentYear">Año Matrícula</Label>
                  <Input
                    id="enrollmentYear"
                    value={enrollmentYear}
                    onChange={(e) => setEnrollmentYear(e.target.value)}
                    placeholder="2025"
                    inputMode="numeric"
                    className="font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="universityHash">Hash Universidad</Label>
                  <Input
                    id="universityHash"
                    value={universityHash}
                    onChange={(e) => setUniversityHash(e.target.value)}
                    placeholder="ej. 0xabc123… o hash numérico"
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userSecret">Secreto Usuario</Label>
                  <Input
                    id="userSecret"
                    value={userSecret}
                    onChange={(e) => setUserSecret(e.target.value)}
                    placeholder="clave privada local (no se envía en claro)"
                    className="font-mono text-sm"
                    type="password"
                  />
                </div>
              </div>

              {/* Línea de acento inferior (coincide con el header degradé) */}
              <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400/90" />
            </CardContent>
          </Card>
        </div>

        {/* Step 2: Generate ZK Proof */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Glows (un poco más fríos por ser acción técnica) */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-500/45 via-cyan-400/35 to-emerald-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-tr from-amber-400/35 via-pink-500/25 to-violet-500/25 blur-[80px]" />
          {/* Anillo sutil */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/12" />

          <Card className="relative border bg-background/70 backdrop-blur-md shadow-sm">
            <CardHeader>
              <CardTitle>Paso 2: Generar Prueba ZK</CardTitle>
              <CardDescription>Solo prueba ZK (verificación básica)</CardDescription>
            </CardHeader>

            <CardContent>
              {/* Botón ancho con foco estilizado */}
              {/* Botón ancho, muy “botón” */}
              <Button
                onClick={handleGenerateZkProof}
                disabled={loading.zkProof}
                className={[
                  // base shadcn
                  "group w-full",
                  // look de botón sólido y notorio
                  "relative overflow-hidden rounded-xl border border-white/10",
                  "bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500",
                  "text-white shadow-lg transition-all",
                  // interacción
                  "hover:shadow-xl hover:brightness-110 active:scale-[0.99]",
                  // accesibilidad
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                ].join(" ")}
                aria-label="Generar Prueba ZK"
              >
                {/* brillo sutil al pasar el mouse */}
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-15 group-active:opacity-20 bg-white" />

                {loading.zkProof ? (
                  <span className="flex items-center justify-center gap-2">
                    {/* spinner */}
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                      />
                    </svg>
                    Generando Prueba ZK…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4" />
                    Generar Prueba ZK
                  </span>
                )}
              </Button>

              {results.zkProof && (
                <Alert
                  className={`mt-4 ${
                    results.zkProof.success ? "border-green-500/70" : "border-red-500/70"
                  } bg-card/60 backdrop-blur-sm`}
                >
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {results.zkProof.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <strong>Resultado:</strong>{" "}
                        {results.zkProof.success ? "✅ Badge minteado" : "❌ Error"}
                      </div>

                      {results.zkProof.securityLevel && (
                        <div className="text-sm">
                          <strong>Seguridad:</strong> {results.zkProof.securityLevel}
                        </div>
                      )}

                      {results.zkProof.txHash && (
                        <div className="flex items-center gap-2 text-sm">
                          <strong>TX:</strong>
                          <a
                            href={results.zkProof.blockscoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 underline decoration-dotted underline-offset-4 hover:decoration-solid"
                          >
                            {results.zkProof.txHash.slice(0, 10)}…
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {results.zkProof.tokenId && (
                        <div className="text-sm">
                          <strong>Token ID:</strong> {results.zkProof.tokenId}
                        </div>
                      )}

                      {results.zkProof.error && (
                        <div className="text-sm text-red-600">
                          <strong>Error:</strong> {results.zkProof.error}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            {/* Acento inferior para cohesión */}
            <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400/90" />
          </Card>
        </div>

        {/* Step 3: WebAuthn Registration */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Glows suaves */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-500/40 via-cyan-400/30 to-emerald-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-tr from-amber-400/35 via-pink-500/25 to-violet-500/25 blur-[80px]" />
          {/* Anillo sutil */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/12" />

          <Card className="relative border bg-background/70 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Paso 3: Registro WebAuthn (Solo una vez)</CardTitle>
                  <CardDescription>
                    Registra tu dispositivo biométrico para verificación segura
                  </CardDescription>
                </div>
                <span className="hidden sm:inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                  Seguridad 🔐
                </span>
              </div>
            </CardHeader>

            <CardContent>
              {/* Botón sólido y notorio; cambia si ya está registrado */}
              <Button
                onClick={handleRegisterWebAuthn}
                disabled={loading.webauthn || webauthnRegistered}
                className={[
                  "group w-full relative overflow-hidden rounded-xl border",
                  webauthnRegistered
                    ? "border-emerald-500/20 bg-emerald-600 text-white shadow-lg"
                    : "border-white/10 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.99]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                ].join(" ")}
                aria-label="Registrar Dispositivo WebAuthn"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-15 group-active:opacity-20 bg-white" />
                <span className="flex items-center justify-center gap-2">
                  {loading.webauthn ? (
                    <>
                      {/* spinner */}
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-90"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                        />
                      </svg>
                      Registrando...
                    </>
                  ) : webauthnRegistered ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Dispositivo Registrado
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Registrar Dispositivo
                    </>
                  )}
                </span>
              </Button>

              {/* Resultado */}
              {results.webauthn && (
                <Alert
                  className={`mt-4 ${
                    results.webauthn.verified ? "border-green-500/70" : "border-red-500/70"
                  } bg-card/60 backdrop-blur-sm`}
                >
                  <AlertDescription>
                    {results.webauthn.verified ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />✅ Dispositivo registrado
                        exitosamente
                      </div>
                    ) : (
                      <div className="text-red-600">
                        ❌ Error: {results.webauthn.error || "No se pudo registrar el dispositivo"}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Tip de compatibilidad */}
              <p className="mt-3 text-xs text-muted-foreground">
                Tip: para usar biometría integrada, habilita “Usar llaves de acceso/Passkeys” en tu
                navegador/sistema.
              </p>
            </CardContent>

            {/* Acento inferior */}
            <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400/90" />
          </Card>
        </div>

        {/* Step 4: High Security Mint (matching header/intro) */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Glows (un poco más intensos por “Alta Seguridad”) */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-500/55 via-indigo-500/40 to-purple-500/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-tr from-emerald-400/35 via-cyan-400/30 to-blue-400/25 blur-[80px]" />
          {/* Anillo sutil */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/12" />

          <Card className="relative border bg-background/70 backdrop-blur-md shadow-sm">
            <CardHeader>
              <CardTitle>Paso 4: Prueba ZK + WebAuthn (Alta Seguridad)</CardTitle>
              <CardDescription>Prueba ZK + Verificación WebAuthn</CardDescription>
            </CardHeader>

            <CardContent>
              {/* Botón sólido, notorio y coherente con la paleta */}
              <Button
                onClick={handleMintWithWebAuthn}
                disabled={loading.mintSecure || !webauthnRegistered}
                className={[
                  "group w-full relative overflow-hidden rounded-xl border text-white shadow-lg transition-all",
                  loading.mintSecure || !webauthnRegistered
                    ? "border-white/10 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-80"
                    : "border-white/10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-xl hover:brightness-110 active:scale-[0.99]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                ].join(" ")}
                aria-label="Generar Prueba ZK + WebAuthn"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-15 group-active:opacity-20 bg-white" />
                <span className="flex items-center justify-center gap-2">
                  {loading.mintSecure ? (
                    <>
                      {/* spinner */}
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-90"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                        />
                      </svg>
                      Generando Prueba…
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Generar Prueba ZK + WebAuthn
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M13 5l7 7-7 7M5 12h14" />
                      </svg>
                    </>
                  )}
                </span>
              </Button>

              {/* Aviso si falta registro WebAuthn */}
              {!webauthnRegistered && (
                <Alert className="mt-4 bg-card/60 backdrop-blur-sm border-yellow-500/60">
                  <AlertDescription>⚠️ Primero necesitas registrar tu dispositivo WebAuthn.</AlertDescription>
                </Alert>
              )}

              {/* Resultado */}
              {results.mintSecure && (
                <Alert
                  className={`mt-4 ${
                    results.mintSecure.success ? "border-green-500/70" : "border-red-500/70"
                  } bg-card/60 backdrop-blur-sm`}
                >
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {results.mintSecure.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <strong>Resultado:</strong>{" "}
                        {results.mintSecure.success ? "✅ Badge con ALTA SEGURIDAD" : "❌ Error WebAuthn"}
                      </div>

                      {results.mintSecure.txHash && (
                        <div className="flex items-center gap-2 text-sm">
                          <strong>TX:</strong>
                          <a
                            href={results.mintSecure.blockscoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 underline decoration-dotted underline-offset-4 hover:decoration-solid"
                          >
                            {results.mintSecure.txHash.slice(0, 10)}…
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {results.mintSecure.tokenId && (
                        <div className="text-sm">
                          <strong>Token ID:</strong> {results.mintSecure.tokenId}
                        </div>
                      )}

                      {results.mintSecure.error && (
                        <div className="text-sm text-red-600">
                          <strong>Error:</strong> {results.mintSecure.error}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            {/* Acento inferior para cohesión */}
            <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400/90" />
          </Card>
        </div>

        {/* Anti-Fraud Demo
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">🚨 Demo Anti-Fraude para Jueces</CardTitle>
            <CardDescription>
              <strong>Escenario:</strong> Un atacante robó los datos ZK pero NO tiene tu dispositivo
              biométrico.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleSimulateFraud}
              variant="destructive"
              className="w-full"
              disabled={loading.fraud}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {loading.fraud ? "Simulando..." : "Simular Intento de Fraude"}
            </Button>

            {results.fraud && (
              <Alert className="mt-4 border-red-500">
                <AlertDescription>
                  <div className="text-red-700">
                    🚨 <strong>Fraude detectado:</strong>{" "}
                    {results.fraud.message || "Datos ZK válidos pero falta WebAuthn"}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card> */}

        {/* NFT Claim (matching header/intro, celebratorio) */}
        {(nftMinted || lastTokenId) && (
          <div className="relative overflow-hidden rounded-2xl">
            {/* Glows celebratorios (verdes/azules) */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-tr from-emerald-500/55 via-teal-400/40 to-blue-400/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-tr from-lime-400/40 via-emerald-400/35 to-cyan-400/30 blur-[80px]" />
            {/* Anillo sutil */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/12" />

            <Card className="relative border bg-background/70 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>🎫 Paso 5: Obtener NFT de Estudiante</CardTitle>
                <CardDescription>
                  <strong>¡Disponible después de un mint exitoso!</strong> Reclama y añade tu NFT verificado.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Botón sólido y distintivo */}
                  <Button
                    onClick={handleClaimNft}
                    disabled={loading.nft || !lastTokenId}
                    className={[
                      "group w-full relative overflow-hidden rounded-xl border text-white shadow-lg transition-all",
                      loading.nft || !lastTokenId
                        ? "border-white/10 bg-gradient-to-r from-emerald-700 via-teal-700 to-blue-700 opacity-85"
                        : "border-white/10 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:shadow-xl hover:brightness-110 active:scale-[0.99]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    ].join(" ")}
                    aria-label="Obtener Mi NFT"
                  >
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-15 group-active:opacity-20 bg-white" />
                    <span className="flex items-center justify-center gap-2">
                      {loading.nft ? (
                        <>
                          {/* spinner */}
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-90"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                            />
                          </svg>
                          Agregando a MetaMask…
                        </>
                      ) : (
                        <>
                          <Award className="h-4 w-4" />
                          🎫 Obtener Mi NFT
                        </>
                      )}
                    </span>
                  </Button>

                  {/* Resultado / detalle del mint */}
                  {lastTokenId && (
                    <Alert className="bg-card/60 backdrop-blur-sm border-green-500/70">
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            🎉 ¡Badge minteado exitosamente!
                          </div>

                          <div className="flex items-center justify-between gap-3 text-sm">
                            <div>
                              <strong>Token ID:</strong> {lastTokenId}
                            </div>

                            {/* Acciones rápidas */}
                            <div className="flex items-center gap-2">
                              {/* Copiar Token ID */}
                              <button
                                type="button"
                                onClick={() => navigator.clipboard?.writeText(String(lastTokenId))}
                                className="inline-flex items-center rounded-md border px-2 py-1 text-xs hover:bg-muted"
                                title="Copiar Token ID"
                              >
                                Copiar
                              </button>

                              {/* Ver en Blockscout (si tienes URL en results) */}
                              {results?.mintSecure?.blockscoutUrl && results?.mintSecure?.txHash && (
                                <a
                                  href={results.mintSecure.blockscoutUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                                  title="Ver transacción"
                                >
                                  Ver TX <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Añadiremos el NFT a tu cartera para que puedas visualizarlo en MetaMask.
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>

              {/* Acento inferior para cohesión */}
              <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500/90" />
            </Card>
          </div>
        )}

        {/* Progress Indicator — slim */}
        <div className="sticky bottom-4 z-30">
          <div className="mx-auto w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-full">
              {/* glows sutiles */}
              <div className="pointer-events-none absolute -top-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/20 to-emerald-400/15 blur-xl" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-gradient-to-tr from-amber-400/20 via-pink-500/15 to-violet-500/15 blur-xl" />
              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/12" />

              <div className="relative border bg-background/70 backdrop-blur-md shadow-md">
                {/* barra */}
                {(() => {
                  const steps = [
                    Boolean(zkProofGenerated),
                    Boolean(webauthnRegistered),
                    Boolean(results?.mintSecure?.success),
                    Boolean(lastTokenId),
                  ];
                  const pct = (steps.filter(Boolean).length / steps.length) * 100;
                  const nextLabel = lastTokenId
                    ? "Completado"
                    : results?.mintSecure?.success
                    ? "Obtén tu NFT"
                    : webauthnRegistered
                    ? "Genera alta seguridad"
                    : zkProofGenerated
                    ? "Registra WebAuthn"
                    : "Comienza con ZK Proof";

                  return (
                    <div className="px-3 py-2">
                      <div
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(pct)}
                        className="relative h-2 w-full overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-muted/40 to-muted/20"
                        title={`${Math.round(pct)}%`}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-[width] duration-500 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                        {/* ticks */}
                        <div className="pointer-events-none absolute inset-0 grid grid-cols-4">
                          {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="relative">
                              <div className="absolute right-0 top-0 h-full w-px bg-white/10" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* fila ultra-compacta */}
                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Badge
                            variant={zkProofGenerated ? "default" : "secondary"}
                            className="px-2 py-0 h-5"
                          >
                            {zkProofGenerated ? "✅" : " "} ZK
                          </Badge>
                          <Badge
                            variant={webauthnRegistered ? "default" : "secondary"}
                            className="px-2 py-0 h-5"
                          >
                            {webauthnRegistered ? "✅" : " "} WA
                          </Badge>
                          <Badge
                            variant={results?.mintSecure?.success ? "default" : "secondary"}
                            className="px-2 py-0 h-5"
                          >
                            {results?.mintSecure?.success ? "✅" : " "} HS
                          </Badge>
                          <Badge variant={lastTokenId ? "default" : "secondary"} className="px-2 py-0 h-5">
                            {lastTokenId ? "✅" : " "} NFT
                          </Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground">{nextLabel}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
