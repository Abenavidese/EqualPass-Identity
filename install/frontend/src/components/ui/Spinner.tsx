import React from "react";

export const Spinner: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 16 }) => (
  <svg className={`${className} animate-spin`} width={size} height={size} viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    ></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
);

export default Spinner;
