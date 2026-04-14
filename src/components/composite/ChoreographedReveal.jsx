import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const SPRING_OVERSHOOT = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const SETTLE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const PUNCHY = 'cubic-bezier(0.22, 1.8, 0.36, 1)';

/*
  Choreographed Reveal — plays inside the expanded detail view
  after the FLIP expand completes.

  Timeline:
  t=0      Opt-in row: fade in + checkmark spring
  t=350    Opt-in row settled
  t=500    Deposit circle: scale spring + stroke fill
  t=1100   Deposit settled
  t=1250   Play circle: scale spring + stroke fill
  t=1850   Play settled
  t=2050   Rewards zone: slide up
  t=2400   Done
*/

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-check)" strokeWidth="3">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function AnimatedProgressCircle({ progress = 0, delay = 0, label, hint, action, onAction }) {
  const circleRef = useRef(null);
  const containerRef = useRef(null);
  const labelRef = useRef(null);
  const r = 13;
  const circumference = 2 * Math.PI * r;
  const targetOffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const circle = circleRef.current;
    const container = containerRef.current;
    const labelEl = labelRef.current;
    if (!circle || !container) return;

    if (prefersReduced) {
      container.style.transform = 'scale(1)';
      container.style.opacity = '1';
      circle.style.strokeDashoffset = String(targetOffset);
      if (labelEl) labelEl.style.opacity = '1';
      return;
    }

    // Start hidden
    container.style.transform = 'scale(0)';
    container.style.opacity = '0';
    circle.style.strokeDashoffset = String(circumference);
    if (labelEl) labelEl.style.opacity = '0';

    const t1 = setTimeout(() => {
      // Scale spring with overshoot
      container.animate([
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'scale(1.1)', opacity: 1, offset: 0.55 },
        { transform: 'scale(0.97)', opacity: 1, offset: 0.75 },
        { transform: 'scale(1)', opacity: 1 },
      ], {
        duration: 500,
        easing: 'linear',
        fill: 'forwards',
      });

      // Stroke fill (slightly longer, settles after bounce)
      circle.animate([
        { strokeDashoffset: circumference },
        { strokeDashoffset: targetOffset },
      ], {
        duration: 600,
        easing: SETTLE,
        fill: 'forwards',
        delay: 50,
      });
    }, delay);

    // Label fade in
    const t2 = setTimeout(() => {
      if (labelEl) {
        labelEl.animate([
          { opacity: 0 },
          { opacity: 1 },
        ], {
          duration: 300,
          easing: SETTLE,
          fill: 'forwards',
        });
      }
    }, delay + 200);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [delay, targetOffset, circumference]);

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        ref={containerRef}
        className="relative flex h-8 w-8 shrink-0 items-center justify-center"
        style={{ transform: 'scale(0)', opacity: 0 }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" className="absolute inset-0"
          style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="16" cy="16" r={r} fill="none" stroke="#e4e4e7" strokeWidth="2.5" />
          <circle
            ref={circleRef}
            cx="16" cy="16" r={r} fill="none"
            stroke="var(--color-success-fill)"
            strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
      </div>

      <div ref={labelRef} className="flex-1 min-w-0" style={{ opacity: 0 }}>
        <p className="text-[14px] font-bold leading-5" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
        <p className="text-[12px] leading-4 mt-0.5" style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{hint}</p>
      </div>

      {action && (
        <motion.button
          onClick={onAction}
          whileTap={{ scale: 0.95 }}
          className="shrink-0 rounded-lg text-[14px] font-semibold cursor-pointer leading-5"
          style={{
            background: '#f4f4f5', color: '#18181b', border: 'none',
            height: 32, paddingLeft: 12, paddingRight: 12, minWidth: 82,
          }}
        >
          {action}
        </motion.button>
      )}
    </div>
  );
}

