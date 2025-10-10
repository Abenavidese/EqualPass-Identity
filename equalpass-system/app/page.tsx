import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Award, CheckCircle2, Eye, Fingerprint, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-7 w-7 text-[#0ea5e9]" />
              <span className="text-xl font-bold">EqualPass</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/demo">
                <Button variant="ghost">Demo</Button>
              </Link>
              <Link href="/verifier">
                <Button variant="ghost">Verificador</Button>
              </Link>
              <Link href="/demo">
                <Button className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90">Comenzar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 hover:bg-[#22c55e]/20">
            Verificación de Identidad Estudiantil
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Verifica tu identidad estudiantil sin revelar datos personales
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            EqualPass combina pruebas de conocimiento cero, autenticación biométrica y blockchain para crear un sistema
            de verificación estudiantil seguro y privado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/demo">
              <Button size="lg" className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-lg px-8">
                Probar Demo
              </Button>
            </Link>
            <Link href="/verifier">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Ver Verificador
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-[#0ea5e9]">100%</div>
              <div className="text-sm text-muted-foreground">Privacidad garantizada</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-[#22c55e]">Zero</div>
              <div className="text-sm text-muted-foreground">Datos personales expuestos</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-[#0ea5e9]">Blockchain</div>
              <div className="text-sm text-muted-foreground">Verificación descentralizada</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold">¿Cómo funciona?</h2>
            <p className="text-lg text-muted-foreground">
              Tres capas de seguridad para proteger tu identidad estudiantil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-[#0ea5e9]/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-[#0ea5e9]" />
                </div>
                <CardTitle>Pruebas Zero-Knowledge</CardTitle>
                <CardDescription>Demuestra que eres estudiante sin revelar tu nombre, ID o universidad</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span>Privacidad matemáticamente garantizada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span>Verificación criptográfica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span>Sin intermediarios</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#0ea5e9]/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#22c55e]/10 flex items-center justify-center mb-4">
                  <Fingerprint className="h-6 w-6 text-[#22c55e]" />
                </div>
                <CardTitle>Autenticación WebAuthn</CardTitle>
                <CardDescription>Verifica tu identidad con tu huella digital o reconocimiento facial</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span>Biometría local en tu dispositivo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span>Protección anti-fraude</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span>Estándar web seguro</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#0ea5e9]/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-[#f59e0b]" />
                </div>
                <CardTitle>NFT Soulbound</CardTitle>
                <CardDescription>Recibe una credencial digital no transferible en blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span>Credencial permanente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span>No transferible ni vendible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span>Verificable públicamente</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Proceso de verificación</h2>
              <p className="text-lg text-muted-foreground">Simple, rápido y seguro en 5 pasos</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Ingresa tus datos académicos",
                  description: "Año de estudio, ID de estudiante e ID de universidad",
                  icon: Eye,
                },
                {
                  step: "2",
                  title: "Genera tu prueba ZK",
                  description: "El sistema crea una prueba criptográfica sin revelar tus datos",
                  icon: Lock,
                },
                {
                  step: "3",
                  title: "Registra tu dispositivo",
                  description: "Configura la autenticación biométrica una sola vez",
                  icon: Fingerprint,
                },
                {
                  step: "4",
                  title: "Verifica tu identidad",
                  description: "Combina ZK + WebAuthn para máxima seguridad",
                  icon: Shield,
                },
                {
                  step: "5",
                  title: "Recibe tu NFT",
                  description: "Obtén tu credencial estudiantil verificada en blockchain",
                  icon: Award,
                },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-bold text-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5 text-[#0ea5e9]" />
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Para estudiantes</h2>
              <p className="text-lg text-muted-foreground">
                Accede a descuentos y beneficios estudiantiles sin comprometer tu privacidad
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <div className="font-semibold">Privacidad total</div>
                    <div className="text-sm text-muted-foreground">
                      Nunca compartas tu nombre, dirección o datos personales
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <div className="font-semibold">Verificación instantánea</div>
                    <div className="text-sm text-muted-foreground">Demuestra tu estatus de estudiante en segundos</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <div className="font-semibold">Una sola credencial</div>
                    <div className="text-sm text-muted-foreground">Úsala en múltiples plataformas y servicios</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Para instituciones</h2>
              <p className="text-lg text-muted-foreground">
                Verifica estudiantes sin manejar datos sensibles ni cumplir regulaciones complejas
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="h-4 w-4 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <div className="font-semibold">Sin almacenar datos</div>
                    <div className="text-sm text-muted-foreground">
                      Elimina riesgos de seguridad y cumplimiento GDPR
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="h-4 w-4 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <div className="font-semibold">Verificación confiable</div>
                    <div className="text-sm text-muted-foreground">Pruebas criptográficas imposibles de falsificar</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="h-4 w-4 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <div className="font-semibold">Integración simple</div>
                    <div className="text-sm text-muted-foreground">API REST para verificar credenciales en minutos</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#0ea5e9]/10 via-background to-[#22c55e]/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">
              Comienza a verificar tu identidad estudiantil hoy
            </h2>
            <p className="text-xl text-muted-foreground">
              Únete a la revolución de la privacidad digital con tecnología blockchain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/demo">
                <Button size="lg" className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-lg px-8">
                  Probar Demo Ahora
                </Button>
              </Link>
              <Link href="/verifier">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  Ver Verificador
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-[#0ea5e9]" />
                <span className="text-lg font-bold">EqualPass</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Verificación de identidad estudiantil con privacidad garantizada
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Producto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/demo" className="hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/verifier" className="hover:text-foreground transition-colors">
                    Verificador
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Tecnología</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Zero-Knowledge Proofs</li>
                <li>WebAuthn</li>
                <li>Polkadot Paseo</li>
                <li>Soulbound NFTs</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacidad</li>
                <li>Términos de uso</li>
                <li>Documentación</li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 EqualPass. Todos los derechos reservados.</p>
            <p className="mt-2">Powered by Zero-Knowledge Proofs + WebAuthn + Blockchain</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
