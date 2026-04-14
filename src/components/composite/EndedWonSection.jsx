import { motion } from 'motion/react';

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default function EndedWonSection({ amount = '£10', type = 'Cash prize', rank = 47, score = 1145, rewardIcon, onClaim }) {
  const suffix = getOrdinalSuffix(rank);

  return (
    <>
      {/* Prize content */}
      <div className="px-4 pt-6 pb-8">
        <p
          className="text-[12px] font-semibold leading-4 animate-state-enter"
          style={{ color: '#14532d' }}
        >
          You won
        </p>

        <p
          className="text-[48px] font-extrabold leading-[48px] mt-1 animate-score-enter"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {amount}
        </p>

        <p
          className="text-[14px] font-medium leading-5 mt-1"
          style={{ color: '#14532d' }}
        >
          {type}
        </p>

        <p
          className="text-[14px] font-medium leading-5 mt-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Finished <strong style={{ color: 'var(--color-text-primary)' }}>{rank}{suffix}</strong> · {score.toLocaleString()} pts
        </p>
      </div>

      {/* Rewards with Claim button */}
      <div className="px-4 pt-4 pb-4 animate-state-enter">
        <p className="text-sm font-semibold leading-5 mb-2.5" style={{ color: 'var(--color-text-secondary)' }}>
          Rewards
        </p>
        <div className="flex items-center gap-3">
          {/* Round icon */}
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
            {rewardIcon ? (
              <img src={rewardIcon} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-full text-lg"
                style={{ background: '#f4f4f5' }}
              >
                🎰
              </div>
            )}
          </div>

          {/* Title */}
          <p className="flex-1 min-w-0 text-[14px] font-semibold leading-5" style={{ color: 'var(--color-text-primary)' }}>
            Cash & Free Spins Prizes!
          </p>

          {/* Claim button */}
          <motion.button
            onClick={onClaim}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="shrink-0 rounded-lg text-[14px] font-semibold cursor-pointer"
            style={{
              background: '#f4f4f5',
              color: '#18181b',
              border: 'none',
              height: 32,
              width: 82,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Claim
          </motion.button>
        </div>
      </div>
    </>
  );
}
