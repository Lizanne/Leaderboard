import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

const SLIDE_IN_DURATION = 0.35;
const BRAND_ORANGE = '#FF5D1F';
const PRIZE_THRESHOLD = 400;
const TOTAL_PLAYERS = 2412;

// On-orange text — Figma uses white throughout, secondary in light alpha.
const INK = '#FAFAFA';
// Avatar circle background (light) + dark initials, per Figma.
const AVATAR_BG = '#FAFAFA';
const AVATAR_INK = '#18181B';
// YouCard / pinned bar — near-black.
const CARD_DARK = 'rgba(0,0,0,0.92)';
const CARD_HAIRLINE = 'inset 0 0 0 1px rgba(255,255,255,0.06)';
const GOLD = '#F2B544';
const GOLD_SOFT = '#FFE0B8';
const ZINC_400 = '#A1A1AA';
const ZINC_700 = '#3F3F46';
const DIVIDER = '1px solid rgba(255,255,255,0.10)';

// Three scenarios — one per derivable rank state.
const SCENARIOS = {
  outside: { rank: 412, score: 892 },
  tier:    { rank: 195, score: 2270 },
  top10:   { rank: 7,   score: 3292 },
};

const TOP_10 = [
  { rank: 1,  name: 'LuckyLena',    score: 4218, prize: '£400 cash' },
  { rank: 2,  name: 'HighRoller_J', score: 3891, prize: '£350 cash' },
  { rank: 3,  name: 'SpinKing77',   score: 3422, prize: '£300 cash' },
  { rank: 4,  name: 'MissFortune',  score: 3409, prize: '£250 cash' },
  { rank: 5,  name: 'AcePilot',     score: 3387, prize: '£200 cash' },
  { rank: 6,  name: 'GoldRushGus',  score: 3359, prize: '£150 cash' },
  { rank: 7,  name: 'VelvetVera',   score: 3292, prize: '£125 cash' },
  { rank: 8,  name: 'BetTheFarm',   score: 3204, prize: '£100 cash' },
  { rank: 9,  name: 'CherryChase',  score: 2945, prize: '£90 cash' },
  { rank: 10, name: 'NeonNomad',    score: 2894, prize: '£75 cash' },
];

const TIERS = [
  { range: '11th – 30th',   from: 11,  to: 30,  score: 2722, prize: '100 Free Spins' },
  { range: '31st – 70th',   from: 31,  to: 70,  score: 2604, prize: '90 Free Spins' },
  { range: '71st – 125th',  from: 71,  to: 125, score: 2532, prize: '75 Free Spins' },
  { range: '126th – 194th', from: 126, to: 194, score: 2401, prize: '60 Free Spins' },
  { range: '195th – 250th', from: 195, to: 250, score: 2256, prize: '50 Free Spins' },
  { range: '251st – 300th', from: 251, to: 300, score: 2175, prize: '40 Free Spins' },
  { range: '301st – 350th', from: 301, to: 350, score: 2072, prize: '30 Free Spins' },
  { range: '351st – 400th', from: 351, to: 400, score: 1894, prize: '20 Free Spins' },
];

const PRIZES = [
  { place: '1st',  rank: 1,  prize: '£400', kind: 'Cash' },
  { place: '2nd',  rank: 2,  prize: '£350', kind: 'Cash' },
  { place: '3rd',  rank: 3,  prize: '£300', kind: 'Cash' },
  { place: '4th',  rank: 4,  prize: '£250', kind: 'Cash' },
  { place: '5th',  rank: 5,  prize: '£200', kind: 'Cash' },
  { place: '6th',  rank: 6,  prize: '£150', kind: 'Cash' },
  { place: '7th',  rank: 7,  prize: '£125', kind: 'Cash' },
  { place: '8th',  rank: 8,  prize: '£100', kind: 'Cash' },
  { place: '9th',  rank: 9,  prize: '£90',  kind: 'Cash' },
  { place: '10th', rank: 10, prize: '£75',  kind: 'Cash' },
  { place: '11th – 30th',   prize: '100', kind: 'Free Spins' },
  { place: '31st – 70th',   prize: '90',  kind: 'Free Spins' },
  { place: '71st – 125th',  prize: '75',  kind: 'Free Spins' },
  { place: '126th – 194th', prize: '60',  kind: 'Free Spins' },
  { place: '195th – 250th', prize: '50',  kind: 'Free Spins' },
  { place: '251st – 300th', prize: '40',  kind: 'Free Spins' },
  { place: '301st – 350th', prize: '30',  kind: 'Free Spins' },
  { place: '351st – 400th', prize: '20',  kind: 'Free Spins' },
];

function lbOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
function lbFmt(n) { return n.toLocaleString('en-GB'); }

// Derive the position state from a rank.
function deriveState(rank) {
  if (rank >= 1 && rank <= 10) return 'top10';
  if (rank > 10 && rank <= PRIZE_THRESHOLD) return 'tier';
  return 'outside';
}
// Find the tier band that contains a rank, or null.
function findTier(rank) {
  return TIERS.find((t) => rank >= t.from && rank <= t.to) || null;
}
// Get the user's prize-tab place (the row to highlight on Prizes).
function getYouPrizePlace(state, rank) {
  if (state === 'top10') return `${rank}${lbOrdinal(rank)}`;
  if (state === 'tier') {
    const t = findTier(rank);
    return t ? t.range : null;
  }
  return null;
}
// Get the user's prize string for a given state.
function getUserPrize(state, rank) {
  if (state === 'top10') {
    const p = TOP_10.find((x) => x.rank === rank);
    return p ? p.prize : null;
  }
  if (state === 'tier') {
    const t = findTier(rank);
    return t ? t.prize : null;
  }
  return null;
}

// Lucide Star icon — https://lucide.dev/icons/star (outlined)
function StarIcon({ size = 12, color = 'currentColor' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function LBAvatar({ name, size = 28, you = false }) {
  const initials = name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
  // Near-white circle with dark initials; "You" avatar is the same disc with a star glyph.
  return (
    <span
      aria-hidden="true"
      style={{
        width: size, height: size, minWidth: size, borderRadius: '50%',
        background: AVATAR_BG,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, lineHeight: '16px', fontWeight: 600, letterSpacing: '0.02em',
        color: AVATAR_INK,
        flexShrink: 0,
      }}
    >
      {you ? <StarIcon size={12} color={AVATAR_INK} /> : initials}
    </span>
  );
}

// shadcn-style badge — small rounded pill, accepts coloured children for inline emphasis.
function Badge({ children, style }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        borderRadius: 12,
        padding: '4px 10px',
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.20)',
        fontSize: 12, fontWeight: 600, lineHeight: 1,
        whiteSpace: 'nowrap', flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function ModernTabs({ tabs, active, onChange }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        margin: '0 16px', padding: 4, borderRadius: 12,
        background: 'rgba(9,9,11,0.25)',
      }}
    >
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <button
            key={t}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t)}
            style={{
              border: 'none', cursor: 'pointer', borderRadius: 8,
              padding: '9px 18px', flex: 1,
              fontSize: 14, fontWeight: 600, letterSpacing: '0.01em',
              color: '#FFFFFF',
              background: isActive ? 'rgba(0,0,0,0.5)' : 'transparent',
              transition: 'background 0.2s ease',
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

const rowVariants = {
  initial: { opacity: 0, y: 8 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: SLIDE_IN_DURATION + 0.15 + i * 0.04,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const headerCellStyle = {
  fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#FFFFFF',
};

const COLS_LB = '1.4fr 0.8fr 1fr';
const COLS_PRIZES = '1.4fr 1fr';

function PlayerRow({ player, i }) {
  return (
    <motion.div
      custom={i}
      variants={rowVariants}
      initial="initial"
      animate="animate"
      style={{
        display: 'grid', gridTemplateColumns: COLS_LB, alignItems: 'center', gap: 8,
        padding: '11px 4px', borderBottom: DIVIDER,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span style={{ width: 26, display: 'inline-flex' }}>
          <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 800, color: INK }}>{player.rank}{lbOrdinal(player.rank)}</span>
        </span>
        <LBAvatar name={player.name} size={28} />
        <span style={{
          fontSize: 14, lineHeight: '20px', fontWeight: 700, color: INK,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{player.name}</span>
      </span>
      <span style={{ textAlign: 'right', fontSize: 14, lineHeight: '20px', fontWeight: 700, color: INK, fontVariantNumeric: 'tabular-nums' }}>
        {lbFmt(player.score)}<span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 400, color: INK }}> pts</span>
      </span>
      <span style={{ textAlign: 'right', fontSize: 14, lineHeight: '20px', fontWeight: 700, color: INK }}>
        {player.prize}
      </span>
    </motion.div>
  );
}

function TierRow({ tier, i }) {
  return (
    <motion.div
      custom={i}
      variants={rowVariants}
      initial="initial"
      animate="animate"
      style={{
        display: 'grid', gridTemplateColumns: COLS_LB, alignItems: 'center', gap: 8,
        padding: '11px 4px', borderBottom: DIVIDER,
      }}
    >
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 700, color: INK }}>{tier.range}</span>
        <span style={{ fontSize: 10.5, lineHeight: '14px', fontWeight: 700, color: INK }}>{tier.to - tier.from + 1} players</span>
      </span>
      <span style={{ textAlign: 'right', fontSize: 14, lineHeight: '20px', fontWeight: 700, color: INK, fontVariantNumeric: 'tabular-nums' }}>
        {lbFmt(tier.score)}<span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 400, color: INK }}> pts</span>
      </span>
      <span style={{ textAlign: 'right', fontSize: 14, lineHeight: '20px', fontWeight: 700, color: INK }}>
        {tier.prize}
      </span>
    </motion.div>
  );
}

