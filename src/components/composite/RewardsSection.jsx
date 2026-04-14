const BADGE_STYLES = {
  locked: { bg: '#f4f4f5', color: 'var(--color-text-secondary)', label: 'Locked' },
  unlocked: { bg: 'rgba(159,232,112,0.15)', color: 'var(--color-success-text)', label: 'Unlocked' },
  'in-prizes': { bg: '#f0fdf4', color: '#052e16', label: 'In prizes' },
};

export default function RewardsSection({ icon, title, status = 'locked' }) {
  const badge = BADGE_STYLES[status] || BADGE_STYLES.locked;

  return (
    <div className="px-4 pt-4 pb-4 animate-state-enter">
      <p className="text-sm font-semibold leading-5 mb-2.5" style={{ color: 'var(--color-text-secondary)' }}>
        Rewards
      </p>
      <div className="flex items-center gap-3">
        {/* Round icon */}
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
          {icon ? (
            <img src={icon} alt="" className="w-full h-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-full text-lg"
              style={{ background: '#f4f4f5' }}
            >
              🎰
            </div>
          )}
        </div>

        {/* Title only */}
        <p className="flex-1 min-w-0 text-[14px] font-semibold leading-5" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </p>

        {/* Badge */}
        <div
          className="shrink-0 rounded-md px-2 py-0.5"
          style={{
            background: badge.bg,
            color: badge.color,
            height: 20,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {badge.label}
        </div>
      </div>
    </div>
  );
}
