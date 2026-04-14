export default function PrizeSection({ amount, type = 'Cash prize', rank, score, etaText = 'Expected in your account within 72 hours' }) {
  return (
    <div className="px-[var(--spacing-card-x)] pt-[var(--spacing-card-y)] pb-5">
      <p className="text-[var(--font-size-xs)] font-semibold" style={{ color: 'var(--color-prize-label)' }}>
        You won
      </p>

      <p
        className="text-[var(--font-size-prize-amount)] font-black leading-none mt-2 animate-gold-shift animate-score-enter"
        style={{ letterSpacing: '-2px' }}
      >
        {amount}
      </p>

      <p className="text-[15px] font-semibold mt-1" style={{ color: 'var(--color-prize-label)' }}>
        {type}
      </p>

      {/* Pending pill */}
      <div
        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[var(--font-size-xs)] font-bold mt-3.5 animate-pill-enter"
        style={{
          background: 'rgba(159, 232, 112, 0.15)',
          border: '1px solid rgba(159, 232, 112, 0.4)',
          color: 'var(--color-success-text)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
        Pending
      </div>

      <p className="text-[var(--font-size-xxs)] mt-2" style={{ color: 'var(--color-text-muted)' }}>
        {etaText}
      </p>

      {/* Final position compact row */}
      {rank && (
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-3">
          <span className="text-[var(--font-size-xs)] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Final result
          </span>
          <span className="text-[var(--font-size-small)] font-bold" style={{ color: 'var(--color-text-primary)' }}>
            #{rank}
          </span>
          <span className="h-[3px] w-[3px] rounded-full" style={{ background: 'var(--color-text-muted)' }} />
          <span className="text-[var(--font-size-small)] font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {score} pts
          </span>
        </div>
      )}
    </div>
  );
}
