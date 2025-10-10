import React from "react";
import VerifierForm from "../components/VerifierForm";

const IconShieldCheck = ({ className = "w-5 h-5 text-sky-500" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 2l7 4v5c0 5-3.5 9-7 11-3.5-2-7-6-7-11V6l7-4z" />
    <path d="M9 12l2 2 4-4" strokeWidth={2} />
  </svg>
);

export default function VerifierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button + header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 focus:outline-none"
            aria-label="Volver"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Atrás</span>
          </button>
        </div>

        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full text-sky-700 font-medium">
            <IconShieldCheck className="w-4 h-4" />
            <span>Portal Institucional</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">Verificador de Credenciales</h1>

          <p className="text-md text-slate-600 max-w-2xl mx-auto">
            Verifica la autenticidad de badges estudiantiles sin acceder a información personal
          </p>
        </div>

        <VerifierForm />

        <div className="mt-8 p-4 bg-slate-50 rounded-lg text-sm text-slate-700">
          <strong>Nota de privacidad:</strong> Este sistema no revela información personal identificable
          (PII). Solo confirma el estado de validez del badge y su tipo.
        </div>
      </div>
    </div>
  );
}