// "YOUR POSITION" tag — overlaps the card top edge (the `tab` youBadge variant).
const YouPositionTag = () => (
  <span style={{
    position: 'absolute', top: -7, left: 12,
    fontSize: 8.5, fontWeight: 800, letterSpacing: '0.14em',
    background: GOLD_SOFT, color: '#7A2604',
    borderRadius: 999, padding: '2px 8px',
  }}>YOUR POSITION</span>
);

// Grid layout — for `top10` inline (aligns with the table columns).
const YouCardGrid = ({ rank, score, prize, i, innerRef }) => (
  <motion.div
    ref={innerRef}
    custom={i}
    variants={rowVariants}
    initial="initial"
    animate="animate"
    style={{
      display: 'grid', gridTemplateColumns: COLS_LB, alignItems: 'center', gap: 8,
      padding: 12,
      margin: '8px 0',
      borderRadius: 14, position: 'relative',
      background: CARD_DARK, color: '#fff',
      boxShadow: `${CARD_HAIRLINE}, 0 8px 26px rgba(0,0,0,0.35)`,
    }}
  >
    <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <LBAvatar name="You" you size={32} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 12, lineHeight: '16px', fontWeight: 800, textTransform: 'uppercase' }}>You</span>
        <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 700, color: '#A1A1AA' }}>
          {rank}{lbOrdinal(rank)} place
        </span>
      </span>
    </span>
    <span style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
      <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 800 }}>{lbFmt(score)}</span>
      <span style={{ fontSize: 12, lineHeight: '16px', fontWeight: 600 }}> pts</span>
    </span>
    <span style={{ textAlign: 'right', fontSize: 14, lineHeight: '20px', fontWeight: 700, color: GOLD }}>
      {prize}
    </span>
  </motion.div>
);

