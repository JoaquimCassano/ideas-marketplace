"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created, but failed to sign in");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--cream)] bg-grid">
      <div className="noise-overlay" />

      {/* Desktop Side Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-xl">
          <h2 className="text-5xl font-display-alt text-[var(--deep-black)] mb-6 leading-tight animate-fade-in-up">
            START YOUR JOURNEY TODAY
          </h2>

          <p className="text-xl font-body text-[var(--deep-black)]/70 mb-8 animate-fade-in-up stagger-1">
            Join a community of founders, indie hackers, and dreamers who share
            and discover the next big ideas.
          </p>

          <div className="bg-[var(--lime)] neo-border-thick p-6 animate-fade-in-up stagger-2">
            <h3 className="font-display-alt text-xl text-[var(--deep-black)] mb-4">
              What you get:
            </h3>
            <ul className="space-y-3 font-body text-[var(--deep-black)]">
              <li className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span>Share unlimited ideas</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span>Earn credits from upvotes</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span>Advertise your SaaS for free</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span>Connect with the community</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span>Get early adopter benefits</span>
              </li>
            </ul>
          </div>

          <p className="font-body text-sm text-[var(--deep-black)]/60 mt-6 animate-fade-in-up stagger-3">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--hot-pink)] font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="bg-white neo-border-thick neo-shadow-lg p-6 lg:p-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[var(--hot-pink)] neo-border flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <span className="text-xl font-display-alt text-[var(--deep-black)]">
                IDEAMARKET
              </span>
            </div>

            <div className="text-center mb-6 lg:mb-8">
              <h1 className="text-3xl lg:text-4xl font-display-alt text-[var(--deep-black)] mb-2">
                Join IdeaMarket
              </h1>
              <p className="text-[var(--deep-black)]/70 font-body text-sm lg:text-base">
                Create your account and start sharing ideas
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
              {error && (
                <div className="bg-red-50 neo-border p-4">
                  <p className="text-red-600 font-body text-sm font-medium">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
                >
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="primary"
                  size="lg"
                  placeholder="Your name"
                  disabled={isLoading}
                />
              </div>

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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-body font-medium text-[var(--deep-black)] mb-2"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center lg:hidden">
              <p className="text-[var(--deep-black)]/70 font-body text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[var(--hot-pink)] font-bold hover:underline"
                >
                  Sign in
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
