import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  containerClassName?: string;
};

export const Input: React.FC<Props> = ({ label, containerClassName = "", ...rest }) => {
  return (
    <label className={`flex flex-col text-sm gap-1 ${containerClassName}`}>
      {label && <span className="text-gray-700 font-medium text-xs">{label}</span>}
      <input
        className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-sm"
        {...rest}
      />
    </label>
  );
};

export default Input;
