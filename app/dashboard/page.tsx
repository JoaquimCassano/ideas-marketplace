"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  title: string;
  description: string;
  votes: number;
  userVote: "up" | "down" | null;
  author: string;
  authorAvatar: string;
  tags: string[];
  timeAgo: string;
  comments: number;
}

const MOCK_IDEAS: Idea[] = [
  {
    id: "1",
    title: "AI that transforms sketches into functional UI",
    description:
      "Draw a wireframe on paper, take a picture, and the AI generates React components with Tailwind. Perfect for rapid prototyping.",
    votes: 342,
    userVote: null,
    author: "Lucas Dev",
    authorAvatar: "🧑‍💻",
    tags: ["AI", "UI/UX", "React"],
    timeAgo: "2h ago",
    comments: 47,
  },
  {
    id: "2",
    title: "Extension that blocks sites during pomodoro",
    description:
      "Integrates with Notion and Slack. During the timer, blocks social media and notifies your team that you're focused.",
    votes: 289,
    userVote: "up",
    author: "Marina Tech",
    authorAvatar: "👩‍🔬",
    tags: ["Productivity", "Extension", "Integration"],
    timeAgo: "5h ago",
    comments: 32,
  },
  {
    id: "3",
    title: "Discord bot for pair programming",
    description:
      "Automatically connects devs with complementary skills. Uses AI for matchmaking based on stack and timezone.",
    votes: 256,
    userVote: null,
    author: "Pedro Indie",
    authorAvatar: "🚀",
    tags: ["Bot", "Community", "AI"],
    timeAgo: "8h ago",
    comments: 28,
  },
  {
    id: "4",
    title: "Dashboard de métricas pra indie hackers",
    description:
      "Unifies MRR, churn, LTV from multiple SaaS. Anonymous benchmarks to compare with others in the same niche.",
    votes: 198,
    userVote: "down",
    author: "Ana Builder",
    authorAvatar: "🛠️",
    tags: ["Analytics", "SaaS", "Dashboard"],
    timeAgo: "12h ago",
    comments: 19,
  },
  {
    id: "5",
    title: "CLI that generates landing pages with one sentence",
    description:
      "npx create-landing 'vegan recipes app'. Generates copy, selects photos, and deploys to Vercel automatically.",
    votes: 175,
    userVote: null,
    author: "Thiago Code",
    authorAvatar: "⌨️",
    tags: ["CLI", "Automation", "Marketing"],
    timeAgo: "1d ago",
    comments: 23,
  },
  {
    id: "6",
    title: "Marketplace for abandoned side projects",
    description:
      "Buy and sell half-finished projects. Includes codebase, domain, and the 3 users still using it.",
    votes: 421,
    userVote: "up",
    author: "Carla Startup",
    authorAvatar: "💡",
    tags: ["Marketplace", "Acquisitions", "Indie"],
    timeAgo: "2d ago",
    comments: 89,
  },
];

