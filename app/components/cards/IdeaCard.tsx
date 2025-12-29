import { ArrowUpIcon } from "../icons";

export function IdeaCard({
  title,
  votes,
  color,
  rotation,
  delay,
  tags,
}: {
  title: string;
  votes: number;
  color: string;
  rotation: string;
  delay: string;
  tags: string[];
}) {
  return (
    <div
      className={`neo-border neo-shadow bg-white p-4 w-64 ${rotation} animate-float hover-lift cursor-pointer`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`neo-border p-2 ${color} flex flex-col items-center gap-1`}
        >
          <ArrowUpIcon className="w-5 h-5" />
          <span className="font-display text-sm">{votes}</span>
        </div>
        <div className="flex-1">
          <p className="font-body text-sm font-medium leading-tight">{title}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="neo-border text-xs px-2 py-1 bg-[var(--lime)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
