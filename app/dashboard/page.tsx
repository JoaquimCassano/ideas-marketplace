"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LightbulbIcon, SparkleIcon, StarIcon, Button } from "../components";
import { Idea, ApiIdea } from "./types";
import IdeaFeedCard from "./components/IdeaFeedCard";
import CreateIdeaBox from "./components/CreateIdeaBox";
import EmptyState from "./components/EmptyState";

interface Ad {
  _id: string;
  imageUrl?: string;
  linkUrl?: string;
  type: "banner" | "square";
}

export default function AppHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [credits, setCredits] = useState<number>(0);
  const [ads, setAds] = useState<Ad[]>([]);

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

  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch("/api/credits");
      if (!response.ok) {
        throw new Error("Failed to fetch credits");
      }
      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCredits();
    }
  }, [status, fetchCredits]);

  const fetchAds = useCallback(async () => {
    try {
      const response = await fetch("/api/ads");
      if (!response.ok) return;
      const data = await response.json();
      setAds(data.ads || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAds();
    }
  }, [status, fetchAds]);

  const handleAddIdea = (newIdea: Idea) => {
    setIdeas((prev) => [newIdea, ...prev]);
  };

  const bannerAd = ads.find((ad) => ad.type === "banner");
  const squareAds = ads.filter((ad) => ad.type === "square");

  const renderAd = (ad: Ad | null, className: string) => {
    if (!ad?.imageUrl || !ad?.linkUrl) {
      return (
        <div className={className}>
          <span className="font-display text-3xl text-[var(--deep-black)]/40">
            AD
          </span>
        </div>
      );
    }
    return (
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className={className}>
        <img src={ad.imageUrl} alt="Advertisement" className="w-full h-full object-cover" />
      </a>
    );
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
            <div className="neo-border bg-white p-1 animate-pulse-scale">
              <Image
                src="/logo-png.png"
                alt="Lightbulb Icon"
                width={8}
                height={8}
                className="w-8 h-8"
              />
            </div>
            <span className="font-display text-2xl">IDEAMARKET</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/ads" className="neo-border bg-[var(--sunny-yellow)] px-3 py-1 hidden sm:flex items-center gap-2 hover-lift cursor-pointer">
              <SparkleIcon className="w-4 h-4" />
              <span className="font-display text-sm">{credits} credits</span>
            </Link>
            <Link href="/settings">
              <div className="neo-border bg-white w-10 h-10 flex items-center justify-center text-xl cursor-pointer hover-lift">
                {session?.user?.image ? (
                  <Image
                    src={session?.user?.image}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className=""
                  />
                ) : (
                  <span className="font-bold text-lg text-[var(--deep-black)]">
                    {session?.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar Ads */}
      <div className="relative">
        <div className="hidden xl:block absolute left-[calc(50%-39rem)] 2xl:left-[calc(50%-47rem)] top-36 z-40">
          {renderAd(
            squareAds[0] || null,
            "neo-border neo-shadow bg-[var(--cream)] w-56 h-56 2xl:w-72 2xl:h-72 flex items-center justify-center sticky top-24 overflow-hidden"
          )}
        </div>
        <div className="hidden xl:block absolute right-[calc(50%-39rem)] 2xl:right-[calc(50%-47rem)] top-36 z-40">
          {renderAd(
            squareAds[1] || squareAds[0] || null,
            "neo-border neo-shadow bg-[var(--cream)] w-56 h-56 2xl:w-72 2xl:h-72 flex items-center justify-center sticky top-24 overflow-hidden"
          )}
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
          {renderAd(
            bannerAd || null,
            "neo-border neo-shadow bg-[var(--cream)] h-24 mb-8 flex items-center justify-center animate-fade-in-up stagger-1 overflow-hidden"
          )}

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
