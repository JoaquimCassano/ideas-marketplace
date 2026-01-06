"use client";

import { useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XIcon,
} from "../icons";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type?: ToastVariant;
  title?: string;
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-green-100 border-green-500",
  error: "bg-red-100 border-red-500",
  warning: "bg-[var(--sunny-yellow)]/20 border-[var(--sunny-yellow)]",
  info: "bg-[var(--sky-blue)]/20 border-[var(--sky-blue)]",
};

const iconColors: Record<ToastVariant, string> = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-700",
  info: "text-blue-600",
};

const Icons: Record<ToastVariant, React.ElementType> = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon,
};

const stripStyles: Record<ToastVariant, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-[var(--sunny-yellow)]",
  info: "bg-[var(--sky-blue)]",
};

export function Toast({
  id,
  type = "info",
  title,
  message,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const Icon = Icons[type];

  return (
    <div
      role="alert"
      className={`relative w-full max-w-sm overflow-hidden neo-border neo-shadow p-4 shadow-lg transition-all animate-fade-in-up flex gap-3 items-start ${variantStyles[type]}`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${stripStyles[type]}`}
      />

      <div className={`mt-0.5 shrink-0 ${iconColors[type]}`}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1 pt-0.5">
        {title && (
          <h3 className="font-display text-sm font-bold mb-1">{title}</h3>
        )}
        <p className="font-body text-sm text-gray-600 leading-relaxed">
          {message}
        </p>
      </div>

      <button
        onClick={() => onClose(id)}
        className="shrink-0 -mt-1 -mr-1 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Close"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
