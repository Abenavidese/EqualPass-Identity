import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "success" | "danger";
  loading?: boolean;
};

const variants: Record<string, string> = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

export const Button: React.FC<Props> = ({
  variant = "primary",
  loading,
  children,
  className = "",
  ...rest
}) => {
  const base = "px-4 py-2 rounded disabled:opacity-60 flex items-center gap-2";
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
      disabled={rest.disabled || loading}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
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
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
