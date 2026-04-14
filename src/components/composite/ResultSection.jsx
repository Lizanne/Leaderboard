export default function ResultSection({ rank, score, contextLine }) {
  return (
    <div className="px-[var(--spacing-card-x)] pt-[var(--spacing-card-y)] pb-5">
      <p className="text-[var(--font-size-xs)] font-semibold mb-2.5" style={{ color: 'var(--color-text-secondary)' }}>
        Final result
      </p>

      <p
        className="text-[var(--font-size-result-rank)] font-black leading-none animate-score-enter"
        style={{ color: 'var(--color-text-primary)', letterSpacing: '-1px' }}
      >
        #{rank}
      </p>

      <p className="text-[16px] font-semibold mt-1" style={{ color: 'var(--color-text-secondary)' }}>
        <strong style={{ color: 'var(--color-text-primary)' }}>{score}</strong> pts
      </p>

      {contextLine && (
        <p className="text-[var(--font-size-xs)] mt-2.5 leading-snug" style={{ color: 'var(--color-text-muted)' }}>
          {contextLine}
        </p>
      )}
    </div>
  );
}
