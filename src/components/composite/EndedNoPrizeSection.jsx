import { motion } from 'motion/react';

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function EndedNoPrizeSection({ score = 4, onViewResults }) {
  return (
    <>
      {/* Position content */}
      <div className="px-4 pt-6 pb-8">
        <p
          className="text-[12px] font-semibold leading-4 animate-state-enter"
          style={{ color: '#71717a' }}
        >
          Final position
        </p>

        <p
          className="text-[48px] font-extrabold leading-[48px] mt-1 animate-score-enter"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Unranked
        </p>

        <p
          className="text-[14px] font-medium leading-5 mt-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {score} pts earned
        </p>
      </div>

      {/* CTA */}
      <div className="px-4 pb-6">
        <motion.button
          onClick={onViewResults}
          whileTap={{ scale: 0.97 }}
          whileHover={{ filter: 'brightness(1.08)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex w-full h-[48px] items-center justify-center gap-2 rounded-lg text-[16px] font-semibold cursor-pointer border-none"
          style={{
            background: '#2563eb',
            color: '#fafafa',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          View final results
          <ChevronRight />
        </motion.button>
      </div>

      {/* Rewards */}
      <div className="px-4 pt-4 pb-4 animate-state-enter">
        <p className="text-sm font-semibold leading-5 mb-2.5" style={{ color: 'var(--color-text-secondary)' }}>
          Rewards
        </p>
        <div className="flex items-center gap-3">
          <p className="flex-1 text-[14px] font-semibold leading-5" style={{ color: 'var(--color-text-primary)' }}>
            Top 300 received prizes
          </p>
          <div
            className="shrink-0 rounded-md px-2 py-0.5"
            style={{
              background: '#f4f4f5',
              color: 'var(--color-text-secondary)',
              height: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            No reward
          </div>
        </div>
      </div>
    </>
  );
}
