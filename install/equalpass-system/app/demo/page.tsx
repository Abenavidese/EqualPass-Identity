"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, User, CheckCircle2, AlertTriangle, Lock, Award, ArrowLeft, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { equalPassApi, metaMaskHelpers } from "@/lib/equal-pass-api";

export default function DemoPage() {
  // Form state
  const [userAddress, setUserAddress] = useState("0x6388681e6A22F8Fc30e3150733795255D4250db1");
  const [studentStatus, setStudentStatus] = useState("1");
  const [enrollmentYear, setEnrollmentYear] = useState("2025");
  const [universityHash, setUniversityHash] = useState("12345");
  const [userSecret, setUserSecret] = useState("67890");

  // Status state
  const [webauthnStatus, setWebauthnStatus] = useState<{hasCredential: boolean} | null>(null);
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
    fraud: false
  });

  // Results state
  const [results, setResults] = useState({
    status: null as any,
    zkProof: null as any,
    webauthn: null as any,
    mintSecure: null as any,
    fraud: null as any
  });

  // Check WebAuthn status on load
  useEffect(() => {
    checkWebAuthnStatus();
  }, [userAddress]);

  const setLoadingState = (key: string, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const setResult = (key: string, value: any) => {
    setResults(prev => ({ ...prev, [key]: value }));
  };

  const checkWebAuthnStatus = async () => {
    setLoadingState('status', true);
    try {
      const status = await equalPassApi.checkWebAuthnStatus(userAddress);
      setWebauthnStatus(status);
      setResult('status', status);
      
      // El backend es la fuente de verdad
      if (status.hasCredential) {
        // Si el backend dice que sí está registrado, guardar en localStorage
        localStorage.setItem(`webauthn_registered_${userAddress}`, 'true');
        setWebauthnRegistered(true);
      } else {
        // Si el backend dice que NO está registrado, limpiar localStorage
        localStorage.removeItem(`webauthn_registered_${userAddress}`);
        setWebauthnRegistered(false);
      }
    } catch (error: any) {
      // Si el backend no responde, usar localStorage como fallback
      console.warn('Backend no disponible, usando localStorage como fallback:', error.message);
      const isRegistered = localStorage.getItem(`webauthn_registered_${userAddress}`) === 'true';
      setWebauthnRegistered(isRegistered);
      setResult('status', { error: error.message, fallback: true });
    } finally {
      setLoadingState('status', false);
    }
  };

  const handleGenerateZkProof = async () => {
    setLoadingState('zkProof', true);
    try {
      const studentData = {
        userAddress,
        studentStatus,
        enrollmentYear,
        universityHash,
        userSecret
      };

      const result = await equalPassApi.generateZKProof(studentData);
      setResult('zkProof', result);
      
      if (result.success) {
        setZkProofGenerated(true);
        if (result.tokenId) {
          setLastTokenId(result.tokenId);
          setNftMinted(true);
        }
      }
    } catch (error: any) {
      setResult('zkProof', { error: error.message });
    } finally {
      setLoadingState('zkProof', false);
    }
  };

  const handleRegisterWebAuthn = async () => {
    setLoadingState('webauthn', true);
    try {
      const result = await equalPassApi.registerWebAuthn(userAddress);
      setResult('webauthn', result);
      
      if (result.verified) {
        setWebauthnRegistered(true);
        await checkWebAuthnStatus(); // Refresh status
      }
    } catch (error: any) {
      setResult('webauthn', { error: error.message });
    } finally {
      setLoadingState('webauthn', false);
    }
  };

  const handleMintWithWebAuthn = async () => {
    setLoadingState('mintSecure', true);
    try {
      const studentData = {
        userAddress,
        studentStatus,
        enrollmentYear,
        universityHash,
        userSecret
      };

      const result = await equalPassApi.mintWithWebAuthn(studentData);
      setResult('mintSecure', result);
      
      if (result.success) {
        if (result.tokenId) {
          setLastTokenId(result.tokenId);
          setNftMinted(true);
        }
      }
    } catch (error: any) {
      setResult('mintSecure', { error: error.message });
    } finally {
      setLoadingState('mintSecure', false);
    }
  };

  const handleSimulateFraud = async () => {
    setLoadingState('fraud', true);
    try {
      const result = await equalPassApi.simulateFraud(userAddress);
      setResult('fraud', result);
    } catch (error: any) {
      setResult('fraud', { error: error.message });
    } finally {
      setLoadingState('fraud', false);
    }
  };

  const handleClaimNft = async () => {
    if (!lastTokenId) return;
    
    setLoadingState('nft', true);
    try {
      const success = await metaMaskHelpers.addNFTToWallet(lastTokenId);
      if (success) {
        alert('✅ NFT agregado a MetaMask exitosamente');
      } else {
        // Show manual instructions
        alert(`Para agregar manualmente:\n\nAddress: 0x60E9b9fe1fb298299534a8aBafB628B1279DaaD3\nToken ID: ${lastTokenId}\nSymbol: EPIB`);
      }
    } catch (error: any) {
      console.error('Error claiming NFT:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoadingState('nft', false);
    }
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
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">EqualPass - Demo Seguridad WebAuthn + ZK</h1>
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
                    setResults(prev => ({ ...prev, status: null }));
                    alert('Estado local limpiado. Verifica el estado nuevamente.');
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
                        ⚠️ Backend no disponible - usando estado local
                      </div>
                    )}
                    {results.status.error && !results.status.fallback && (
                      <div className="text-xs text-red-600">
                        Error: {results.status.error}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentStatus">Estado Estudiante</Label>
                <Input
                  id="studentStatus"
                  value={studentStatus}
                  onChange={(e) => setStudentStatus(e.target.value)}
                  placeholder="1=activo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentYear">Año Matrícula</Label>
                <Input
                  id="enrollmentYear"
                  value={enrollmentYear}
                  onChange={(e) => setEnrollmentYear(e.target.value)}
                  placeholder="2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="universityHash">Hash Universidad</Label>
                <Input
                  id="universityHash"
                  value={universityHash}
                  onChange={(e) => setUniversityHash(e.target.value)}
                  placeholder="12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userSecret">Secreto Usuario</Label>
                <Input
                  id="userSecret"
                  value={userSecret}
                  onChange={(e) => setUserSecret(e.target.value)}
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
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading.zkProof}
            >
              <Zap className="h-4 w-4 mr-2" />
              {loading.zkProof ? "Generando Prueba ZK..." : "Generar Prueba ZK"}
            </Button>
            
            {results.zkProof && (
              <Alert className={`mt-4 ${results.zkProof.success ? 'border-green-500' : 'border-red-500'}`}>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {results.zkProof.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <strong>Resultado:</strong> {results.zkProof.success ? '✅ Badge minteado' : '❌ Error'}
                    </div>
                    {results.zkProof.securityLevel && (
                      <div><strong>Seguridad:</strong> {results.zkProof.securityLevel}</div>
                    )}
                    {results.zkProof.txHash && (
                      <div className="flex items-center gap-2">
                        <strong>TX:</strong> 
                        <a 
                          href={results.zkProof.blockscoutUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {results.zkProof.txHash.slice(0,10)}...
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {results.zkProof.tokenId && (
                      <div><strong>Token ID:</strong> {results.zkProof.tokenId}</div>
                    )}
                    {results.zkProof.error && (
                      <div className="text-red-600"><strong>Error:</strong> {results.zkProof.error}</div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 3: WebAuthn Registration */}
        <Card>
          <CardHeader>
            <CardTitle>Paso 3: Registro WebAuthn (Solo una vez)</CardTitle>
            <CardDescription>Registra tu dispositivo biométrico para verificación segura</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleRegisterWebAuthn}
              variant="outline"
              className="w-full"
              disabled={loading.webauthn || webauthnRegistered}
            >
              <Lock className="h-4 w-4 mr-2" />
              {loading.webauthn ? "Registrando..." : webauthnRegistered ? "Dispositivo Registrado" : "Registrar Dispositivo"}
            </Button>
            
            {results.webauthn && (
              <Alert className={`mt-4 ${results.webauthn.verified ? 'border-green-500' : 'border-red-500'}`}>
                <AlertDescription>
                  {results.webauthn.verified ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ✅ Dispositivo registrado exitosamente
                    </div>
                  ) : (
                    <div className="text-red-600">
                      ❌ Error: {results.webauthn.error || 'No se pudo registrar el dispositivo'}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 4: High Security Mint */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle>Paso 4: Prueba ZK + WebAuthn (Alta Seguridad)</CardTitle>
            <CardDescription>Prueba ZK + Verificación WebAuthn</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleMintWithWebAuthn}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading.mintSecure || !webauthnRegistered}
            >
              <Shield className="h-4 w-4 mr-2" />
              {loading.mintSecure ? "Generando Prueba..." : "Generar Prueba ZK + WebAuthn"}
            </Button>
            
            {!webauthnRegistered && (
              <Alert className="mt-4">
                <AlertDescription>
                  ⚠️ Primero necesitas registrar tu dispositivo WebAuthn
                </AlertDescription>
              </Alert>
            )}

            {results.mintSecure && (
              <Alert className={`mt-4 ${results.mintSecure.success ? 'border-green-500' : 'border-red-500'}`}>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {results.mintSecure.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <strong>Resultado:</strong> {results.mintSecure.success ? '✅ Badge con ALTA SEGURIDAD' : '❌ Error WebAuthn'}
                    </div>
                    {results.mintSecure.txHash && (
                      <div className="flex items-center gap-2">
                        <strong>TX:</strong> 
                        <a 
                          href={results.mintSecure.blockscoutUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {results.mintSecure.txHash.slice(0,10)}...
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {results.mintSecure.tokenId && (
                      <div><strong>Token ID:</strong> {results.mintSecure.tokenId}</div>
                    )}
                    {results.mintSecure.error && (
                      <div className="text-red-600"><strong>Error:</strong> {results.mintSecure.error}</div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Anti-Fraud Demo */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">🚨 Demo Anti-Fraude para Jueces</CardTitle>
            <CardDescription>
              <strong>Escenario:</strong> Un atacante robó los datos ZK pero NO tiene tu dispositivo biométrico.
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
                    🚨 <strong>Fraude detectado:</strong> {results.fraud.message || 'Datos ZK válidos pero falta WebAuthn'}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* NFT Claim */}
        {(nftMinted || lastTokenId) && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle>🎫 Paso 5: Obtener NFT de Estudiante</CardTitle>
              <CardDescription>
                <strong>¡Solo disponible después de mint exitoso!</strong> Obtén tu NFT que prueba tu estatus de estudiante verificado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={handleClaimNft}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading.nft || !lastTokenId}
                >
                  <Award className="h-4 w-4 mr-2" />
                  {loading.nft ? "Agregando a MetaMask..." : "🎫 Obtener Mi NFT"}
                </Button>
                
                {lastTokenId && (
                  <Alert className="border-green-500">
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          🎉 ¡Badge minteado exitosamente! 
                        </div>
                        <div><strong>Token ID:</strong> {lastTokenId}</div>
                        <div className="text-sm text-gray-600">
                          Ahora puedes obtener tu NFT de estudiante y agregarlo automáticamente a MetaMask.
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Indicator */}
        <Card className="sticky bottom-6 bg-white/90 backdrop-blur border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <Badge variant={zkProofGenerated ? "default" : "secondary"}>
                  {zkProofGenerated ? "✅" : "1"} ZK Proof
                </Badge>
                <Badge variant={webauthnRegistered ? "default" : "secondary"}>
                  {webauthnRegistered ? "✅" : "2"} WebAuthn
                </Badge>
                <Badge variant={results.mintSecure?.success ? "default" : "secondary"}>
                  {results.mintSecure?.success ? "✅" : "3"} Alta Seguridad
                </Badge>
                <Badge variant={lastTokenId ? "default" : "secondary"}>
                  {lastTokenId ? "✅" : "4"} NFT
                </Badge>
              </div>
              <div className="text-muted-foreground">
                {lastTokenId ? "Completado" : 
                 results.mintSecure?.success ? "Obtén tu NFT" :
                 webauthnRegistered ? "Genera prueba de alta seguridad" :
                 zkProofGenerated ? "Registra WebAuthn" : "Comienza con ZK Proof"}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}