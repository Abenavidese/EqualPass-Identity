"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, User, CheckCircle2, AlertTriangle, Lock, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const [year, setYear] = useState("2025");
  const [studentId, setStudentId] = useState("12345");
  const [universityId, setUniversityId] = useState("67890");
  const [webauthnRegistered, setWebauthnRegistered] = useState(false);
  const [zkProofGenerated, setZkProofGenerated] = useState(false);
  const [combinedProofGenerated, setCombinedProofGenerated] = useState(false);
  const [nftClaimed, setNftClaimed] = useState(false);

  const handleGenerateZkProof = () => {
    setZkProofGenerated(true);
  };

  const handleRegisterWebAuthn = () => {
    setWebauthnRegistered(true);
  };

  const handleGenerateCombinedProof = () => {
    if (zkProofGenerated && webauthnRegistered) {
      setCombinedProofGenerated(true);
    }
  };

  const handleSimulateFraud = () => {
    alert(
      "⚠️ Intento de fraude detectado: Los datos ZK son válidos pero falta la verificación WebAuthn del dispositivo registrado."
    );
  };

  const handleClaimNft = () => {
    setNftClaimed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Shield className="h-8 w-8 text-[#0ea5e9]" />
            <h1 className="text-2xl font-bold text-balance">ZK-Scholar - Demo Seguridad WebAuthn + ZK</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="font-mono text-sm bg-muted p-3 rounded-lg">
                0x6388681e6A22F8Fc30e3150733795255D4250db1
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Verificar Estado WebAuthn
              </Button>
              <Alert variant={webauthnRegistered ? "default" : "destructive"}>
                <AlertDescription className="flex items-center gap-2">
                  {webauthnRegistered ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                      <span>Estado: Dispositivo registrado</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      <span>Estado: Dispositivo no registrado</span>
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Student Data */}
        <Card>
          <CardHeader>
            <CardTitle>Paso 1: Datos de Estudiante</CardTitle>
            <CardDescription>Ingresa tus datos académicos para generar la prueba</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Año Matrícula</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">ID Estudiante</Label>
                <Input
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="universityId">ID Universidad</Label>
                <Input
                  id="universityId"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  placeholder="67890"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Generate ZK Proof */}
        <Card>
          <CardHeader>
            <CardTitle>Paso 2: Generar Prueba ZK</CardTitle>
            <CardDescription>Solo prueba ZK (verificación básica)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerateZkProof}
              className="w-full bg-[#0ea5e9]"
              disabled={zkProofGenerated}
            >
              {zkProofGenerated ? "Prueba ZK Generada" : "Generar Prueba ZK"}
            </Button>
            {zkProofGenerated && (
              <Alert className="mt-4 border-[#22c55e]">
                <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                <AlertDescription className="text-[#22c55e]">
                  Prueba ZK generada exitosamente
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 3: WebAuthn Registration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Paso 3: Registro WebAuthn (Solo una vez)
            </CardTitle>
            <CardDescription>Registra tu dispositivo biométrico para verificación segura</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleRegisterWebAuthn}
              variant="outline"
              className="w-full bg-transparent"
              disabled={webauthnRegistered}
            >
              {webauthnRegistered ? "Dispositivo Registrado" : "Registrar Dispositivo"}
            </Button>
            {webauthnRegistered && (
              <Alert className="mt-4 border-[#22c55e]">
                <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                <AlertDescription className="text-[#22c55e]">
                  Dispositivo biométrico registrado correctamente
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 4: Combined Proof */}
        <Card>
          <CardHeader>
            <CardTitle>Paso 4: Prueba ZK + WebAuthn (Alta Seguridad)</CardTitle>
            <CardDescription>Prueba ZK + Verificación WebAuthn</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerateCombinedProof}
              className="w-full bg-[#0ea5e9]"
              disabled={!zkProofGenerated || !webauthnRegistered || combinedProofGenerated}
            >
              {combinedProofGenerated ? "Verificación Completa" : "Generar Prueba ZK + WebAuthn"}
            </Button>
            {!zkProofGenerated || !webauthnRegistered ? (
              <Alert className="mt-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Completa los pasos anteriores primero</AlertDescription>
              </Alert>
            ) : null}
            {combinedProofGenerated && (
              <Alert className="mt-4 border-[#22c55e]">
                <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                <AlertDescription className="text-[#22c55e]">
                  Verificación de alta seguridad completada exitosamente
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Anti-Fraud Demo */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Demo Anti-Fraude para Jueces</CardTitle>
            <CardDescription>
              Escenario: Un atacante robó los datos ZK pero NO tiene tu dispositivo biométrico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSimulateFraud} variant="destructive" className="w-full">
              Simular Intento de Fraude
            </Button>
          </CardContent>
        </Card>

        {/* Step 5: Claim NFT */}
        <Card className="border-[#0ea5e9]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#0ea5e9]" />
              Paso 5: Obtener NFT de Estudiante
            </CardTitle>
            <CardDescription>
              ¡Solo disponible después de mint exitoso! Obtén tu NFT que prueba tu estatus de estudiante
              verificado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleClaimNft}
              className="w-full bg-[#0ea5e9]"
              disabled={!combinedProofGenerated || nftClaimed}
            >
              {nftClaimed ? "NFT Obtenido" : "Probar Imagen NFT"}
            </Button>
            {nftClaimed && (
              <div className="space-y-4">
                <Alert className="border-[#22c55e]">
                  <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                  <AlertDescription className="text-[#22c55e]">
                    ¡Felicidades! Tu NFT de estudiante verificado ha sido generado
                  </AlertDescription>
                </Alert>
                <div className="bg-muted rounded-lg p-6 text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#0ea5e9] to-[#0ea5e9]/60 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-16 w-16 text-white" />
                  </div>
                  <Badge className="bg-[#22c55e] text-white">Estudiante Verificado</Badge>
                  <p className="text-sm text-muted-foreground mt-2">Token ID: #001</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ZK-Scholar - Sistema de Verificación de Identidad Estudiantil</p>
          <p className="mt-1">Powered by Zero-Knowledge Proofs + WebAuthn + Blockchain</p>
        </div>
      </footer>
    </div>
  );
}
