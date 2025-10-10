import React from "react";

// Clean Vite-compatible landing page

const ShieldIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2l7 4v6c0 5-3.6 9.7-7 10-3.4-.3-7-5-7-10V6l7-4z"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.5} />
  </svg>
);

const LockIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="10" width="18" height="10" rx="2" stroke="currentColor" strokeWidth={1.5} />
    <path
      d="M7 10V8a5 5 0 0110 0v2"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FingerprintIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AwardIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const features = [
  {
    title: "Pruebas Zero-Knowledge",
    description: "Demuestra que eres estudiante sin revelar tu nombre, ID o universidad",
    icon: LockIcon,
  },
  {
    title: "Autenticación WebAuthn",
    description: "Verifica tu identidad con tu huella digital o reconocimiento facial",
    icon: FingerprintIcon,
  },
  {
    title: "NFT Soulbound",
    description: "Recibe una credencial digital no transferible en blockchain",
    icon: AwardIcon,
  },
];

const timeline = [
  {
    step: "1",
    title: "Ingresa tus datos académicos",
    description: "Año de estudio, ID de estudiante e ID de universidad",
    icon: EyeIcon,
  },
  {
    step: "2",
    title: "Genera la prueba ZK",
    description: "El sistema crea una prueba criptográfica sin revelar tus datos",
    icon: LockIcon,
  },
  {
    step: "3",
    title: "Registra tu dispositivo",
    description: "Configura la autenticación biométrica una sola vez",
    icon: FingerprintIcon,
  },
  {
    step: "4",
    title: "Verifica tu identidad",
    description: "Combina ZK + WebAuthn para máxima seguridad",
    icon: ShieldIcon,
  },
  {
    step: "5",
    title: "Recibe tu NFT",
    description: "Obtén tu credencial estudiantil verificada en blockchain",
    icon: AwardIcon,
  },
];

export default function LandingPage(): JSX.Element {
  return (
    <div className="prose-invert">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 rounded-full px-4 py-1 text-sm font-medium">
            Verificación de Identidad Estudiantil
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Verifica tu identidad estudiantil sin revelar datos personales
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            ZK-Scholar combina pruebas de conocimiento cero, autenticación biométrica y blockchain para crear
            un sistema de verificación estudiantil seguro y privado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="/demo"
              className="inline-block bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white rounded-lg text-lg px-8 py-3"
            >
              Probar Demo
            </a>
            <a href="/verifier" className="inline-block border rounded-lg text-lg px-8 py-3 bg-white">
              Ver Verificador
            </a>
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
            {features.map((f) => {
              const IconComp = f.icon;
              return (
                <div
                  key={f.title}
                  className="border-2 hover:border-[#0ea5e9]/50 transition-colors p-6 rounded"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center mb-4">
                    <IconComp className="h-6 w-6 text-[#0ea5e9]" />
                  </div>
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground mt-4">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                      <span>Privacidad matemáticamente garantizada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                      <span>Verificación criptográfica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                      <span>Sin intermediarios</span>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">Proceso de verificación</h2>
              <p className="text-lg text-muted-foreground">Simple, rápido y seguro en 5 pasos</p>
            </div>
            <div className="space-y-6">
              {timeline.map((item) => {
                const IconComp = item.icon;
                return (
                  <div key={item.step} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-bold text-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <IconComp className="h-5 w-5 text-[#0ea5e9]" />
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
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
                    <CheckIcon className="h-4 w-4 text-[#22c55e]" />
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
                    <CheckIcon className="h-4 w-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <div className="font-semibold">Verificación instantánea</div>
                    <div className="text-sm text-muted-foreground">
                      Demuestra tu estatus de estudiante en segundos
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="h-4 w-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <div className="font-semibold">Una sola credencial</div>
                    <div className="text-sm text-muted-foreground">
                      Úsala en múltiples plataformas y servicios
                    </div>
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
                    <ShieldIcon className="h-4 w-4 text-[#0ea5e9]" />
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
                    <ShieldIcon className="h-4 w-4 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <div className="font-semibold">Verificación confiable</div>
                    <div className="text-sm text-muted-foreground">
                      Pruebas criptográficas imposibles de falsificar
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldIcon className="h-4 w-4 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <div className="font-semibold">Integración simple</div>
                    <div className="text-sm text-muted-foreground">
                      API REST para verificar credenciales en minutos
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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
              <a
                href="/demo"
                className="inline-block bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white rounded-lg text-lg px-8 py-3"
              >
                Probar Demo Ahora
              </a>
              <a href="/verifier" className="inline-block border rounded-lg text-lg px-8 py-3 bg-white">
                Ver Verificador
              </a>
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
                <ShieldIcon className="h-6 w-6 text-[#0ea5e9]" />
                <span className="text-lg font-bold">ZK-Scholar</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Verificación de identidad estudiantil con privacidad garantizada
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Producto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/demo" className="hover:text-foreground transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="/verifier" className="hover:text-foreground transition-colors">
                    Verificador
                  </a>
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
            <p>© 2025 ZK-Scholar. Todos los derechos reservados.</p>
            <p className="mt-2">Powered by Zero-Knowledge Proofs + WebAuthn + Blockchain</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
