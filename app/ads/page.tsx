"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LightbulbIcon,
  SparkleIcon,
  StarIcon,
  ArrowLeftIcon,
} from "../components";

interface AdPricing {
  type: "banner" | "square";
  name: string;
  viewsPerCredit: number;
  icon: string;
  description: string;
  dimensions: string;
}

const PRICING: AdPricing[] = [
  {
    type: "square",
    name: "Square Ad",
    viewsPerCredit: 10,
    icon: "",
    description: "Sidebar placement, visible on larger screens",
    dimensions: "256x256px",
  },
  {
    type: "banner",
    name: "Banner Ad",
    viewsPerCredit: 5,
    icon: "",
    description: "Horizontal placement in main feed",
    dimensions: "Full width banner",
  },
];

export default function AdsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<"square" | "banner">(
    "square",
  );
  const [creditsToSpend, setCreditsToSpend] = useState<number>(10);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch("/api/credits");
      if (!response.ok) throw new Error("Failed to fetch credits");
      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCredits();
    }
  }, [status, fetchCredits]);

  const selectedPricing = PRICING.find((p) => p.type === selectedType);
  const estimatedViews =
    creditsToSpend * (selectedPricing?.viewsPerCredit || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!imageUrl.trim() || !linkUrl.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (creditsToSpend > credits) {
      setError("Insufficient credits");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrl.trim(),
          linkUrl: linkUrl.trim(),
          type: selectedType,
          creditsSpent: creditsToSpend,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create ad");
      }

      setSuccess(true);
      setCredits((prev) => prev - creditsToSpend);
      setImageUrl("");
      setLinkUrl("");
      setCreditsToSpend(10);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create ad");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="neo-border neo-shadow bg-white p-8">
          <div className="flex items-center gap-3">
            <div className="neo-border bg-[var(--lime)] p-3 animate-pulse">
              <SparkleIcon className="w-6 h-6" />
            </div>
            <span className="font-display text-xl">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] bg-grid relative noise-overlay">
      <div className="fixed top-20 right-10 animate-spin-slow opacity-20 pointer-events-none hidden md:block">
        <StarIcon className="w-20 h-20 text-[var(--hot-pink)]" />
      </div>
      <div className="fixed bottom-20 left-10 animate-float opacity-15 pointer-events-none hidden md:block">
        <SparkleIcon className="w-16 h-16 text-[var(--sunny-yellow)]" />
      </div>

      <nav className="sticky top-0 z-50 bg-[var(--cream)] neo-border-thick border-t-0 border-l-0 border-r-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover-lift"
          >
            <div className="neo-border bg-white p-1">
              <Image
                src="/logo-png.png"
                alt="Logo"
                width={8}
                height={8}
                className="w-8 h-8"
              />
            </div>
            <span className="font-display text-2xl">IDEAMARKET</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="neo-border bg-[var(--sunny-yellow)] px-3 py-1 hidden sm:flex items-center gap-2">
              <SparkleIcon className="w-4 h-4" />
              <span className="font-display text-sm">{credits} credits</span>
            </div>
            <Link href="/settings">
              <div className="neo-border bg-white w-10 h-10 flex items-center justify-center text-xl cursor-pointer hover-lift">
                {session?.user?.image ? (
                  <Image
                    src={session?.user.image}
                    alt="User"
                    width={40}
                    height={40}
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

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6 animate-fade-in-up">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-body text-sm text-[var(--deep-black)]/60 hover:text-[var(--hot-pink)] transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="font-display text-4xl md:text-5xl mb-2">
            <span className="text-[var(--hot-pink)]">Promote</span> Your SaaS
          </h1>
          <p className="font-body text-lg text-[var(--deep-black)]/70">
            Get your message in front of thousands of creators
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in-up stagger-1">
          {PRICING.map((pricing) => (
            <button
              key={pricing.type}
              onClick={() => setSelectedType(pricing.type)}
              className={`neo-border neo-shadow p-6 text-left transition-all hover-lift ${
                selectedType === pricing.type
                  ? "bg-[var(--lime)] ring-4 ring-[var(--lime)]/30"
                  : "bg-white"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <div
                    className={`neo-border p-3 ${selectedType === pricing.type ? "bg-white" : "bg-white"}`}
                  >
                    {selectedType === pricing.type ? (
                      <svg
                        className="w-6 h-6 text-[var(--hot-pink)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <div className="w-6 h-6" />
                    )}
                  </div>
                  {selectedType === pricing.type && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--hot-pink)] rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl mb-1">{pricing.name}</h3>
                  <p className="font-body text-sm text-[var(--deep-black)]/60">
                    {pricing.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="font-body">
                  <span className="text-[var(--deep-black)]/60">
                    Dimensions:
                  </span>{" "}
                  <span className="font-medium">{pricing.dimensions}</span>
                </div>
                <div className="font-body">
                  <span className="text-[var(--deep-black)]/60">Rate:</span>{" "}
                  <span className="font-medium text-[var(--hot-pink)]">
                    {pricing.viewsPerCredit} views/credit
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate-fade-in-up stagger-2"
        >
          <div className="neo-border neo-shadow bg-white p-6">
            <h3 className="font-display text-xl mb-4">Ad Details</h3>

            <div className="space-y-4">
              <div>
                <label className="font-body text-sm font-medium text-[var(--deep-black)]/80 block mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="We are too broke to buy DB storage lol. thats on you"
                  className="w-full neo-border-thick bg-white px-4 py-3 font-body focus:outline-none focus:ring-4 ring-[var(--lime)]/30"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium text-[var(--deep-black)]/80 block mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://the-url-your-ad-will-point-to.com"
                  className="w-full neo-border-thick bg-white px-4 py-3 font-body focus:outline-none focus:ring-4 ring-[var(--lime)]/30"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="font-body text-sm font-medium text-[var(--deep-black)]/80 block mb-2">
                  Credits to Spend
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max={credits}
                    value={creditsToSpend}
                    onChange={(e) =>
                      setCreditsToSpend(
                        Math.max(1, parseInt(e.target.value) || 1),
                      )
                    }
                    className="w-32 neo-border-thick bg-white px-4 py-3 font-body focus:outline-none focus:ring-4 ring-[var(--lime)]/30"
                    disabled={isSubmitting}
                  />
                  <div className="flex gap-2">
                    {[10, 50, 100, 200].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() =>
                          setCreditsToSpend(Math.min(amount, credits))
                        }
                        className={`neo-border px-3 py-1 font-body text-sm hover-lift ${
                          creditsToSpend === amount
                            ? "bg-[var(--lime)]"
                            : "bg-white"
                        }`}
                        disabled={isSubmitting}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="neo-border bg-[var(--sunny-yellow)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-[var(--deep-black)]/60">
                  Estimated Views
                </p>
                <p className="font-display text-3xl text-[var(--deep-black)]">
                  {estimatedViews.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-body text-sm text-[var(--deep-black)]/60">
                  Cost
                </p>
                <p className="font-display text-3xl text-[var(--deep-black)]">
                  {creditsToSpend} <span className="text-lg">credits</span>
                </p>
              </div>
            </div>
            {creditsToSpend > credits && (
              <p className="font-body text-sm text-red-600 mt-3">
                You don&apos;t have enough credits
              </p>
            )}
          </div>

          {error && (
            <div className="neo-border bg-red-100 border-red-400 text-red-700 px-4 py-3 font-body">
              {error}
            </div>
          )}

          {success && (
            <div className="neo-border bg-[var(--lime)] border-[var(--lime)] text-[var(--deep-black)] px-4 py-3 font-body">
              Ad created successfully! Your campaign is now live.
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !imageUrl.trim() ||
              !linkUrl.trim() ||
              creditsToSpend > credits
            }
            className="w-full neo-border-thick neo-shadow-lg bg-[var(--hot-pink)] text-white font-display text-xl px-8 py-4 hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? "Creating Ad..." : "Launch Campaign"}
          </button>
        </form>

        <div className="mt-8 neo-border bg-white p-6 animate-fade-in-up">
          <h3 className="font-display text-lg mb-3 flex items-center gap-2">
            <LightbulbIcon className="w-5 h-5 text-[var(--sunny-yellow)]" />
            How it works
          </h3>
          <ul className="space-y-2 font-body text-sm text-[var(--deep-black)]/70">
            <li className="flex items-start gap-2">
              <span className="text-[var(--hot-pink)]">•</span>
              <span>Earn credits by getting upvotes on your ideas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--hot-pink)]">•</span>
              <span>
                Square ads appear in sidebars on larger screens (10 views per
                credit)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--hot-pink)]">•</span>
              <span>
                Banner ads appear in the main feed (5 views per credit)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--hot-pink)]">•</span>
              <span>Your ad runs until all views are used</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
