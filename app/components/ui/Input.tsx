import { InputHTMLAttributes } from "react";

type InputVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "error"
  | "success"
  | "warning";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
}

const variantStyles: Record<InputVariant, string> = {
  neutral: "bg-white focus:ring-gray-400",
  primary: "bg-white focus:ring-[var(--hot-pink)]",
  secondary: "bg-white focus:ring-[var(--electric-purple)]",
  accent: "bg-white focus:ring-[var(--lime)]",
  info: "bg-white focus:ring-[var(--sky-blue)]",
  error: "bg-white focus:ring-red-500 border-red-500",
  success: "bg-white focus:ring-green-500 border-green-500",
  warning: "bg-white focus:ring-[var(--sunny-yellow)]",
};

const sizeStyles: Record<InputSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export function Input({
  variant = "neutral",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`neo-border neo-shadow-sm font-body focus:outline-none focus:ring-4 transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
}
