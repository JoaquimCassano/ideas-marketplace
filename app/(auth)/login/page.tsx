"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex bg-[var(--cream)] bg-grid items-center justify-center">
        <div className="noise-overlay" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--cream)] bg-grid">
      <div className="noise-overlay" />

      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-xl">
          <h2 className="text-5xl font-display-alt text-[var(--deep-black)] mb-6 leading-tight animate-fade-in-up">
            WELCOME TO THE IDEA MARKETPLACE
          </h2>

          <p className="text-xl font-body text-[var(--deep-black)]/70 mb-8 animate-fade-in-up stagger-1">
            Turn your app ideas into upvotes. Convert upvotes into ad credits.
            Promote your SaaS to the right audience.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="bg-white neo-border-thick neo-shadow-lg p-6 lg:p-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[var(--hot-pink)] neo-border flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <span className="text-xl font-display-alt text-[var(--deep-black)]">
                IDEAMARKET
              </span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-display-alt text-[var(--deep-black)] mb-2">
                Welcome Back
              </h1>
              <p className="text-[var(--deep-black)]/70 font-body text-sm lg:text-base">
                Sign in to your IdeaMarket account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 neo-border p-4">
                  <p className="text-red-600 font-body text-sm font-medium">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="primary"
                  size="lg"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="primary"
                  size="lg"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[var(--deep-black)]/70 font-body text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[var(--hot-pink)] font-bold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-[var(--deep-black)]/70 font-body text-sm hover:text-[var(--hot-pink)] transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
