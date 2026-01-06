"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastProps } from "../ui/Toast";

type ToastContextType = {
  toast: (props: Omit<ToastProps, "id" | "onClose">) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      type = "info",
      title,
      message,
      duration = 5000,
    }: Omit<ToastProps, "id" | "onClose">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [
        ...prev,
        { id, type, title, message, duration, onClose: removeToast },
      ]);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) =>
      addToast({ type: "success", message, title }),
    [addToast]
  );
  const error = useCallback(
    (message: string, title?: string) =>
      addToast({ type: "error", message, title }),
    [addToast]
  );
  const info = useCallback(
    (message: string, title?: string) =>
      addToast({ type: "info", message, title }),
    [addToast]
  );
  const warning = useCallback(
    (message: string, title?: string) =>
      addToast({ type: "warning", message, title }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
