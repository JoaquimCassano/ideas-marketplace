"use client";

import { LightbulbIcon } from "@/app/components";

function EmptyState() {
  return (
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
}

export default EmptyState;
