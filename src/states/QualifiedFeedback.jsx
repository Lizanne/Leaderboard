import { useEffect, useRef } from 'react';

/*
  Qualified (Entered Prize Zone) — Medium-energy meaningful moment

  Position bounce + rewards zone expand + card border flash.
  Auto-plays on mount. Respects prefers-reduced-motion.
*/

const SPRING_PUNCHY = 'cubic-bezier(0.22, 1.8, 0.36, 1)';
const SPRING_SNAPPY = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const SETTLE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function QualifiedFeedback() {
  const cardRef = useRef(null);
  const rankRef = useRef(null);
  const rankGlowRef = useRef(null);
  const rewardRef = useRef(null);
  const rewardBorderRef = useRef(null);
  const rewardTextRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const card = cardRef.current;
    const rankEl = rankRef.current;
    const rankGlow = rankGlowRef.current;
    const reward = rewardRef.current;
    const rewardBorder = rewardBorderRef.current;
    const rewardText = rewardTextRef.current;
    if (!card || !rankEl || !reward) return;

    if (prefersReduced) {
      rankEl.style.transform = 'scale(1)';
      if (rewardBorder) rewardBorder.style.opacity = '1';
      if (rewardText) rewardText.textContent = "You're in the prize zone";
      return;
    }

    // 1. Position number spring bounce (0ms)
    rankEl.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.15)', offset: 0.35 },
      { transform: 'scale(0.97)', offset: 0.65 },
      { transform: 'scale(1)' },
    ], {
      duration: 500,
      easing: 'linear', // keyframes handle the curve
      fill: 'forwards',
    });

    // 1b. Rank text glow (0ms)
    if (rankGlow) {
      rankGlow.animate([
        { opacity: 0, textShadow: '0 0 0px rgba(255,255,255,0)' },
        { opacity: 1, textShadow: '0 0 24px rgba(255,255,255,0.5)', offset: 0.3 },
        { opacity: 0, textShadow: '0 0 0px rgba(255,255,255,0)' },
      ], {
        duration: 700,
        easing: 'ease-out',
        fill: 'forwards',
      });
    }

    // 2. Rewards zone expand (200ms delay)
    setTimeout(() => {
      // Background tint
      reward.animate([
        { background: 'rgba(255,255,255,0.05)' },
        { background: 'rgba(255,255,255,0.12)' },
      ], {
        duration: 400,
        easing: SETTLE,
        fill: 'forwards',
      });

      // Left border slides in
      if (rewardBorder) {
        rewardBorder.animate([
          { transform: 'scaleY(0)', opacity: 0 },
          { transform: 'scaleY(1)', opacity: 1 },
        ], {
          duration: 350,
          easing: SPRING_SNAPPY,
          fill: 'forwards',
        });
      }

      // Text crossfade
      if (rewardText) {
        rewardText.animate([
          { opacity: 1 },
          { opacity: 0 },
        ], { duration: 150, fill: 'forwards' }).onfinish = () => {
          rewardText.textContent = "You're in the prize zone";
          rewardText.animate([
            { opacity: 0 },
            { opacity: 1 },
          ], { duration: 250, fill: 'forwards' });
        };
      }
    }, 200);

    // 3. Card border flash (100ms delay)
    setTimeout(() => {
      card.animate([
        { boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 0 0 0px rgba(255,255,255,0)' },
        { boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 0 0 2px rgba(255,255,255,0.6)', offset: 0.25 },
        { boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 0 0 0px rgba(255,255,255,0)' },
      ], {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards',
      });
    }, 100);
  }, []);

  return (
    <div className="pt-3 pb-6 px-4">
      <div
        ref={cardRef}
        className="overflow-hidden relative"
        style={{
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
          background: 'var(--color-surface)',
        }}
      >
        <img src="/hero-aristocrat.png" alt="" className="w-full block" />

        {/* Urgency bar */}
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="h-2 w-2 rounded-full shrink-0 animate-urgency-pulse" style={{ background: '#22c55e' }} />
          <p className="text-[14px] font-medium leading-5" style={{ color: 'var(--color-text-secondary)' }}>
            Leaderboard ends in <strong>14h 42m</strong>
          </p>
        </div>

        {/* Position section */}
        <div className="px-4 pt-6 pb-8">
          <p className="text-[12px] font-semibold leading-4" style={{ color: '#71717a' }}>
            Your position
          </p>

          {/* Rank with bounce + glow */}
          <div className="relative mt-1">
            {/* Glow layer (behind) */}
            <span
              ref={rankGlowRef}
              aria-hidden="true"
              className="absolute"
              style={{
                fontSize: 48, fontWeight: 800, lineHeight: '48px',
                color: 'transparent', opacity: 0,
                top: 0, left: 0,
                textShadow: '0 0 0px rgba(255,255,255,0)',
              }}
            >
              47<span style={{ fontSize: 20 }}>th</span>
            </span>

            {/* Actual rank */}
            <div ref={rankRef} className="flex items-baseline" style={{ transformOrigin: 'left bottom' }}>
              <span className="text-[48px] font-extrabold leading-[48px]" style={{ color: 'var(--color-text-primary)' }}>47</span>
              <span className="text-[20px] font-bold leading-[30px]" style={{ color: '#1a1a1a' }}>th</span>
            </div>
          </div>

          <p className="text-[14px] font-medium leading-5 mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            1,145 pts · 253 pts ahead of top 300
          </p>
          <p className="text-[12px] font-normal leading-4 mt-1" style={{ color: '#71717a' }}>
            Last updated 21 mins ago
          </p>

          {/* CTA */}
          <div className="flex flex-col gap-3 items-center mt-8">
            <button
              className="flex w-full h-[48px] items-center justify-center rounded-lg text-[16px] font-semibold cursor-pointer border-none"
              style={{ background: '#2563eb', color: '#fafafa' }}
            >
              Play now
            </button>
            <button
              className="flex w-full h-[48px] items-center justify-center gap-2 rounded-lg text-[16px] font-semibold cursor-pointer border-none bg-transparent"
              style={{ color: '#2563eb' }}
            >
              View leaderboard
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Rewards zone — animates from default to "in-prize" */}
        <div
          ref={rewardRef}
          className="px-4 pt-4 pb-4 relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {/* Animated left border */}
          <div
            ref={rewardBorderRef}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: 3, background: '#22c55e',
              transformOrigin: 'top',
              transform: 'scaleY(0)',
              opacity: 0,
              borderRadius: '0 2px 2px 0',
            }}
          />

          <p className="text-sm font-semibold leading-5 mb-2.5" style={{ color: 'var(--color-text-secondary)' }}>
            Rewards
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
              <img src="/cash-icon.png" alt="" className="w-full h-full object-cover" />
            </div>
            <p className="flex-1 min-w-0 text-[14px] font-semibold leading-5" style={{ color: 'var(--color-text-primary)' }}>
              Cash & Free Spins Prizes!
            </p>
            <div className="shrink-0 flex items-center gap-1.5">
              <span
                ref={rewardTextRef}
                className="rounded-md px-2 py-0.5 text-[12px] font-semibold"
                style={{
                  background: '#f0fdf4',
                  color: '#052e16',
                  height: 20,
                }}
              >
                Top 300 receive prizes
              </span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center pt-2.5 pb-3.5 px-4">
          <a className="text-[12px] font-semibold underline" style={{ color: 'var(--color-text-primary)' }}>
            Terms & conditions
          </a>
        </div>
      </div>
    </div>
  );
}
