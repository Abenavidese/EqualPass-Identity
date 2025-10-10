import React from "react";
import Button from "../components/ui/Button";
import NFTCard from "../components/ui/NFTCard";

// Simple local Icon components to avoid adding lucide-react dependency
const IconShield = ({ className = "w-6 h-6 text-sky-500" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 2l7 4v5c0 5-3.5 9-7 11-3.5-2-7-6-7-11V6l7-4z" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4 text-emerald-500" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <nav className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-md bg-sky-100">
              <IconShield className="w-7 h-7 text-[#0ea5e9]" />
            </div>
            <span className="text-lg font-bold">EqualPass</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/test">
              <Button variant="secondary">Demo</Button>
            </a>
            <a href="/test">
              <Button variant="secondary">Verificador</Button>
            </a>
            <a href="/test">
              <Button className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90">Comenzar</Button>
            </a>
          </div>
        </div>
      </nav>

      <header className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            Verificación de Identidad Estudiantil
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900">
            Verifica tu identidad estudiantil sin revelar datos personales
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            EqualPass combina pruebas de conocimiento cero, autenticación biométrica y blockchain para crear un
            sistema de verificación estudiantil seguro y privado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a href="/test">
              <Button className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-lg px-8">Probar Demo</Button>
            </a>
            <a href="/test">
              <Button variant="secondary" className="text-lg px-8 bg-transparent">
                Ver Verificador
              </Button>
            </a>
          </div>
        </div>
      </header>

      <section className="border-y bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-[#0ea5e9]">100%</div>
              <div className="text-sm text-slate-600">Privacidad garantizada</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#22c55e]">Zero</div>
              <div className="text-sm text-slate-600">Datos personales expuestos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0ea5e9]">Blockchain</div>
              <div className="text-sm text-slate-600">Verificación descentralizada</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">¿Cómo funciona?</h2>
            <p className="text-lg text-slate-600">Tres capas de seguridad para proteger tu identidad estudiantil</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l7 4v5c0 5-3.5 9-7 11-3.5-2-7-6-7-11V6l7-4z" />
                </svg>
              </div>
              <h3 className="font-semibold">Pruebas Zero-Knowledge</h3>
              <p className="text-sm text-slate-600 mt-2">Demuestra que eres estudiante sin revelar tus datos</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <IconCheck /> <span>Privacidad matemáticamente garantizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck /> <span>Verificación criptográfica</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck /> <span>Sin intermediarios</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[#22c55e]/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2a4 4 0 00-4 4v2a4 4 0 008 0V6a4 4 0 00-4-4z" />
                </svg>
              </div>
              <h3 className="font-semibold">Autenticación WebAuthn</h3>
              <p className="text-sm text-slate-600 mt-2">Verifica tu identidad con biometría local</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <IconCheck /> <span>Biometría local en tu dispositivo</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck /> <span>Protección anti-fraude</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck /> <span>Estándar web seguro</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-[#f59e0b]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
                </svg>
              </div>
              <h3 className="font-semibold">NFT Soulbound</h3>
              <p className="text-sm text-slate-600 mt-2">Recibe una credencial digital no transferible</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <IconCheck /> <span>Credencial permanente</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck /> <span>No transferible ni vendible</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck /> <span>Verificable públicamente</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold">Para estudiantes</h2>
            <p className="text-lg text-slate-600">Accede a descuentos y beneficios estudiantiles sin comprometer tu privacidad</p>
            <ul className="space-y-4 mt-6">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5">
                  <IconCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="font-semibold">Privacidad total</div>
                  <div className="text-sm text-slate-600">Nunca compartas tu nombre, dirección o datos personales</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5">
                  <IconCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="font-semibold">Verificación instantánea</div>
                  <div className="text-sm text-slate-600">Demuestra tu estatus de estudiante en segundos</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center mt-0.5">
                  <IconCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="font-semibold">Una sola credencial</div>
                  <div className="text-sm text-slate-600">Úsala en múltiples plataformas y servicios</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <NFTCard title="EqualPass Preview" tokenId={null} />
          </div>
        </div>
      </section>

      <footer className="border-t py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IconShield className="w-6 h-6 text-[#0ea5e9]" />
                <span className="text-lg font-bold">EqualPass</span>
              </div>
              <p className="text-sm text-slate-600">Verificación de identidad estudiantil con privacidad garantizada</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Producto</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="/test" className="hover:text-slate-900 transition-colors">Demo</a>
                </li>
                <li>
                  <a href="/test" className="hover:text-slate-900 transition-colors">Verificador</a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Tecnología</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Zero-Knowledge Proofs</li>
                <li>WebAuthn</li>
                <li>Polkadot Paseo</li>
                <li>Soulbound NFTs</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Privacidad</li>
                <li>Términos de uso</li>
                <li>Documentación</li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-12 pt-8 border-t text-center text-sm text-slate-600">
            <p>© 2025 EqualPass. Todos los derechos reservados.</p>
            <p className="mt-2">Powered by Zero-Knowledge Proofs + WebAuthn + Blockchain</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
