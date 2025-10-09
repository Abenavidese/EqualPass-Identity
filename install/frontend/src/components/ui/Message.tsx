import React from "react";

type Props = {
  type?: "info" | "success" | "error" | "warning";
  children: React.ReactNode;
  className?: string;
};

const colors: Record<string, string> = {
  info: "bg-blue-50 text-blue-800 border-blue-100",
  success: "bg-emerald-50 text-emerald-800 border-emerald-100",
  error: "bg-red-50 text-red-800 border-red-100",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-100",
};

export const Message: React.FC<Props> = ({ type = "info", children, className = "" }) => {
  return <div className={`p-3 rounded border ${colors[type]} ${className}`}>{children}</div>;
};

export default Message;
