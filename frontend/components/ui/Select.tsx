import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  options?: { value: string; label: string }[];
}

export default function Select({
  label,
  id,
  options,
  children,
  className = "",
  ...props
}: SelectProps) {
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
      <select
        id={id}
        className={`w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-sm text-zinc-900 outline-none focus:border-indigo-500 transition-colors duration-150 cursor-pointer font-medium box-border ${className}`}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    </div>
  );
}
