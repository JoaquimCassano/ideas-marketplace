export function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="#0D0D0D"
        fontSize="12"
        fontWeight="bold"
      >
        $
      </text>
    </svg>
  );
}
