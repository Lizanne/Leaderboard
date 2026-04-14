import RankBadge from '../atoms/RankBadge';
import PrizeStatusPill from '../atoms/PrizeStatusPill';
import CTAButton from '../atoms/CTAButton';

export default function PositionSection({
  rank,
  score,
  inPrizes = false,
  contextLine,
  updatedText = 'Last updated 13 hrs ago',
  onPlay,
  onViewLeaderboard,
}) {
  return (
    <div className="text-center px-[var(--spacing-card-x)] py-[var(--spacing-card-y)]">
      <RankBadge rank={rank} inPrizes={inPrizes} />

      <p
        className="text-[var(--font-size-position)] font-black leading-none mt-3 animate-score-enter"
        style={{ color: 'var(--color-text-primary)', letterSpacing: '-2px' }}
      >
        {score}
      </p>
      <p className="text-[var(--font-size-body)] font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>
        pts
      </p>

      {inPrizes && (
        <div className="mt-2.5">
          <PrizeStatusPill />
        </div>
      )}

      {contextLine && !inPrizes && (
        <p className="text-[var(--font-size-body)] font-medium mt-4" style={{ color: 'var(--color-text-secondary)' }}>
          {contextLine}
        </p>
      )}

      <p className="text-[var(--font-size-xs)] mt-2" style={{ color: 'var(--color-text-muted)' }}>
        {updatedText}
      </p>

      <CTAButton
        label="Play now"
        icon="play"
        variant="primary"
        onClick={onPlay}
        secondaryLabel="View leaderboard"
        onSecondaryClick={onViewLeaderboard}
      />
    </div>
  );
}
