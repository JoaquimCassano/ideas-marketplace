"use client";

import { useOptimistic, useTransition } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@/app/components/icons";

interface IdeaDetailCardProps {
  idea: {
    id: string;
    titulo: string;
    descricao?: string;
    tags: string[];
    autorId: string;
    autorName: string;
    upvotes: number;
    downvotes: number;
    didUpvote: boolean;
    didDownvote: boolean;
    commentCount: number;
    createdAt: Date;
  };
  currentUserId: string;
}

export function IdeaDetailCard({ idea }: IdeaDetailCardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticVotes, setOptimisticVotes] = useOptimistic({
    upvotes: idea.upvotes,
    downvotes: idea.downvotes,
    didUpvote: idea.didUpvote,
    didDownvote: idea.didDownvote,
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
        const response = await fetch(`/api/ideas/${idea.id}/vote`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voteType }),
        });

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
          upvotes: idea.upvotes,
          downvotes: idea.downvotes,
          didUpvote: idea.didUpvote,
          didDownvote: idea.didDownvote,
        });
      }
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const score = optimisticVotes.upvotes - optimisticVotes.downvotes;

  return (
    <article className="bg-white neo-border neo-shadow p-8 mb-8 animate-fade-in-up">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => handleVote("upvote")}
            className={`p-2 transition-all hover:scale-110 ${
              optimisticVotes.didUpvote
                ? "text-[var(--lime)]"
                : "text-gray-400 hover:text-[var(--lime)]"
            }`}
            aria-label="Upvote idea"
          >
            <ArrowUpIcon className="w-7 h-7" />
          </button>

          <span
            className={`text-2xl font-bold font-display ${
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
            className={`p-2 transition-all hover:scale-110 ${
              optimisticVotes.didDownvote
                ? "text-[var(--hot-pink)]"
                : "text-gray-400 hover:text-[var(--hot-pink)]"
            }`}
            aria-label="Downvote idea"
          >
            <ArrowDownIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h1 className="font-display font-bold text-4xl text-[var(--deep-black)] mb-3 leading-tight">
              {idea.titulo}
            </h1>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-medium">
                by{" "}
                <span className="font-display font-bold text-[var(--electric-purple)]">
                  {idea.autorName}
                </span>
              </span>
              <span>•</span>
              <time dateTime={idea.createdAt.toString()}>
                {formatDate(idea.createdAt)}
              </time>
            </div>
          </div>

          {idea.descricao && (
            <div className="mb-6">
              <p className="font-body text-lg leading-relaxed text-[var(--deep-black)] whitespace-pre-wrap">
                {idea.descricao}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[var(--lime)] text-[var(--deep-black)] text-sm font-bold font-display neo-border inline-block"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t-4 border-black">
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-2">
                <span className="text-[var(--lime)] font-bold">
                  {optimisticVotes.upvotes}
                </span>
                upvotes
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[var(--hot-pink)] font-bold">
                  {optimisticVotes.downvotes}
                </span>
                downvotes
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[var(--electric-purple)] font-bold">
                  {idea.commentCount}
                </span>
                comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
