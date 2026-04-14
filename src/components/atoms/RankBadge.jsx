export default function RankBadge({ rank, inPrizes = false }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[var(--font-size-body)] font-semibold animate-pill-enter"
      style={{
        background: inPrizes ? 'rgba(58, 122, 16, 0.08)' : 'var(--color-background)',
        border: `1px solid ${inPrizes ? 'rgba(58, 122, 16, 0.2)' : 'var(--color-border)'}`,
        color: inPrizes ? 'var(--color-success-text)' : 'var(--color-text-secondary)',
      }}
    >
      Your position: <strong style={{ color: inPrizes ? 'var(--color-success-text)' : 'var(--color-text-primary)', fontWeight: 800 }}>#{rank}</strong>
    </div>
  );
}