const IdeaFeedCard = memo(function IdeaFeedCard({
  idea,
  onVote,
  index,
}: {
  idea: Idea;
  onVote: (id: string, vote: "up" | "down") => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getVoteButtonClass = (type: "up" | "down") => {
    const isActive = idea.userVote === type;
    if (type === "up") {
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

  return (
    <div
      className="neo-border neo-shadow bg-white p-5 hover-lift cursor-pointer group opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: "forwards",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <button
            onClick={() => onVote(idea.id, "up")}
            className={`neo-border p-2 transition-all duration-200 ${getVoteButtonClass("up")}`}
          >
            <ArrowUpIcon className="w-5 h-5" />
          </button>
          <span
            className={`font-display text-xl transition-all duration-300 ${
              idea.userVote === "up"
                ? "text-[var(--lime)] scale-110"
                : idea.userVote === "down"
                  ? "text-[var(--hot-pink)]"
                  : ""
            }`}
          >
            {idea.votes}
          </span>
          <button
            onClick={() => onVote(idea.id, "down")}
            className={`neo-border p-2 transition-all duration-200 ${getVoteButtonClass("down")}`}
          >
            <ArrowDownIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{idea.authorAvatar}</span>
            <span className="font-body text-sm font-medium">{idea.author}</span>
            <span className="text-[var(--deep-black)]/40">•</span>
            <span className="font-body text-sm text-[var(--deep-black)]/60">
              {idea.timeAgo}
            </span>
          </div>

          <h3 className="font-display text-lg md:text-xl mb-2 group-hover:text-[var(--hot-pink)] transition-colors">
            {idea.title}
          </h3>

          <p className="font-body text-[var(--deep-black)]/80 mb-4 line-clamp-2">
            {idea.description}
          </p>

          {/* Tags */}
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

          {/* Footer */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 font-body text-sm text-[var(--deep-black)]/60 hover:text-[var(--hot-pink)] transition-colors">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {idea.comments} comentários
            </button>
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
              compartilhar
            </button>
          </div>
        </div>

        {/* Decorative element on hover */}
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
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const MAX_LENGTH = 500;
  const showExtras = title.trim() || tags.length > 0;

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreateIdea({
      id: Date.now().toString(),
      title: title.trim(),
      description: body.trim() || "Nova ideia da comunidade.",
      votes: 1,
      userVote: "up",
      author: userName,
      authorAvatar: "✨",
      tags: tags.length > 0 ? tags : ["Novo"],
      timeAgo: "agora",
      comments: 0,
    });

    setTitle("");
    setBody("");
    setTags([]);
    setTagInput("");
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
      <div className="flex items-start gap-4">
        <div className="neo-border bg-[var(--lime)] p-3 hidden sm:block">
          <LightbulbIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: App that turns memes into NFTs..."
            variant="accent"
            size="lg"
            className="w-full mb-4"
          />

          {showExtras && (
            <>
              <div className="flex justify-end mb-2">
                <span className="text-sm font-body text-[var(--deep-black)]/50">
                  {body.length}/{MAX_LENGTH}
                </span>
              </div>
              <textarea
                value={body}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_LENGTH) {
                    setBody(e.target.value);
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
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              className="neo-border-thick whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                <SparkleIcon className="w-5 h-5" />
                CRIAR IDEIA
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleAddIdea = useCallback((idea: Idea) => {
    setIdeas((prev) => [idea, ...prev]);
  }, []);

  const handleVote = useCallback((id: string, vote: "up" | "down") => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;

        let newVotes = idea.votes;
        let newUserVote: "up" | "down" | null = vote;

        if (idea.userVote === vote) {
          newUserVote = null;
          newVotes = vote === "up" ? idea.votes - 1 : idea.votes + 1;
        } else if (idea.userVote === null) {
          newVotes = vote === "up" ? idea.votes + 1 : idea.votes - 1;
        } else {
          newVotes = vote === "up" ? idea.votes + 2 : idea.votes - 2;
        }

        return { ...idea, votes: newVotes, userVote: newUserVote };
      })
    );
  }, []);

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
            <div className="neo-border bg-white w-10 h-10 flex items-center justify-center text-xl">
              🧑‍💻
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar Ads */}
      <div className="relative">
        {/* Sidebar Ads - Desktop only, positioned next to container, aligned with input box */}
        <div className="hidden xl:block absolute left-[calc(50%-32rem-220px)] top-36 z-40">
          <div className="neo-border neo-shadow bg-[var(--cream)] w-72 h-72 flex items-center justify-center sticky top-24">
            <span className="font-display text-3xl text-[var(--deep-black)]/40">
              AD
            </span>
          </div>
        </div>
        <div className="hidden xl:block absolute right-[calc(50%-32rem-220px)] top-36 z-40">
          <div className="neo-border neo-shadow bg-[var(--cream)] w-72 h-72 flex items-center justify-center sticky top-24">
            <span className="font-display text-3xl text-[var(--deep-black)]/40">
              AD
            </span>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Header Greeting */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl md:text-5xl">
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
              <button className="neo-border bg-[var(--lime)] px-3 py-1 font-body text-sm font-medium hover-lift">
                Hot
              </button>
              <button className="neo-border bg-white px-3 py-1 font-body text-sm font-medium hover-lift">
                New
              </button>
              <button className="neo-border bg-white px-3 py-1 font-body text-sm font-medium hover-lift">
                Top
              </button>
            </div>
          </div>

          {/* Ideas Feed */}
          <div className="space-y-4 relative">
            {ideas.map((idea, index) => (
              <div key={idea.id}>
                <IdeaFeedCard idea={idea} onVote={handleVote} index={index} />
                {/* Mobile Square Ads - after 2nd and 4th idea */}
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
