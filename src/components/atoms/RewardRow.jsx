function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

const TAG_STYLES = {
  locked: { bg: 'var(--color-tag-locked-bg)', color: 'var(--color-tag-locked-text)' },
  unlocked: { bg: 'var(--color-tag-unlocked-bg)', color: 'var(--color-tag-unlocked-text)', icon: <CheckIcon />, border: '1px solid rgba(159,232,112,0.4)' },
  'not-won': { bg: 'var(--color-tag-notwon-bg)', color: 'var(--color-tag-notwon-text)' },
};

export default function RewardRow({ icon = '🎰', title, status = 'locked', compact = false }) {
  const tag = TAG_STYLES[status] || TAG_STYLES.locked;
  const label = status === 'unlocked' ? 'Unlocked' : status === 'not-won' ? 'Not won' : 'Locked';

  if (compact) {
    return (
      <div className="flex items-center gap-2.5 px-[var(--spacing-card-x)] py-3.5 animate-state-enter">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base"
          style={{ background: status === 'unlocked' ? 'rgba(159,232,112,0.12)' : 'var(--color-background)' }}
        >
          {icon}
        </div>
        <p className="flex-1 text-[var(--font-size-small)] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </p>
        <span
          className="shrink-0 flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-1 text-[var(--font-size-xxs)] font-bold whitespace-nowrap"
          style={{ background: tag.bg, color: tag.color, border: tag.border || 'none' }}
        >
          {tag.icon} {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 animate-state-enter">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-lg border"
        style={{
          background: status === 'unlocked' ? 'rgba(159,232,112,0.12)' : 'var(--color-background)',
          borderColor: status === 'unlocked' ? 'rgba(159,232,112,0.35)' : 'var(--color-border)',
        }}
      >
        {icon}
      </div>
      <p className="flex-1 text-[var(--font-size-small)] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </p>
      <span
        className="shrink-0 flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1.5 text-[var(--font-size-xxs)] font-bold whitespace-nowrap"
        style={{ background: tag.bg, color: tag.color, border: tag.border || 'none' }}
      >
        {tag.icon} {label}
      </span>
    </div>
  );
}