function AnimatedOptInRow({ delay = 0 }) {
  const checkRef = useRef(null);
  const rowRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const check = checkRef.current;
    const row = rowRef.current;
    if (!check || !row) return;

    if (prefersReduced) {
      row.style.opacity = '1';
      check.style.transform = 'scale(1)';
      return;
    }

    row.style.opacity = '0';
    check.style.transform = 'scale(0)';

    const t = setTimeout(() => {
      row.animate([
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], {
        duration: 300,
        easing: SETTLE,
        fill: 'forwards',
      });

      check.animate([
        { transform: 'scale(0)' },
        { transform: 'scale(1.2)', offset: 0.6 },
        { transform: 'scale(0.95)', offset: 0.8 },
        { transform: 'scale(1)' },
      ], {
        duration: 350,
        easing: 'linear',
        fill: 'forwards',
        delay: 50,
      });
    }, delay);

    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div ref={rowRef} className="flex items-center gap-3 py-3" style={{ opacity: 0 }}>
      <div
        ref={checkRef}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'var(--color-success)', transform: 'scale(0)' }}
      >
        <CheckIcon />
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-bold leading-5" style={{ color: 'var(--color-text-primary)' }}>Opt in</p>
        <p className="text-[12px] leading-4 mt-0.5" style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Complete</p>
      </div>
    </div>
  );
}

function AnimatedRewardsZone({ delay = 0, icon, title, status }) {
  const ref = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    if (!el) return;

    if (prefersReduced) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';

    const t = setTimeout(() => {
      el.animate([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], {
        duration: 350,
        easing: SETTLE,
        fill: 'forwards',
      });
    }, delay);

    return () => clearTimeout(t);
  }, [delay]);

  const badgeStyle = status === 'in-prizes'
    ? { background: '#f0fdf4', color: '#052e16' }
    : { background: '#f4f4f5', color: 'var(--color-text-secondary)' };
  const badgeLabel = status === 'in-prizes' ? 'In prizes' : 'Locked';

  return (
    <div ref={ref} className="px-4 pt-4 pb-4" style={{ opacity: 0, transform: 'translateY(12px)' }}>
      <p className="text-sm font-semibold leading-5 mb-2.5" style={{ color: 'var(--color-text-secondary)' }}>
        Rewards
      </p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
          {icon ? (
            <img src={icon} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full text-lg" style={{ background: '#f4f4f5' }}>🎰</div>
          )}
        </div>
        <p className="flex-1 min-w-0 text-[14px] font-semibold leading-5" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </p>
        <div className="shrink-0 rounded-md px-2 py-0.5" style={{ ...badgeStyle, height: 20, fontSize: 12, fontWeight: 600 }}>
          {badgeLabel}
        </div>
      </div>
    </div>
  );
}

export default function ChoreographedReveal({ deposit, play, onDeposit, onPlay, rewardIcon, rewardStatus }) {
  // Timing offsets (ms after mount = after FLIP settles)
  const OPT_IN_DELAY = 0;
  const DEPOSIT_DELAY = 500;
  const PLAY_DELAY = 1250;
  const REWARDS_DELAY = 2050;

  const depositProgress = Math.min(100, (deposit / 20) * 100);
  const playProgress = Math.min(100, (play / 50) * 100);

  return (
    <div className="px-4 pt-4 pb-2">
      <p className="text-sm font-semibold leading-5 mb-1" style={{ color: 'var(--color-text-secondary)' }}>
        Qualifiers
      </p>

      <AnimatedOptInRow delay={OPT_IN_DELAY} />

      <AnimatedProgressCircle
        delay={DEPOSIT_DELAY}
        progress={depositProgress}
        label="Deposit"
        hint={deposit >= 20 ? 'Complete' : `£${deposit} of £20`}
        action={deposit < 20 ? 'Deposit' : undefined}
        onAction={onDeposit}
      />

      <AnimatedProgressCircle
        delay={PLAY_DELAY}
        progress={playProgress}
        label="Play"
        hint={play >= 50 ? 'Complete' : `£${play} of £50`}
        action={play < 50 ? 'Play now' : undefined}
        onAction={onPlay}
      />

      <AnimatedRewardsZone
        delay={REWARDS_DELAY}
        icon={rewardIcon}
        title="Cash & Free Spins Prizes!"
        status={rewardStatus || 'locked'}
      />
    </div>
  );
}
