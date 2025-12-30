"use client";

import { useState, useTransition } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@/app/components/icons";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: {
    id: string;
    userId: string;
    userName: string;
    texto: string;
    depth: number;
    upvotes: number;
    downvotes: number;
    didUpvote: boolean;
    didDownvote: boolean;
    isDeleted: boolean;
    createdAt: Date;
  };
  ideaId: string;
  currentUserId: string;
  onReply: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
}

interface Comment {
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
}

export function CommentItem({
  comment,
  ideaId,
  currentUserId,
  onReply,
  onDelete,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [optimisticVotes, setOptimisticVotes] = useState({
    upvotes: comment.upvotes,
    downvotes: comment.downvotes,
    didUpvote: comment.didUpvote,
    didDownvote: comment.didDownvote,
  });

  const handleVote = async (voteType: "upvote" | "downvote") => {
    const currentlyUpvoted = optimisticVotes.didUpvote;
    const currentlyDownvoted = optimisticVotes.didDownvote;

    let newUpvotes = optimisticVotes.upvotes;
    let newDownvotes = optimisticVotes.downvotes;
    let newDidUpvote = currentlyUpvoted;
    let newDidDownvote = currentlyDownvoted;

    if (voteType === "upvote") {
      if (currentlyUpvoted) {
        newUpvotes -= 1;
        newDidUpvote = false;
      } else {
        newUpvotes += 1;
        newDidUpvote = true;
        if (currentlyDownvoted) {
          newDownvotes -= 1;
          newDidDownvote = false;
        }
      }
    } else {
      if (currentlyDownvoted) {
        newDownvotes -= 1;
        newDidDownvote = false;
      } else {
        newDownvotes += 1;
        newDidDownvote = true;
        if (currentlyUpvoted) {
          newUpvotes -= 1;
          newDidUpvote = false;
        }
      }
    }

    startTransition(async () => {
      setOptimisticVotes({
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        didUpvote: newDidUpvote,
        didDownvote: newDidDownvote,
      });

      try {
        const response = await fetch(
          `/api/ideas/${ideaId}/comments/${comment.id}/vote`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voteType }),
          }
        );

        if (!response.ok) throw new Error("Failed to vote");

        const data = await response.json();
        setOptimisticVotes({
          upvotes: data.upvotes,
          downvotes: data.downvotes,
          didUpvote: data.didUpvote,
          didDownvote: data.didDownvote,
        });
      } catch {
        setOptimisticVotes({
          upvotes: comment.upvotes,
          downvotes: comment.downvotes,
          didUpvote: comment.didUpvote,
          didDownvote: comment.didDownvote,
        });
      }
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/ideas/${ideaId}/comments/${comment.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete");

      onDelete(comment.id);
    } catch {
      console.error("Error deleting comment");
    }
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const score = optimisticVotes.upvotes - optimisticVotes.downvotes;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        marginLeft: comment.depth > 0 ? `${comment.depth * 24}px` : "0",
        animationDelay: "50ms",
      }}
    >
      <div className="bg-white neo-border neo-shadow p-4 hover-lift">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              onClick={() => handleVote("upvote")}
              className={`p-1 transition-colors hover:scale-110 ${
                optimisticVotes.didUpvote
                  ? "text-[var(--lime)]"
                  : "text-gray-400 hover:text-[var(--lime)]"
              }`}
              aria-label="Upvote"
            >
              <ArrowUpIcon className="w-5 h-5" />
            </button>

            <span
              className={`text-sm font-bold font-display ${
                score > 0
                  ? "text-[var(--lime)]"
                  : score < 0
                    ? "text-[var(--hot-pink)]"
                    : "text-gray-600"
              }`}
            >
              {score}
            </span>

            <button
              onClick={() => handleVote("downvote")}
              className={`p-1 transition-colors hover:scale-110 ${
                optimisticVotes.didDownvote
                  ? "text-[var(--hot-pink)]"
                  : "text-gray-400 hover:text-[var(--hot-pink)]"
              }`}
              aria-label="Downvote"
            >
              <ArrowDownIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display font-bold text-sm text-[var(--deep-black)]">
                {comment.userName}
              </span>
              <span className="text-xs text-gray-500">
                {timeAgo(comment.createdAt)}
              </span>
              {comment.userId === currentUserId && !comment.isDeleted && (
                <button
                  onClick={handleDelete}
                  className="ml-auto text-xs font-medium text-[var(--hot-pink)] hover:underline"
                >
                  delete
                </button>
              )}
            </div>

            <p
              className={`font-body text-base leading-relaxed mb-3 ${
                comment.isDeleted
                  ? "text-gray-400 italic"
                  : "text-[var(--deep-black)]"
              }`}
            >
              {comment.texto}
            </p>

            {!comment.isDeleted && comment.depth < 6 && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-sm font-medium text-[var(--electric-purple)] hover:text-[var(--hot-pink)] transition-colors"
              >
                {isReplying ? "Cancel" : "Reply"}
              </button>
            )}

            {comment.depth >= 6 && !comment.isDeleted && (
              <p className="text-xs text-gray-500 italic">
                Maximum nesting depth reached
              </p>
            )}

            {isReplying && (
              <div className="mt-4">
                <CommentForm
                  ideaId={ideaId}
                  parentCommentId={comment.id}
                  onCommentAdded={(newComment) => {
                    onReply(newComment);
                    setIsReplying(false);
                  }}
                  onCancel={() => setIsReplying(false)}
                  placeholder={`Reply to ${comment.userName}...`}
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
