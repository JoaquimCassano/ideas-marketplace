export function FeatureCard({
  icon,
  title,
  description,
  color,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  index: number;
}) {
  return (
    <div
      className={`neo-border-thick neo-shadow-lg ${color} p-8 hover-lift animate-fade-in-up opacity-0`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="neo-border bg-white p-4 w-fit mb-6">{icon}</div>
      <h3 className="font-display text-2xl mb-3">{title}</h3>
      <p className="font-body text-lg opacity-90">{description}</p>
    </div>
  );
}
