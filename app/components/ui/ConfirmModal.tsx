"use client";

import { useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  isLoading = false,
}: ConfirmModalProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      onConfirm(password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[var(--deep-black)]/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white neo-border-thick neo-shadow-lg p-6 animate-fade-in-up">
        <h2 className="font-display text-2xl mb-4">{title}</h2>
        <p className="font-body text-[var(--deep-black)]/80 mb-6">{message}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="modal-password"
              className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
            >
              Enter your password to confirm
            </label>
            <input
              id="modal-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="••••••••"
              className="neo-border neo-shadow-sm font-body focus:outline-none focus:ring-4 bg-white focus:ring-[var(--hot-pink)] px-6 py-3 text-base w-full"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="neo-border neo-shadow-sm font-display hover-lift transition-colors bg-white text-[var(--deep-black)] hover:bg-gray-100 px-6 py-3 text-base flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="neo-border neo-shadow-sm font-display hover-lift transition-colors bg-[var(--hot-pink)] text-white hover:bg-[var(--hot-pink)]/90 px-6 py-3 text-base flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : confirmButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
