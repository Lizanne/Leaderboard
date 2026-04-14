export default function PrizeStatusPill() {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[var(--font-size-small)] font-bold animate-pill-enter"
      style={{
        background: 'rgba(58, 122, 16, 0.08)',
        border: '1px solid rgba(58, 122, 16, 0.2)',
        color: 'var(--color-success-text)',
        animationDelay: '0.2s',
      }}
    >
      🏆 You're in the prize zone
    </div>
  );
}
