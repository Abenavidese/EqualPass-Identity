import React from "react";

export const Spinner: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 16 }) => (
  <svg
    className={`${className} animate-spin text-pink-500`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden
  >
    <defs>
      <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <circle
      className="opacity-25 text-gray-200"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    ></circle>
    <path fill="url(#g)" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
);

export default Spinner;
