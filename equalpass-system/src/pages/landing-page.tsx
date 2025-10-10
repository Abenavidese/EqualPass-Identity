import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Zap, CheckCircle2, ArrowRight, Github, Twitter } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-[#0ea5e9]" />
              <span className="text-xl font-bold">EqualPass</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium hover:text-[#0ea5e9] transition-colors">
                Características
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-[#0ea5e9] transition-colors">
                Cómo Funciona
              </a>
              <a href="#benefits" className="text-sm font-medium hover:text-[#0ea5e9] transition-colors">
                Beneficios
              </a>
              <Link to="/demo">
                <Button className="bg-[#0ea5e9] hover:bg-[#0284c7]">Probar Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-[#0ea5e9] text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Verificación de Identidad del Futuro
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Prueba que eres estudiante <span className="text-[#0ea5e9]">sin revelar tus datos</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            EqualPass utiliza Zero-Knowledge Proofs y blockchain para verificar tu identidad estudiantil manteniendo tu
            privacidad intacta. Sin compartir información personal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" className="bg-[#0ea5e9] hover:bg-[#0284c7] text-lg px-8">
                Comenzar Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/verifier">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Verificar Credencial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-[#0ea5e9] mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Privacidad Garantizada</div>
            </CardContent>
          </Card>
          <Card className="text-center border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-[#22c55e] mb-2">&lt;2s</div>
              <div className="text-sm text-muted-foreground">Tiempo de Verificación</div>
            </CardContent>
          </Card>
          <Card className="text-center border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-[#f59e0b] mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Usos Ilimitados</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Características Principales</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tecnología de vanguardia para proteger tu identidad
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-[#0ea5e9] transition-colors">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-sky-100 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-[#0ea5e9]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Zero-Knowledge Proofs</h3>
              <p className="text-muted-foreground">
                Demuestra que eres estudiante sin revelar ningún dato personal. Matemáticamente seguro.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-[#22c55e] transition-colors">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-[#22c55e]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Autenticación WebAuthn</h3>
              <p className="text-muted-foreground">
                Seguridad biométrica de nivel bancario. Tu huella o Face ID como llave única.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-[#f59e0b] transition-colors">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">NFT Soulbound</h3>
              <p className="text-muted-foreground">
                Credencial digital permanente en blockchain. No transferible, siempre tuya.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-sky-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cómo Funciona</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tres pasos simples para obtener tu verificación
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Ingresa tus Datos",
                  description:
                    "Proporciona tu información estudiantil. Esta información se procesa localmente y nunca se almacena.",
                  color: "text-[#0ea5e9]",
                },
                {
                  step: "02",
                  title: "Genera tu Prueba ZK",
                  description:
                    "Nuestro sistema crea una prueba matemática que verifica tu condición de estudiante sin revelar tus datos.",
                  color: "text-[#22c55e]",
                },
                {
                  step: "03",
                  title: "Recibe tu NFT",
                  description: "Obtén tu credencial digital permanente en blockchain. Úsala cuando y donde quieras.",
                  color: "text-[#f59e0b]",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className={`text-5xl font-bold ${item.color} opacity-20`}>{item.step}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-lg">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-6">Para Estudiantes</h2>
            <div className="space-y-4">
              {[
                "Privacidad total de tus datos personales",
                "Verificación instantánea en cualquier plataforma",
                "Sin necesidad de compartir documentos físicos",
                "Credencial digital permanente y segura",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#22c55e] flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Para Instituciones</h2>
            <div className="space-y-4">
              {[
                "Verificación confiable sin almacenar datos sensibles",
                "Cumplimiento automático con regulaciones de privacidad",
                "Reducción de fraude estudiantil",
                "Integración simple con sistemas existentes",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Comienza a Verificar tu Identidad Hoy</h2>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Únete a la revolución de la privacidad digital. Prueba EqualPass ahora.
          </p>
          <Link to="/demo">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Probar Demo Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-[#0ea5e9]" />
                <span className="text-white font-bold text-lg">EqualPass</span>
              </div>
              <p className="text-sm">Verificación de identidad estudiantil con privacidad garantizada.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-[#0ea5e9] transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#0ea5e9] transition-colors">
                    Cómo Funciona
                  </a>
                </li>
                <li>
                  <Link to="/demo" className="hover:text-[#0ea5e9] transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-[#0ea5e9] transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0ea5e9] transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0ea5e9] transition-colors">
                    Soporte
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Síguenos</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-[#0ea5e9] transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-[#0ea5e9] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 EqualPass. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
