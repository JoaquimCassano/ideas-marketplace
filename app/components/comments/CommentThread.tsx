"use client";

import { useMemo } from "react";
import { CommentItem } from "./CommentItem";

interface ThreadComment {
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
  replies?: ThreadComment[];
}

interface CommentThreadProps {
  comments: ThreadComment[];
  ideaId: string;
  currentUserId: string;
  onReply: (comment: ThreadComment) => void;
  onDelete: (commentId: string) => void;
}

export function CommentThread({
  comments,
  ideaId,
  currentUserId,
  onReply,
  onDelete,
}: CommentThreadProps) {
  const sortedComments = useMemo(() => {
    const buildTree = (parentId: string | null = null): ThreadComment[] => {
      return comments
        .filter((c) => c.parentCommentId === parentId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((comment) => ({
          ...comment,
          replies: buildTree(comment.id),
        }));
    };

    return buildTree(null);
  }, [comments]);

  const renderComment = (comment: ThreadComment, index: number) => (
    <div key={comment.id} style={{ animationDelay: `${index * 50}ms` }}>
      <CommentItem
        comment={comment}
        ideaId={ideaId}
        currentUserId={currentUserId}
        onReply={onReply}
        onDelete={onDelete}
      />
      {(comment.replies?.length ?? 0) > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies!.map((reply: ThreadComment, replyIndex: number) =>
            renderComment(reply, replyIndex)
          )}
        </div>
      )}
    </div>
  );

  if (sortedComments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {sortedComments.map((comment, index) => renderComment(comment, index))}
    </div>
  );
}
