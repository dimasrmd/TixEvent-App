import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

export default function Input({
  label,
  id,
  type = "text",
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-[11px] font-bold uppercase tracking-wider text-zinc-500"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2 px-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-500 transition-colors duration-150 box-border ${className}`}
        {...props}
      />
    </div>
  );
}