// Stacked layout — for `tier` + `outside` (standalone, no neighbouring columns to align).
// Right column has score over status, vertically stacked so each can grow without cramping.
const YouCardStacked = ({ rank, score, inZone, prize, gap, i, innerRef, showTag = true }) => (
  <motion.div
    ref={innerRef}
    custom={i}
    variants={rowVariants}
    initial="initial"
    animate="animate"
    style={{
      display: 'grid', gridTemplateColumns: 'auto 1fr',
      alignItems: 'center', gap: 12,
      padding: 12,
      margin: '8px 0',
      borderRadius: 14, position: 'relative',
      background: CARD_DARK, color: '#fff',
      boxShadow: `${CARD_HAIRLINE}, 0 8px 26px rgba(0,0,0,0.35)`,
    }}
  >
    {showTag && <YouPositionTag />}
    <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <LBAvatar name="You" you size={32} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 12, lineHeight: '16px', fontWeight: 700, textTransform: 'uppercase' }}>You</span>
        <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600, color: '#A1A1AA' }}>
          {rank}{lbOrdinal(rank)} place
        </span>
      </span>
    </span>
    <span style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      minWidth: 0, gap: 0, textAlign: 'right',
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 800 }}>{lbFmt(score)}</span>
        <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}> pts</span>
      </span>
      <span style={{
        fontSize: 12, lineHeight: '16px', fontWeight: 700,
        color: inZone ? GOLD : '#FCD34D',
      }}>
        {inZone ? `Winning ${prize}` : `${gap} points to prize zone`}
      </span>
    </span>
  </motion.div>
);

function LeaderboardColumnHeaders() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: COLS_LB, alignItems: 'center', gap: 8,
      padding: '12px 16px',
      background: BRAND_ORANGE, borderBottom: DIVIDER,
    }}>
      <span style={headerCellStyle}>Position</span>
      <span style={{ ...headerCellStyle, textAlign: 'right' }}>Score</span>
      <span style={{ ...headerCellStyle, textAlign: 'right' }}>Prize</span>
    </div>
  );
}

function PrizesColumnHeaders() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: COLS_PRIZES,
      padding: '12px 16px',
      background: BRAND_ORANGE, borderBottom: DIVIDER,
    }}>
      <span style={headerCellStyle}>Position</span>
      <span style={{ ...headerCellStyle, textAlign: 'right' }}>Prize</span>
    </div>
  );
}

