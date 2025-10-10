"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export default function BackButton({ className = "" }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus:outline-none ${className}`}
      aria-label="Volver al inicio"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Atrás</span>
    </button>
  );
}
