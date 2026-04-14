import { motion } from 'motion/react';

const SLIDE_IN_DURATION = 0.35;
const BRAND_ORANGE = '#FF5D1F';

const LEADERBOARD_DATA = [
  { rank: '1st', score: '4,218 pts', prize: '£400 cash' },
  { rank: '2nd', score: '3,891 pts', prize: '£350 cash' },
  { rank: '3rd', score: '3,422 pts', prize: '£300 cash' },
  { rank: '4th to 10th', score: '3,409 pts', prize: '£250 cash' },
  { rank: '11th to 30th', score: '3,387 pts', prize: '100 Free spins on Book Oz Magic 5...' },
  { rank: '11th to 30th', score: '3,292 pts', prize: '90 Free spins on Fire and Roses J...' },
  { rank: '31st to 70th', score: '3,204 pts', prize: '75 Free spins on Ancient Fortunes...', isUser: true },
  { rank: '71st to 150th', score: '2,945 pts', prize: '60 Free spins on Fire and Roses J...' },
  { rank: '151st to 250th', score: '2,894 pts', prize: '50 Free spins on Ancient Fortunes...' },
  { rank: '251st to 350th', score: '2,722 pts', prize: '40 Free spins on Book Oz Magic 5...' },
  { rank: '351st to 400th', score: '2,604 pts', prize: '30 Free spins on Fire and Roses J...' },
];

const rowVariants = {
  initial: { opacity: 0 },
  animate: (i) => ({
    opacity: 1,
    transition: {
      duration: 0.25,
      delay: SLIDE_IN_DURATION + 0.15 + i * 0.04,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function LeaderboardScreen() {
  return (
    <div style={{ background: BRAND_ORANGE }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: BRAND_ORANGE }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: SLIDE_IN_DURATION * 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="px-4 pt-5 pb-6"
      >
        <h2 className="text-[20px] font-extrabold leading-7" style={{ color: '#fff' }}>
          Giddy Up Leaderboard
        </h2>

        <div className="flex items-center gap-3 mt-2">
          <div
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5"
            style={{ background: 'rgba(9,9,11,0.15)', height: 22 }}
          >
            <span className="text-[12px]" style={{ color: '#fff' }}>★</span>
            <span className="text-[12px] font-semibold leading-4" style={{ color: '#fff' }}>Top 400</span>
          </div>
          <p className="text-[12px] font-medium leading-4" style={{ color: '#FAFAFA' }}>
            <strong style={{ color: '#fff', fontWeight: 700 }}>2,412</strong> players
          </p>
        </div>

        <div className="mt-5 rounded-[10px] p-4" style={{ background: 'rgba(9,9,11,0.15)' }}>
          <p className="text-[12px] font-semibold leading-4 uppercase" style={{ color: '#FAFAFA', letterSpacing: '0.3px' }}>
            Your position
          </p>
          <div className="flex items-baseline mt-1">
            <span className="text-[48px] font-extrabold leading-[48px]" style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>47</span>
            <span className="text-[20px] font-bold leading-[30px]" style={{ color: '#fff' }}>th</span>
          </div>
          <div className="inline-flex items-center rounded-md px-2 py-0.5 mt-2" style={{ background: 'rgba(0,0,0,0.20)', height: 22 }}>
            <span className="text-[12px] font-semibold leading-4" style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>3,359 pts</span>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      {/* Column headers — inside sticky wrapper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: SLIDE_IN_DURATION, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '12px 16px' }}
      >
        <span className="text-[14px] font-bold leading-5" style={{ color: '#FAFAFA', width: '38%', flexShrink: 0 }}>Rank</span>
        <span className="text-[14px] font-bold leading-5" style={{ color: '#FAFAFA', width: '22%', flexShrink: 0 }}>Score</span>
        <span className="text-[14px] font-bold leading-5" style={{ color: '#FAFAFA', width: '40%' }}>Prize</span>
      </motion.div>
      </div>

      {/* Scrollable table body */}
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '38%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '40%' }} />
          </colgroup>
          <tbody>
            {LEADERBOARD_DATA.map((row, i) => (
              <motion.tr
                key={i}
                custom={i}
                variants={rowVariants}
                initial="initial"
                animate="animate"
                style={{
                  height: 52,
                  background: row.isUser ? 'rgba(9,9,11,0.15)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <td style={{ padding: '0 0 0 16px', verticalAlign: 'middle' }}>
                  <div className="flex items-center gap-1.5" style={{ whiteSpace: 'nowrap' }}>
                    <span
                      className="text-[14px] leading-5"
                      style={{
                        color: '#FAFAFA',
                        fontWeight: row.isUser ? 700 : 600,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {row.rank}
                    </span>
                    {row.isUser && (
                      <span
                        className="text-[12px] font-semibold leading-4 px-1.5 py-0.5 rounded"
                        style={{ background: '#fff', color: '#18181b' }}
                      >
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: 0, verticalAlign: 'middle' }}>
                  <span
                    className="text-[14px] font-semibold leading-5"
                    style={{ color: '#FAFAFA', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {row.score}
                  </span>
                </td>
                <td style={{ padding: '0 16px 0 0', verticalAlign: 'middle' }}>
                  <span className="text-[14px] font-normal leading-5" style={{ color: '#FAFAFA' }}>
                    {row.prize}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