function LeaderboardTab({ state, user, youRef }) {
  // top10 — inline replacement; grid layout aligns with table columns.
  if (state === 'top10') {
    const prize = getUserPrize('top10', user.rank);
    return (
      <div>
        <div style={{ padding: '0 16px' }}>
          {TOP_10.map((p, i) => (
            p.rank === user.rank
              ? <YouCardGrid key="you" rank={user.rank} score={user.score} prize={prize} i={i} innerRef={youRef} />
              : <PlayerRow key={`p-${p.rank}`} player={p} i={i} />
          ))}
          {TIERS.map((tier, i) => (
            <TierRow key={`t-${tier.range}`} tier={tier} i={TOP_10.length + i} />
          ))}
        </div>
      </div>
    );
  }

  // tier — YouCard injected right after the matching tier row; stacked layout.
  if (state === 'tier') {
    const userTier = findTier(user.rank);
    return (
      <div>
        <div style={{ padding: '0 16px' }}>
          {TOP_10.map((p, i) => <PlayerRow key={`p-${p.rank}`} player={p} i={i} />)}
          {TIERS.map((tier, idx) => {
            const i = TOP_10.length + idx;
            const isUserTier = userTier && tier.range === userTier.range;
            return (
              <span key={`t-${tier.range}`}>
                <TierRow tier={tier} i={i} />
                {isUserTier && (
                  <YouCardStacked
                    rank={user.rank}
                    score={user.score}
                    inZone
                    prize={tier.prize}
                    i={i + 0.5}
                    innerRef={youRef}
                    showTag={false}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // outside — separator + YouCard + separator.
  const lastTier = TIERS[TIERS.length - 1];
  const playersAboveYou = Math.max(0, user.rank - lastTier.to - 1);
  const playersBelowYou = Math.max(0, TOTAL_PLAYERS - user.rank);
  const gap = Math.max(0, user.rank - PRIZE_THRESHOLD);

  return (
    <div>
      <div style={{ padding: '0 16px' }}>
        {TOP_10.map((p, i) => <PlayerRow key={`p-${p.rank}`} player={p} i={i} />)}
        {TIERS.map((tier, i) => <TierRow key={`t-${tier.range}`} tier={tier} i={TOP_10.length + i} />)}

        <motion.div
          custom={TOP_10.length + TIERS.length}
          variants={rowVariants}
          initial="initial"
          animate="animate"
          style={{
            textAlign: 'center', padding: '12px 0',
            fontSize: 12, lineHeight: '16px', fontWeight: 700, letterSpacing: '0.1em',
            color: '#FFFFFF',
          }}
        >
          - {playersAboveYou} players -
        </motion.div>

        <YouCardStacked
          rank={user.rank}
          score={user.score}
          inZone={false}
          gap={gap}
          i={TOP_10.length + TIERS.length + 1}
          innerRef={youRef}
          showTag={false}
        />

        <motion.div
          custom={TOP_10.length + TIERS.length + 2}
          variants={rowVariants}
          initial="initial"
          animate="animate"
          style={{
            textAlign: 'center', padding: '12px 0',
            fontSize: 12, lineHeight: '16px', fontWeight: 700, letterSpacing: '0.1em',
            color: '#FFFFFF',
          }}
        >
          - {lbFmt(playersBelowYou)} players below -
        </motion.div>
      </div>
    </div>
  );
}

// Render a prize "place" string, splitting rank ordinal (semibold) from suffix (regular)
// to match Figma: "1" 600 + "st" 400. Tier ranges render in semibold + " to " regular.
function PrizePlace({ place }) {
  const range = place.match(/^(\d+)(\w+)\s+–\s+(\d+)(\w+)$/);
  if (range) {
    const [, n1, s1, n2, s2] = range;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
        <span style={{ fontWeight: 600 }}>{n1}</span>
        <span style={{ fontWeight: 400 }}>{s1}</span>
        <span style={{ fontWeight: 400 }}>{' to '}</span>
        <span style={{ fontWeight: 600 }}>{n2}</span>
        <span style={{ fontWeight: 400 }}>{s2}</span>
      </span>
    );
  }
  const single = place.match(/^(\d+)(\w+)$/);
  if (single) {
    const [, n, s] = single;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600 }}>{n}</span>
        <span style={{ fontWeight: 400 }}>{s}</span>
      </span>
    );
  }
  return <span style={{ fontWeight: 600 }}>{place}</span>;
}

function PrizesTab({ state, user }) {
  const youPrizePlace = getYouPrizePlace(state, user.rank);
  // Highlight treatment is only for top10 (cash winners). Tier YOU row is plain.
  const highlightInline = state === 'top10';
  return (
    <div>
      <div>
        {PRIZES.map((p, i) => {
          const isYou = youPrizePlace != null && p.place === youPrizePlace;
          const isHighlighted = isYou && highlightInline;
          return (
            <motion.div
              key={p.place}
              custom={i}
              variants={rowVariants}
              initial="initial"
              animate="animate"
              style={{
                display: 'grid', gridTemplateColumns: COLS_PRIZES, alignItems: 'center',
                minHeight: 52,
                margin: isHighlighted ? '4px 16px' : '0 16px',
                padding: isHighlighted ? '12px 16px' : '12px 0',
                borderRadius: isHighlighted ? 12 : 0,
                borderBottom: isHighlighted ? 'none' : DIVIDER,
                background: isHighlighted ? CARD_DARK : 'transparent',
                color: '#FFFFFF',
                position: 'relative',
              }}
            >
              <span style={{
                fontSize: 14, lineHeight: '20px',
                color: '#FFFFFF',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <PrizePlace place={p.place} />
                {isHighlighted && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                    color: '#FFFFFF',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.30)',
                    borderRadius: 6,
                    padding: '2px 8px',
                    lineHeight: 1,
                  }}>YOU</span>
                )}
              </span>
              <span style={{
                textAlign: 'right', fontSize: 14, lineHeight: '20px',
                color: isHighlighted && p.kind === 'Cash' ? '#FCD34D' : '#fafafa',
              }}>
                {p.kind === 'Cash' ? (
                  <>
                    <span style={{ fontWeight: 600 }}>{p.prize}</span>
                    {isHighlighted && (
                      <span style={{ fontWeight: 400, color: '#FCD34D' }}>{' cash'}</span>
                    )}
                  </>
                ) : (
                  <>
                    <span style={{ fontWeight: 700 }}>{p.prize}</span>
                    <span style={{ fontWeight: 400 }}>{' Free spins'}</span>
                  </>
                )}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function LeaderboardScreen({ scenario = 'outside' }) {
  const [tab, setTab] = useState('Leaderboard');
  const [youVisible, setYouVisible] = useState(false);
  const youRef = useRef(null);
  const observerRef = useRef(null);

  const user = SCENARIOS[scenario];
  // Derive position state from rank; all downstream behavior keys off it.
  const state = deriveState(user.rank);
  const inZone = state !== 'outside';
  const userPrize = getUserPrize(state, user.rank);
  // Pinned bar is hidden in top10 (both tabs) — the inline You treatment is the
  // single source of truth so we never show two "you" markers.
  const showPinnedBar = state !== 'top10';

  // Watch You card visibility; auto-hide pinned bar while it's on screen.
  // Re-bind when scenario/state/tab changes — the YouCard is re-mounted on each of these
  // (via the parent's key) so the previous observer points at a stale DOM node.
  useEffect(() => {
    if (!showPinnedBar) {
      setYouVisible(false);
      return undefined;
    }
    if (typeof IntersectionObserver === 'undefined') return undefined;
    // Use a small timeout so we observe the freshly-mounted YouCard, not the stale one.
    const handle = setTimeout(() => {
      const el = youRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => setYouVisible(entry.isIntersecting),
        { threshold: 0.1 }
      );
      io.observe(el);
      observerRef.current = io;
    }, 0);
    return () => {
      clearTimeout(handle);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [showPinnedBar, tab, state, scenario]);

  const findMe = useCallback(() => {
    const el = youRef.current;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const pinnedActionable = tab === 'Leaderboard' && showPinnedBar;
  const pinnedBarHidden = pinnedActionable && youVisible;

  return (
    <div style={{ background: BRAND_ORANGE, minHeight: '100vh', position: 'relative' }}>
      {/* Sticky header — title, badge, position card, scenario toggle, tabs */}
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: BRAND_ORANGE }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: SLIDE_IN_DURATION * 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="px-4 pt-4 pb-4"
        >
          <h2 className="text-[20px] font-extrabold leading-7" style={{ color: '#fff', margin: 0 }}>
            Giddy Up Leaderboard
          </h2>

          <div className="flex items-center gap-3 mt-2">
            <div
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5"
              style={{ background: 'rgba(0,0,0,0.5)', height: 20 }}
            >
              <StarIcon size={12} color="#fff" />
              <span className="text-[12px] font-semibold leading-4" style={{ color: '#fff' }}>Top {PRIZE_THRESHOLD}</span>
            </div>
            <p className="text-[12px] leading-4" style={{ color: '#FAFAFA' }}>
              <strong style={{ color: '#fff', fontWeight: 700 }}>{lbFmt(TOTAL_PLAYERS)}</strong> players
            </p>
          </div>

        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: SLIDE_IN_DURATION, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingTop: 12, paddingBottom: 12 }}
        >
          <ModernTabs tabs={['Leaderboard', 'Prizes']} active={tab} onChange={setTab} />
        </motion.div>

        {/* Column headers — sticky with the orange section so they stay visible while scrolling rows */}
        {tab === 'Leaderboard' ? <LeaderboardColumnHeaders /> : <PrizesColumnHeaders />}
      </div>

      {/* Tab content — re-mount on tab/scenario change to re-trigger stagger */}
      <div key={`${scenario}-${tab}`}>
        {tab === 'Leaderboard'
          ? <LeaderboardTab state={state} user={user} youRef={youRef} />
          : <PrizesTab state={state} user={user} />}
      </div>

      {/* Spacer so the sticky pinned bar (when present) clears the state-jumper at the bottom */}
      <div style={{ height: showPinnedBar ? 0 : 80 }} />

      {/* Pinned "Your Position" bar — outside only.
          Uses position: sticky so it survives the parent's motion.div transform
          (a fixed bar gets containing-block clipped during page-slide transitions). */}
      {showPinnedBar && (
        <div style={{
          position: 'sticky', bottom: 72, zIndex: 50,
          padding: '0 12px',
          marginTop: 12,
          pointerEvents: 'none',
        }}>
        <button
          onClick={pinnedActionable ? findMe : undefined}
          aria-hidden={pinnedBarHidden}
          style={{
            width: '100%',
            transform: pinnedBarHidden ? 'translateY(8px)' : 'translateY(0)',
            margin: 0, padding: 12,
            border: 'none', borderRadius: 12,
            background: CARD_DARK, color: '#fff',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 8px 13px rgba(0,0,0,0.35)',
            cursor: pinnedActionable ? 'pointer' : 'default',
            textAlign: 'left',
            opacity: pinnedBarHidden ? 0 : 1,
            pointerEvents: pinnedBarHidden ? 'none' : 'auto',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          <LBAvatar name="You" you size={32} ring="rgba(0,0,0,0.32)" />
          {/* Tier + Prizes uses a stacked right column (score + status) per the Figma.
              Everything else keeps the inline rank · score in the middle. */}
          {state === 'tier' && tab === 'Prizes' ? (
            <>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 12, fontWeight: 600, lineHeight: '16px', color: '#fff' }}>
                  YOUR POSITION
                </span>
                <span style={{ display: 'block', fontSize: 14, lineHeight: '20px', fontWeight: 600, color: '#A1A1AA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.rank}{lbOrdinal(user.rank)} place
                </span>
              </span>
              <span style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                textAlign: 'right', flexShrink: 0,
              }}>
                <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 800, color: '#fff' }}>{lbFmt(user.score)}</span>
                  <span style={{ fontSize: 12, lineHeight: '16px', fontWeight: 600, color: '#fff' }}> pts</span>
                </span>
                <span style={{ fontSize: 12, lineHeight: '16px', fontWeight: 700, color: '#FCD34D', whiteSpace: 'nowrap' }}>
                  Winning {userPrize}
                </span>
              </span>
            </>
          ) : (
            <>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 12, fontWeight: 600, lineHeight: '16px', color: '#fff' }}>
                  YOUR POSITION
                </span>
                <span style={{ display: 'block', fontSize: 14, lineHeight: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ fontWeight: 700, color: '#A1A1AA' }}>{user.rank}{lbOrdinal(user.rank)}</span>
                  <span style={{ fontWeight: 500, color: '#A1A1AA' }}> · </span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{lbFmt(user.score)}pts</span>
                </span>
              </span>
              {pinnedActionable ? (
                <span style={{
                  fontSize: 14, fontWeight: 600,
                  color: '#fff', background: ZINC_700,
                  borderRadius: 8, padding: '8px 12px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>Find me</span>
              ) : (
                <span style={{
                  fontSize: 14, fontWeight: 600,
                  color: inZone ? GOLD : ZINC_400,
                  textAlign: 'right', whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {inZone ? `Winning ${userPrize}` : 'Not in prize zone'}
                </span>
              )}
            </>
          )}
        </button>
        </div>
      )}
    </div>
  );
}
