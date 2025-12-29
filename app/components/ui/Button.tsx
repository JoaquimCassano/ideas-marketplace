import { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "error"
  | "success"
  | "warning";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  neutral: "bg-white text-[var(--deep-black)] hover:bg-gray-100",
  primary: "bg-[var(--hot-pink)] text-white hover:bg-[var(--hot-pink)]/90",
  secondary:
    "bg-[var(--electric-purple)] text-white hover:bg-[var(--electric-purple)]/90",
  accent: "bg-[var(--lime)] text-[var(--deep-black)] hover:bg-[var(--lime)]/90",
  info: "bg-[var(--sky-blue)] text-white hover:bg-[var(--sky-blue)]/90",
  error: "bg-red-500 text-white hover:bg-red-600",
  success: "bg-green-500 text-white hover:bg-green-600",
  warning:
    "bg-[var(--sunny-yellow)] text-[var(--deep-black)] hover:bg-[var(--sunny-yellow)]/90",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "neutral",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`neo-border neo-shadow-sm font-display hover-lift transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
