import React from "react";

type Props = {
  type?: "info" | "success" | "error" | "warning";
  children: React.ReactNode;
  className?: string;
};

const colors: Record<string, string> = {
  info: "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-800 border-indigo-100",
  success: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200",
  error: "bg-gradient-to-r from-rose-50 to-red-50 text-rose-800 border-rose-100",
  warning: "bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-800 border-amber-100",
};

export const Message: React.FC<Props> = ({ type = "info", children, className = "" }) => {
  return (
    <div className={`p-3 rounded-lg border shadow-sm text-sm ${colors[type]} ${className}`}>{children}</div>
  );
};

export default Message;
