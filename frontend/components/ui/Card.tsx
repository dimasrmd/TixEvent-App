import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string; // e.g. "450px" or "500px"
}

export default function Card({ children, className = "", maxWidth = "450px" }: CardProps) {
  return (
    <div
      className={`w-full bg-white border border-zinc-200 rounded-2xl shadow-md p-8 box-border ${className}`}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}
