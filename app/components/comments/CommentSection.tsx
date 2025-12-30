"use client";

import { useState, useMemo } from "react";
import { CommentForm } from "./CommentForm";
import { CommentThread } from "./CommentThread";
import { Button } from "@/app/components/ui";

interface SectionComment {
  id: string;
  userId: string;
  userName: string;
  texto: string;
  parentCommentId?: string | null;
  depth: number;
  upvotes: number;
  downvotes: number;
  didUpvote: boolean;
  didDownvote: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

interface CommentSectionProps {
  ideaId: string;
  comments: SectionComment[];
  currentUserId: string;
  currentUserName: string;
}

export function CommentSection({
  ideaId,
  comments: initialComments,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [sortBy, setSortBy] = useState<"newest" | "top">("newest");
  const [displayLimit, setDisplayLimit] = useState(50);

  const handleCommentAdded = (newComment: SectionComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, isDeleted: true, texto: "[deleted]" } : c
      )
    );
  };

  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    if (sortBy === "top") {
      sorted.sort((a, b) => {
        const scoreA = a.upvotes - a.downvotes;
        const scoreB = b.upvotes - b.downvotes;
        return scoreB - scoreA;
      });
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return sorted.slice(0, displayLimit);
  }, [comments, sortBy, displayLimit]);

  const hasMore = comments.length > displayLimit;

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h2 className="font-display font-bold text-3xl text-[var(--deep-black)] mb-4">
          Comments ({comments.length})
        </h2>

        <CommentForm
          ideaId={ideaId}
          onCommentAdded={handleCommentAdded}
          placeholder="What are your thoughts?"
        />
      </div>

      {comments.length > 0 && (
        <div className="mb-6">
          <div className="flex gap-3">
            <Button
              variant={sortBy === "newest" ? "primary" : "secondary"}
              onClick={() => setSortBy("newest")}
            >
              Newest
            </Button>
            <Button
              variant={sortBy === "top" ? "primary" : "secondary"}
              onClick={() => setSortBy("top")}
            >
              Top
            </Button>
          </div>
        </div>
      )}

      <CommentThread
        comments={sortedComments}
        ideaId={ideaId}
        currentUserId={currentUserId}
        onReply={handleCommentAdded}
        onDelete={handleCommentDeleted}
      />

      {hasMore && (
        <div className="mt-6 text-center animate-fade-in-up">
          <Button
            variant="secondary"
            onClick={() => setDisplayLimit((prev) => prev + 50)}
          >
            Load More Comments ({comments.length - displayLimit} remaining)
          </Button>
        </div>
      )}

      {comments.length === 0 && (
        <div className="text-center py-12 animate-fade-in-up">
          <p className="font-body text-lg text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}
