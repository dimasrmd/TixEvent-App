import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "dark" | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = true,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer outline-none";
  
  const widthStyle = fullWidth ? "w-full" : "";
  
  const sizeStyles = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-3 px-4",
    lg: "text-base py-4 px-6"
  };

  const variantStyles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-sm hover:shadow",
    secondary: "bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm hover:shadow",
    danger: "bg-red-500 hover:bg-red-600 text-white border-none shadow-sm hover:shadow",
    outline: "bg-transparent hover:bg-zinc-50 text-indigo-600 border border-indigo-600",
    dark: "bg-zinc-800 hover:bg-zinc-900 text-white border-none shadow-sm",
    link: "bg-transparent text-indigo-600 hover:text-indigo-800 p-0 font-semibold"
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${baseStyles} ${widthStyle} ${currentVariant} ${currentSize} ${isDisabled ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Memproses...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
