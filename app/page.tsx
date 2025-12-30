"use client";

import { useState } from "react";
import {
  LightbulbIcon,
  ArrowUpIcon,
  CoinIcon,
  UsersIcon,
  RocketIcon,
  StarIcon,
  SparkleIcon,
  IdeaCard,
  FeatureCard,
  StepCard,
  Button,
  Input,
} from "./components";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] bg-grid relative noise-overlay">
      <div className="fixed top-20 left-10 animate-spin-slow opacity-20 pointer-events-none">
        <StarIcon className="w-16 h-16 text-[var(--hot-pink)]" />
      </div>
      <div className="fixed bottom-40 right-10 animate-float opacity-20 pointer-events-none">
        <SparkleIcon className="w-12 h-12 text-[var(--electric-purple)]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)] neo-border-thick border-t-0 border-l-0 border-r-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="neo-border bg-[var(--lime)] p-2">
              <LightbulbIcon className="w-6 h-6" />
            </div>
            <span className="font-display text-2xl">IDEAMARKET</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#how-it-works"
              className="font-body font-bold text-lg hover:text-[var(--hot-pink)] transition-colors"
            >
              How it works
            </a>
            <a
              href="#features"
              className="font-body font-bold text-lg hover:text-[var(--hot-pink)] transition-colors"
            >
              Features
            </a>
            <Button variant="primary" size="sm">
              JOIN WAITLIST
            </Button>
          </div>
        </div>
      </nav>

      <section className="snap-section pt-32 pb-20 px-6 relative overflow-hidden min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center relative z-10 mb-20">
            <div className="inline-flex items-center gap-2 neo-border neo-shadow-sm bg-[var(--sunny-yellow)] px-4 py-2 mb-8 animate-wiggle">
              <SparkleIcon className="w-4 h-4" />
              <span className="font-display text-sm">THE IDEA MARKETPLACE</span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.85] mb-8">
              TURN
              <span className="font-handwriting italic"> IDEAS</span>
              <br />
              INTO USERS
            </h1>

            <p className="font-body text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Post your app ideas. Get upvotes. Convert them into {<br />}
              <span className="bg-[var(--lime)] neo-border px-2 font-bold">
                ad credits
              </span>{" "}
              to promote your projects.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                variant="accent"
                size="lg"
                className="flex-1"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="neo-border-thick neo-shadow-lg whitespace-nowrap"
              >
                {isSubmitted ? "🎉 JOINED!" : "JOIN NOW"}
              </Button>
            </form>

            <p className="font-body text-sm mt-4 opacity-60">
              Be among the first 500 to get exclusive benefits
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto justify-items-center md:justify-items-start">
            <div className="transform hover:scale-105 transition-transform">
              <IdeaCard
                title="AI-powered meal planner that syncs with grocery stores"
                votes={247}
                color="bg-[var(--lime)]"
                rotation=""
                delay="0s"
                tags={["AI", "Health", "Integration"]}
              />
            </div>
            <div className="transform hover:scale-105 transition-transform md:mt-8">
              <IdeaCard
                title="Browser extension that summarizes any YouTube video"
                votes={189}
                color="bg-[var(--green-mint)]"
                rotation=""
                delay="0.2s"
                tags={["AI", "Extension", "Integration"]}
              />
            </div>
            <div className="transform hover:scale-105 transition-transform md:mt-16">
              <IdeaCard
                title="Slack bot that auto-generates meeting notes"
                votes={156}
                color="bg-[var(--lime-light)]"
                rotation=""
                delay="0.4s"
                tags={["Bot", "Productivity", "AI"]}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="snap-section py-24 px-6 bg-white neo-border-thick border-l-0 border-r-0"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block neo-border neo-shadow bg-[var(--lime)] px-6 py-2 mb-6">
              <span className="font-display text-lg">HOW IT WORKS</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl">
              EASIER THAN
              <br />
              <span className="text-[var(--hot-pink)]">MAKING COFFE</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
            <StepCard
              number="1"
              title="POST YOUR IDEAS"
              description="Share app ideas you won't build. Help others find inspiration."
              color="bg-[var(--sunny-yellow)]"
              image="/racoon-images/thinking.jpg"
            />
            <StepCard
              number="2"
              title="COLLECT UPVOTES"
              description="Community votes on the best ideas."
              color="bg-[var(--lime)]"
              image="/racoon-images/writing.jpg"
            />
            <StepCard
              number="3"
              title="CONVERT TO ADS"
              description="Use your upvotes as credits to advertise your own SaaS."
              color="bg-[var(--sky-blue)]"
              image="/racoon-images/celebrating.jpg"
            />
          </div>
        </div>
      </section>

      <section id="features" className="snap-section py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block neo-border neo-shadow bg-[var(--hot-pink)] px-6 py-2 mb-6">
              <span className="font-display text-lg text-white">
                cool. but why?
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl">
              &apos;CAUSE IT&apos;S MADE
              <br />
              <span className="text-[var(--electric-purple)]">
                BY DEVS, FOR DEVS
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<LightbulbIcon className="w-10 h-10" />}
              title="IDEA VAULT"
              description="Your ideas have value. Don't let them die in your notes app."
              color="bg-[var(--sunny-yellow)]"
              index={0}
            />
            <FeatureCard
              icon={<ArrowUpIcon className="w-10 h-10" />}
              title="SOCIAL PROOF"
              description="See which ideas resonate before spending months building."
              color="bg-[var(--lime)]"
              index={1}
            />
            <FeatureCard
              icon={<CoinIcon className="w-10 h-10" />}
              title="EARN CREDITS"
              description="Every upvote = 1 credit. Stack them up, spend them wisely."
              color="bg-[var(--sky-blue)]"
              index={2}
            />
            <FeatureCard
              icon={<RocketIcon className="w-10 h-10" />}
              title="PROMOTE SAAS"
              description="Target users who love innovative ideas. Perfect audience fit."
              color="bg-[var(--sunny-yellow)]"
              index={3}
            />
            <FeatureCard
              icon={<UsersIcon className="w-10 h-10" />}
              title="COMMUNITY"
              description="Connect with founders, indie hackers, and dreamers like you."
              color="bg-[var(--sky-blue)]"
              index={4}
            />
            <FeatureCard
              icon={<StarIcon className="w-10 h-10" />}
              title="LEADERBOARD"
              description="Compete for the top spots. Fame awaits the most creative."
              color="bg-[var(--hot-pink)] text-white"
              index={5}
            />
          </div>
        </div>
      </section>

      <section className="snap-section py-24 px-6 bg-[var(--deep-black)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-float">
            <StarIcon className="w-20 h-20 text-[var(--sunny-yellow)]" />
          </div>
          <div className="absolute bottom-10 right-20 animate-float-reverse">
            <SparkleIcon className="w-16 h-16 text-[var(--hot-pink)]" />
          </div>
          <div className="absolute top-1/2 left-1/4 animate-wiggle">
            <LightbulbIcon className="w-24 h-24 text-[var(--electric-purple)]" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block neo-border neo-shadow bg-[var(--hot-pink)] px-6 py-2 mb-8 animate-pulse-scale">
            <span className="font-display text-lg text-white">
              LAUNCHING SOON
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl text-white mb-6">
            READY TO
            <br />
            <span className="text-[var(--lime)]">TURN IDEAS</span>
            <br />
            <span className="text-[var(--hot-pink)]">INTO USERS?</span>
          </h2>

          <p className="font-body text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join the waitlist and be part of the movement that transforms how
            founders share, discover, and grow.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              variant="primary"
              size="lg"
              className="neo-border-thick flex-1"
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="neo-border-thick neo-shadow-lg px-10 text-xl"
            >
              {isSubmitted ? "🎉 DONE!" : "COUNT ME IN"}
            </Button>
          </form>

          <div className="mt-12 flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="neo-border bg-[var(--lime)] p-2">
                <span className="font-display text-lg">500+</span>
              </div>
              <span className="font-body text-white/60">Early adopters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="neo-border bg-[var(--sunny-yellow)] p-2">
                <span className="font-display text-lg">∞</span>
              </div>
              <span className="font-body text-white/60">Ideas to share</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="neo-border bg-[var(--sky-blue)] p-2">
                <span className="font-display text-lg">0$</span>
              </div>
              <span className="font-body text-white/60">To get started</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 neo-border-thick border-b-0 border-l-0 border-r-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="neo-border bg-[var(--lime)] p-2">
                <LightbulbIcon className="w-6 h-6" />
              </div>
              <span className="font-display text-xl">IDEAMARKET</span>
            </div>

            <div className="flex gap-4">
              <a
                href="#"
                className="neo-border neo-shadow-sm bg-white p-3 hover-lift"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="neo-border neo-shadow-sm bg-white p-3 hover-lift"
                aria-label="Discord"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                </svg>
              </a>
              <a
                href="#"
                className="neo-border neo-shadow-sm bg-white p-3 hover-lift"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
            </div>

            <p className="font-body text-sm opacity-60">
              © 2025 IdeaMarket. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
