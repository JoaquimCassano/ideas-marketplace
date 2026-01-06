"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpIcon, ArrowDownIcon, SparkleIcon } from "@/app/components";
import { getGravatarUrl } from "@/app/lib/avatar";
import { Idea } from "../types";
import { TAG_COLORS } from "../constants";
import { useToast } from "@/app/components";

const IdeaFeedCard = function IdeaFeedCard({
  idea,
  onVote,
  index,
}: {
  idea: Idea;
  onVote: (id: string, voteType: "upvote" | "downvote") => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(getGravatarUrl("", 200));

  const fetchAvatar = async () => {
    try {
      const response = await fetch(`/api/users/${idea.autorId}/avatar`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.avatarUrl);
      }
    } catch {
      // Keep the default gravatar
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [idea.autorId]);

  useEffect(() => {
    const handleFocus = () => {
      fetchAvatar();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const getVoteButtonClass = (type: "upvote" | "downvote") => {
    const isActive = idea.userVote === type;
    if (type === "upvote") {
      return isActive
        ? "bg-[var(--lime)] scale-110"
        : "bg-white hover:bg-[var(--lime)] hover:scale-105";
    }
    return isActive
      ? "bg-[var(--hot-pink)] text-white scale-110"
      : "bg-white hover:bg-[var(--hot-pink)] hover:text-white hover:scale-105";
  };
  const { success, error } = useToast();

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success("Link copied to clipboard!", "Nice!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      error("Failed to copy link.", "Oops!");
    }
  };

  return (
    <div
      className="neo-border neo-shadow bg-white p-5 hover-lift group opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: "forwards",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <button
            onClick={() => onVote(idea.id, "upvote")}
            className={`neo-border p-2 transition-all duration-200 ${getVoteButtonClass("upvote")}`}
          >
            <ArrowUpIcon className="w-5 h-5" />
          </button>
          <span
            className={`font-display text-xl transition-all duration-300 ${
              idea.userVote === "upvote"
                ? "text-[var(--lime)] scale-110"
                : idea.userVote === "downvote"
                  ? "text-[var(--hot-pink)]"
                  : ""
            }`}
          >
            {idea.upvotes - idea.downvotes}
          </span>
          <button
            onClick={() => onVote(idea.id, "downvote")}
            className={`neo-border p-2 transition-all duration-200 ${getVoteButtonClass("downvote")}`}
          >
            <ArrowDownIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={idea.autorName || "Anonymous"}
              className="w-6 h-6 rounded border-2 border-black object-cover"
            />
            <span className="font-body text-sm font-medium">
              {idea.autorName || "Anonymous"}
            </span>
            <span className="text-[var(--deep-black)]/40">•</span>
            <span className="font-body text-sm text-[var(--deep-black)]/60">
              {formatTimeAgo(idea.createdAt)}
            </span>
          </div>

          <Link href={`/idea/${idea.id}`}>
            <h3 className="font-display text-lg md:text-xl mb-2 group-hover:text-[var(--hot-pink)] transition-colors">
              {idea.titulo}
            </h3>
          </Link>

          <p className="font-body text-[var(--deep-black)]/80 mb-4 line-clamp-2">
            {idea.descricao}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {idea.tags.map((tag, idx) => (
              <span
                key={tag}
                className={`neo-border text-xs px-3 py-1 font-medium transition-transform hover:scale-105 ${TAG_COLORS[idx % TAG_COLORS.length]}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`/idea/${idea.id}`}
              className="flex items-center gap-1 font-body text-sm text-[var(--deep-black)]/60 hover:text-[var(--hot-pink)] transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {idea.commentCount || 0} comments
            </Link>
            <button
              className="flex items-center gap-1 font-body text-sm text-[var(--deep-black)]/60 hover:text-[var(--electric-purple)] transition-colors"
              onClick={() =>
                copyToClipboard(window.location.origin + `/idea/${idea.id}`)
              }
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              share
            </button>
          </div>
        </div>

        <div
          className={`absolute -top-2 -right-2 transition-all duration-300 ${
            isHovered ? "opacity-100 rotate-12" : "opacity-0 rotate-0"
          }`}
        >
          <div className="neo-border bg-[var(--sunny-yellow)] p-1">
            <SparkleIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaFeedCard;
