import { motion } from 'motion/react';

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function RankPositionSection({
  rank,
  score,
  contextLine = '5 pts behind top 300',
  updatedText = 'Last updated 21 mins ago',
  onPlay,
  onViewLeaderboard,
}) {
  const suffix = getOrdinalSuffix(rank);

  return (
    <div className="px-4 pt-6 pb-8">
      {/* "Your position" label */}
      <p
        className="text-[12px] font-semibold leading-4 animate-state-enter"
        style={{ color: '#71717a' }}
      >
        Your position
      </p>

      {/* Rank line: 314th */}
      <div className="flex items-baseline mt-1 animate-score-enter">
        <span
          className="text-[48px] font-extrabold leading-[48px]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {rank}
        </span>
        <span
          className="text-[20px] font-bold leading-[30px]"
          style={{ color: '#1a1a1a' }}
        >
          {suffix}
        </span>
      </div>

      {/* Score + context */}
      <p
        className="text-[14px] font-medium leading-5 mt-1"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {score} pts · {contextLine}
      </p>

      {/* Last updated */}
      <p
        className="text-[12px] font-normal leading-4 mt-1"
        style={{ color: '#71717a' }}
      >
        {updatedText}
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 items-center mt-8">
        {/* Primary CTA — blue */}
        <motion.button
          onClick={onPlay}
          whileTap={{ scale: 0.97 }}
          whileHover={{ filter: 'brightness(1.08)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex w-full h-[48px] items-center justify-center rounded-lg text-[16px] font-semibold cursor-pointer border-none cta-shimmer"
          style={{
            background: '#2563eb',
            color: '#fafafa',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Play now
        </motion.button>

        {/* Secondary — view leaderboard */}
        <motion.button
          onClick={onViewLeaderboard}
          whileTap={{ scale: 0.97 }}
          className="flex w-full h-[48px] items-center justify-center gap-2 rounded-lg text-[16px] font-semibold cursor-pointer border-none bg-transparent"
          style={{ color: '#2563eb' }}
        >
          View leaderboard
          <ChevronRight />
        </motion.button>
      </div>
    </div>
  );
}
