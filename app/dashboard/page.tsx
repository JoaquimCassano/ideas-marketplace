"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LightbulbIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparkleIcon,
  StarIcon,
  Button,
  Input,
} from "../components";

interface Idea {
  id: string;
  titulo: string;
  descricao: string;
  upvotes: number;
  downvotes: number;
  userVote: "upvote" | "downvote" | null;
  autorId: string;
  autorName?: string;
  tags: string[];
  commentCount: number;
  createdAt: string;
}

interface ApiIdea {
  id: string;
  titulo: string;
  descricao: string;
  tags: string[];
  autorId: string;
  autorName?: string;
  upvotes: number;
  downvotes: number;
  didUpvote: boolean;
  didDownvote: boolean;
  comentarios: unknown[];
  createdAt: string;
  updatedAt: string;
}

const IdeaFeedCard = memo(function IdeaFeedCard({
  idea,
  onVote,
  index,
}: {
  idea: Idea;
  onVote: (id: string, voteType: "upvote" | "downvote") => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

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

  const tagColors = [
    "bg-[var(--lime)]",
    "bg-[var(--sunny-yellow)]",
    "bg-[var(--sky-blue)]",
    "bg-[var(--electric-purple)] text-white",
    "bg-[var(--hot-pink)] text-white",
  ];

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
                className={`neo-border text-xs px-3 py-1 font-medium transition-transform hover:scale-105 ${tagColors[idx % tagColors.length]}`}
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
            <button className="flex items-center gap-1 font-body text-sm text-[var(--deep-black)]/60 hover:text-[var(--electric-purple)] transition-colors">
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
});

function CreateIdeaBox({
  onCreateIdea,
  userName,
}: {
  onCreateIdea: (idea: Idea) => void;
  userName: string;
}) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_LENGTH = 500;
  const showExtras = titulo.trim() || tags.length > 0;

  const validateForm = (): string | null => {
    if (!titulo.trim()) {
      return "Title is required";
    }
    if (!descricao.trim()) {
      return "Description with content is required";
    }
    if (tags.length < 3) {
      return `You need at least 3 tags (${tags.length}/3)`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage("");

    setIsLoading(true);
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          tags: tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create idea");
      }

      const data = await response.json();

      onCreateIdea({
        id: data.id,
        titulo: data.titulo,
        descricao: data.descricao,
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        autorId: data.autorId,
        autorName: userName,
        tags: data.tags,
        commentCount: 0,
        createdAt: data.createdAt,
      });

      setTitulo("");
      setDescricao("");
      setTags([]);
      setTagInput("");
    } catch (error) {
      console.error("Error creating idea:", error);
      setErrorMessage("Error creating idea. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="neo-border neo-shadow-lg bg-white p-6 mb-6 animate-fade-in-up stagger-1">
      {errorMessage && (
        <div className="neo-border bg-[var(--hot-pink)] text-white p-4 mb-4 font-body text-sm flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex-1">
            <p className="font-medium">Oops!</p>
            <p>{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="flex-shrink-0 hover:opacity-80"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="neo-border bg-[var(--lime)] p-3 hidden sm:block">
          <LightbulbIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: App that turns memes into NFTs..."
            variant="accent"
            size="lg"
            className="w-full mb-4"
          />

          {showExtras && (
            <>
              <div className="flex justify-end mb-2">
                <span className="text-sm font-body text-[var(--deep-black)]/50">
                  {descricao.length}/{MAX_LENGTH}
                </span>
              </div>
              <textarea
                value={descricao}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_LENGTH) {
                    setDescricao(e.target.value);
                  }
                }}
                placeholder="Descreva sua ideia em detalhes..."
                className="neo-border bg-[var(--cream)] p-4 w-full min-h-[120px] mb-4 font-body text-sm resize-none focus:outline-none focus:bg-white"
              />
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap items-center">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="neo-border bg-[var(--lime)] px-3 py-1 text-sm font-body flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-[var(--hot-pink)]"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  placeholder="+ tag"
                  size="sm"
                  className="w-24"
                />
                <button
                  onClick={addTag}
                  className="neo-border bg-[var(--cream)] px-2 py-1 text-sm font-body hover:bg-[var(--lime)]"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={isLoading}
                className="neo-border-thick whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <SparkleIcon className="w-5 h-5" />
                  {isLoading ? "CREATING..." : "CREATE IDEA"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  const fetchIdeas = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ideas?sortBy=${sortBy}&limit=50`);
      if (!response.ok) {
        throw new Error("Failed to fetch ideas");
      }
      const data = await response.json();
      const formattedIdeas = data.data.map((apiIdea: ApiIdea) => ({
        id: apiIdea.id,
        titulo: apiIdea.titulo,
        descricao: apiIdea.descricao,
        upvotes: apiIdea.upvotes,
        downvotes: apiIdea.downvotes,
        userVote: apiIdea.didUpvote
          ? "upvote"
          : apiIdea.didDownvote
            ? "downvote"
            : null,
        autorId: apiIdea.autorId,
        autorName: apiIdea.autorName || "Anonymous",
        tags: apiIdea.tags,
        commentCount: apiIdea.comentarios?.length || 0,
        createdAt: apiIdea.createdAt,
      }));
      setIdeas(formattedIdeas);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      setIdeas([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchIdeas();
    }
  }, [status, sortBy, fetchIdeas]);

  const handleAddIdea = (newIdea: Idea) => {
    setIdeas((prev) => [newIdea, ...prev]);
  };

  const handleVote = async (id: string, voteType: "upvote" | "downvote") => {
    try {
      const response = await fetch(`/api/ideas/${id}/vote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteType }),
      });

      if (!response.ok) {
        throw new Error("Failed to vote");
      }

      setIdeas((prev) =>
        prev.map((idea) => {
          if (idea.id !== id) return idea;

          let newUserVote: "upvote" | "downvote" | null = voteType;
          let newUpvotes = idea.upvotes;
          let newDownvotes = idea.downvotes;

          if (idea.userVote === voteType) {
            newUserVote = null;
            if (voteType === "upvote") {
              newUpvotes--;
            } else {
              newDownvotes--;
            }
          } else if (idea.userVote === null) {
            if (voteType === "upvote") {
              newUpvotes++;
            } else {
              newDownvotes++;
            }
          } else {
            if (voteType === "upvote") {
              newUpvotes++;
              newDownvotes--;
            } else {
              newDownvotes++;
              newUpvotes--;
            }
          }

          return {
            ...idea,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote,
          };
        })
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="neo-border neo-shadow bg-white p-8">
          <div className="flex items-center gap-3">
            <div className="neo-border bg-[var(--lime)] p-3 animate-pulse">
              <LightbulbIcon className="w-6 h-6" />
            </div>
            <span className="font-display text-xl">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || "Creator";

  const EmptyState = () => (
    <div className="neo-border neo-shadow-lg bg-white p-12 text-center animate-fade-in-up">
      <div className="mb-6 flex justify-center">
        <div className="neo-border bg-[var(--sunny-yellow)] p-6 inline-block">
          <LightbulbIcon className="w-12 h-12" />
        </div>
      </div>
      <h3 className="font-display text-2xl mb-2">No ideas yet</h3>
      <p className="font-body text-[var(--deep-black)]/60 mb-6">
        Be the first one to share an idea!
      </p>
      <div className="inline-block neo-border bg-[var(--lime)] px-4 py-2">
        <span className="font-body text-sm font-bold">
          👆 Use the box above to create an idea
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--cream)] bg-grid relative noise-overlay">
      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 animate-spin-slow opacity-20 pointer-events-none hidden md:block">
        <StarIcon className="w-20 h-20 text-[var(--hot-pink)]" />
      </div>
      <div className="fixed bottom-20 left-10 animate-float opacity-15 pointer-events-none hidden md:block">
        <LightbulbIcon className="w-16 h-16 text-[var(--sunny-yellow)]" />
      </div>
      <div className="fixed top-1/2 right-20 animate-float-reverse opacity-10 pointer-events-none hidden lg:block">
        <SparkleIcon className="w-12 h-12 text-[var(--electric-purple)]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--cream)] neo-border-thick border-t-0 border-l-0 border-r-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="neo-border bg-[var(--lime)] p-2 animate-pulse-scale">
              <LightbulbIcon className="w-6 h-6" />
            </div>
            <span className="font-display text-2xl">IDEAMARKET</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="neo-border bg-[var(--sunny-yellow)] px-3 py-1 hidden sm:flex items-center gap-2">
              <SparkleIcon className="w-4 h-4" />
              <span className="font-display text-sm">247 credits</span>
            </div>
            <Link href="/settings">
              <div className="neo-border bg-white w-10 h-10 flex items-center justify-center text-xl cursor-pointer hover-lift">
                🧑‍💻
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar Ads */}
      <div className="relative">
        <div className="hidden xl:block absolute left-[calc(50%-39rem)] 2xl:left-[calc(50%-47rem)] top-36 z-40">
          <div className="neo-border neo-shadow bg-[var(--cream)] w-56 h-56 2xl:w-72 2xl:h-72 flex items-center justify-center sticky top-24">
            <span className="font-display text-3xl text-[var(--deep-black)]/40">
              AD
            </span>
          </div>
        </div>
        <div className="hidden xl:block absolute right-[calc(50%-39rem)] 2xl:right-[calc(50%-47rem)] top-36 z-40">
          <div className="neo-border neo-shadow bg-[var(--cream)] w-56 h-56 2xl:w-72 2xl:h-72 flex items-center justify-center sticky top-24">
            <span className="font-display text-3xl text-[var(--deep-black)]/40">
              AD
            </span>
          </div>
        </div>

        <main className="max-w-3xl 2xl:max-w-4xl mx-auto px-4 xl:px-6 py-8">
          {/* Header Greeting */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl md:text-5xl xl:text-4xl 2xl:text-5xl">
                Hi, <span className="text-[var(--hot-pink)]">{userName}</span>
              </h1>
            </div>
            <p className="font-body text-lg text-[var(--deep-black)]/70">
              What are we thinking of today?
            </p>
          </div>

          {/* Create Idea Section - Extracted component for performance */}
          <CreateIdeaBox onCreateIdea={handleAddIdea} userName={userName} />

          {/* Banner Ad - Horizontal */}
          <div className="neo-border neo-shadow bg-[var(--cream)] h-24 mb-8 flex items-center justify-center animate-fade-in-up stagger-1">
            <span className="font-display text-2xl text-[var(--deep-black)]/40">
              AD
            </span>
          </div>

          {/* Feed Header */}
          <div className="flex items-center justify-between mb-6 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-3">
              <div className="neo-border bg-[var(--hot-pink)] px-4 py-2">
                <span className="font-display text-white text-lg">
                  🔥 TRENDING
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("popular")}
                className={`neo-border px-3 py-1 font-body text-sm font-medium hover-lift ${
                  sortBy === "popular" ? "bg-[var(--lime)]" : "bg-white"
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setSortBy("newest")}
                className={`neo-border px-3 py-1 font-body text-sm font-medium hover-lift ${
                  sortBy === "newest" ? "bg-[var(--lime)]" : "bg-white"
                }`}
              >
                New
              </button>
            </div>
          </div>

          {/* Ideas Feed */}
          {isLoading ? (
            <div className="neo-border neo-shadow bg-white p-8 text-center">
              <div className="inline-block neo-border bg-[var(--lime)] p-3 animate-pulse mb-4">
                <LightbulbIcon className="w-6 h-6" />
              </div>
              <p className="font-body text-[var(--deep-black)]/60">
                Carregando ideias...
              </p>
            </div>
          ) : ideas.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4 relative">
              {ideas.map((idea, index) => (
                <div key={idea.id}>
                  <IdeaFeedCard idea={idea} onVote={handleVote} index={index} />
                  {(index === 1 || index === 3) && (
                    <div className="xl:hidden neo-border neo-shadow bg-[var(--cream)] aspect-square max-w-xs mx-auto flex items-center justify-center mt-4">
                      <span className="font-display text-3xl text-[var(--deep-black)]/40">
                        AD
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          <div
            className="flex justify-center mt-8 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Button variant="accent" size="lg" className="neo-border-thick">
              <span className="flex items-center gap-2">
                LOAD MORE
                <svg
                  className="w-5 h-5 animate-bounce-subtle"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </span>
            </Button>
          </div>

          {/* Floating Action Button (Mobile) */}
          <button className="fixed bottom-6 right-6 neo-border-thick neo-shadow-lg bg-[var(--hot-pink)] p-4 hover-lift md:hidden z-50">
            <LightbulbIcon className="w-6 h-6 text-white" />
          </button>
        </main>
      </div>
    </div>
  );
}
