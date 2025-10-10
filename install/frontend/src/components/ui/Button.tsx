import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "success" | "danger";
  loading?: boolean;
};

const variants: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:scale-[1.01] transform",
  secondary: "bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-sm hover:brightness-105 transform",
  success:
    "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:scale-[1.01] transform",
  danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md hover:scale-[1.01] transform",
};

export const Button: React.FC<Props> = ({
  variant = "primary",
  loading,
  children,
  className = "",
  ...rest
}) => {
  const base =
    "px-4 py-2 rounded-lg disabled:opacity-60 flex items-center gap-2 transition-transform duration-150";
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
