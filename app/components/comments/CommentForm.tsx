"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui";

interface NewComment {
  id: string;
  userId: string;
  userName: string;
  texto: string;
  parentCommentId?: string;
  depth: number;
  upvotes: number;
  downvotes: number;
  didUpvote: boolean;
  didDownvote: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CommentFormProps {
  ideaId: string;
  parentCommentId?: string;
  onCommentAdded: (comment: NewComment) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  ideaId,
  parentCommentId,
  onCommentAdded,
  onCancel,
  placeholder = "Share your thoughts...",
  autoFocus = false,
}: CommentFormProps) {
  const [texto, setTexto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!texto.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (texto.length > 10000) {
      setError("Comment too long (max 10,000 characters)");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, parentCommentId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to post comment");
      }

      const newComment = await response.json();
      onCommentAdded(newComment);
      setTexto("");
      onCancel?.();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 animate-fade-in-up">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={4}
        maxLength={10000}
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-white neo-border neo-shadow font-body text-base text-[var(--deep-black)] placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[var(--hot-pink)] focus:ring-opacity-30 transition-all resize-none disabled:opacity-50"
      />

      {error && (
        <p className="text-sm font-medium text-[var(--hot-pink)]">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} variant="primary">
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>

        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        )}
      </div>

      {texto.length > 9000 && (
        <p className="text-xs text-gray-600">
          {10000 - texto.length} characters remaining
        </p>
      )}
    </form>
  );
}
