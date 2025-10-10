import React from "react";
import WebAuthnDemo from "../components/WebAuthnDemo";
import VerifierForm from "../components/VerifierForm";

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6">
        <div>
          <WebAuthnDemo />
        </div>
        <div>
          <VerifierForm />
        </div>
      </div>
    </div>
  );
};

export default TestPage;
