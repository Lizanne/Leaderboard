import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import UrgencyBar from '../atoms/UrgencyBar';
import TermsLink from '../atoms/TermsLink';
import RewardsSection from './RewardsSection';

/* ───────────────────────────────────────────
   CSS Custom Properties for timing
   ─────────────────────────────────────────── */
const TIMING_VARS = {
  '--modal-enter-duration': '420ms',
  '--modal-exit-duration': '350ms',
  '--choreo-gap': '150ms',
  '--choreo-gap-lg': '200ms',
};

/* ───────────────────────────────────────────
   Spring curves (Web Animations API)
   ─────────────────────────────────────────── */
const SPRING_SOFT_OVERSHOOT = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const SETTLE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const PUNCHY = 'cubic-bezier(0.22, 1.8, 0.36, 1)';

/* ───────────────────────────────────────────
   Framer Motion variants for modal slide
   ─────────────────────────────────────────── */
const MODAL_ENTER_EASE = [0.16, 1, 0.3, 1];
const MODAL_EXIT_EASE = [0.4, 0, 1, 1];

const modalVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { duration: 0.42, ease: MODAL_ENTER_EASE },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.22, ease: MODAL_EXIT_EASE },
  },
};

const scrimVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: MODAL_ENTER_EASE } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: MODAL_EXIT_EASE } },
};

/* ───────────────────────────────────────────
   Utility: ordinal suffix
   ─────────────────────────────────────────── */
function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function formatRank(n) {
  if (!n || n <= 0) return 'Unranked';
  return `${n}${getOrdinalSuffix(n)}`;
}

/* ───────────────────────────────────────────
   Utility: reduced motion check
   ─────────────────────────────────────────── */
function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ───────────────────────────────────────────
   Animated element helper
   ─────────────────────────────────────────── */
function animateElement(el, keyframes, options) {
  if (!el) return null;
  if (prefersReducedMotion()) {
    // Apply final state immediately
    const last = keyframes[keyframes.length - 1];
    Object.assign(el.style, last);
    return null;
  }
  return el.animate(keyframes, { fill: 'forwards', ...options });
}

/* ───────────────────────────────────────────
   SVG Icons
   ─────────────────────────────────────────── */
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-success-check)" strokeWidth="3">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   PROGRESS RING (inline SVG)
   ═══════════════════════════════════════════ */
function ProgressRing({ progress = 0, size = 32, strokeWidth = 2.5, circleRef }) {
  const r = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0"
      style={{ transform: 'rotate(-90deg)' }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e4e4e7"
        strokeWidth={strokeWidth}
      />
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-success-fill)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED OPT-IN ROW (choreographed)
   ═══════════════════════════════════════════ */
function AnimatedOptInRow({ delay = 0, variant = 'default' }) {
  const isOrange = variant === 'orange';
  const checkRef = useRef(null);
  const rowRef = useRef(null);

  useEffect(() => {
    const check = checkRef.current;
    const row = rowRef.current;
    if (!check || !row) return;

    if (prefersReducedMotion()) {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
      check.style.transform = 'scale(1)';
      return;
    }

    row.style.opacity = '0';
    row.style.transform = 'translateY(6px)';
    check.style.transform = 'scale(0)';

    const t = setTimeout(() => {
      animateElement(row, [
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 300, easing: SETTLE });

      animateElement(check, [
        { transform: 'scale(0)' },
        { transform: 'scale(1.2)', offset: 0.6 },
        { transform: 'scale(0.95)', offset: 0.8 },
        { transform: 'scale(1)' },
      ], { duration: 350, easing: 'linear', delay: 50 });
    }, delay);

    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div ref={rowRef} className="flex items-center gap-3 py-3" style={{ opacity: 0, transform: 'translateY(6px)' }}>
      <div
        ref={checkRef}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: isOrange ? '#fff' : 'var(--color-success)', transform: 'scale(0)' }}
      >
        {isOrange ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <CheckIcon />
        )}
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-bold leading-5" style={{ color: isOrange ? '#fafafa' : 'var(--color-text-primary)' }}>Opt in</p>
        <p className="text-[12px] leading-4 mt-0.5" style={{ color: isOrange ? '#fafafa' : 'var(--color-text-secondary)', fontWeight: 600 }}>Complete</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED PROGRESS CIRCLE ROW (choreographed)
   ═══════════════════════════════════════════ */
function AnimatedProgressRow({ progress = 0, delay = 0, label, hint, action, onAction, variant = 'default' }) {
  const isOrange = variant === 'orange';
  const circleRef = useRef(null);
  const containerRef = useRef(null);
  const labelRef = useRef(null);
  const r = 13;
  const circumference = 2 * Math.PI * r;
  const targetOffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const circle = circleRef.current;
    const container = containerRef.current;
    const labelEl = labelRef.current;
    if (!circle || !container) return;

    if (prefersReducedMotion()) {
      container.style.transform = 'scale(1)';
      container.style.opacity = '1';
      circle.style.strokeDashoffset = String(targetOffset);
      if (labelEl) labelEl.style.opacity = '1';
      return;
    }

    container.style.transform = 'scale(0)';
    container.style.opacity = '0';
    circle.style.strokeDashoffset = String(circumference);
    if (labelEl) labelEl.style.opacity = '0';

    const t1 = setTimeout(() => {
      animateElement(container, [
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'scale(1.1)', opacity: 1, offset: 0.55 },
        { transform: 'scale(0.97)', opacity: 1, offset: 0.75 },
        { transform: 'scale(1)', opacity: 1 },
      ], { duration: 500, easing: 'linear' });

      circle.animate([
        { strokeDashoffset: circumference },
        { strokeDashoffset: targetOffset },
      ], { duration: 600, easing: SETTLE, fill: 'forwards', delay: 50 });
    }, delay);

    const t2 = setTimeout(() => {
      if (labelEl) {
        animateElement(labelEl, [
          { opacity: 0 },
          { opacity: 1 },
        ], { duration: 300, easing: SETTLE });
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
        <svg width="32" height="32" viewBox="0 0 32 32" className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="16" cy="16" r={r} fill="none" stroke={isOrange ? 'rgba(255,255,255,0.3)' : '#e4e4e7'} strokeWidth="2.5" />
          <circle
            ref={circleRef}
            cx="16" cy="16" r={r} fill="none"
            stroke={isOrange ? '#fff' : 'var(--color-success-fill)'}
            strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
      </div>

      <div ref={labelRef} className="flex-1 min-w-0" style={{ opacity: 0 }}>
        <p className="text-[14px] font-bold leading-5" style={{ color: isOrange ? '#fafafa' : 'var(--color-text-primary)' }}>{label}</p>
        <p className="text-[12px] leading-4 mt-0.5" style={{ color: isOrange ? '#fafafa' : 'var(--color-text-secondary)', fontWeight: 500 }}>{hint}</p>
      </div>

      {action && (
        <motion.button
          onClick={onAction}
          whileTap={{ scale: 0.95 }}
          whileHover={{ background: isOrange ? 'rgba(255,255,255,0.85)' : '#e4e4e7' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="shrink-0 rounded-lg text-[14px] font-semibold cursor-pointer leading-5"
          style={{
            background: isOrange ? '#ffffff' : '#f4f4f5',
            color: '#18181b', border: 'none',
            height: 32, paddingLeft: 12, paddingRight: 12, minWidth: 82,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {action}
        </motion.button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED REVEAL WRAPPER (slide up)
   ═══════════════════════════════════════════ */
function AnimatedReveal({ delay = 0, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';

    const t = setTimeout(() => {
      animateElement(el, [
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 350, easing: SETTLE });
    }, delay);

    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div ref={ref} style={{ opacity: 0, transform: 'translateY(12px)' }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED SPRING POP (scale from 0)
   ═══════════════════════════════════════════ */
function AnimatedSpring({ delay = 0, easing = PUNCHY, children, className, style }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      el.style.transform = 'scale(1)';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = 'scale(0.5)';

    const t = setTimeout(() => {
      animateElement(el, [
        { opacity: 0, transform: 'scale(0.5)' },
        { opacity: 1, transform: 'scale(1.05)', offset: 0.6 },
        { opacity: 1, transform: 'scale(0.98)', offset: 0.8 },
        { opacity: 1, transform: 'scale(1)' },
      ], { duration: 500, easing: 'linear' });
    }, delay);

    return () => clearTimeout(t);
  }, [delay, easing]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, transform: 'scale(0.5)', ...style }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED SLIDE (horizontal slide in)
   ═══════════════════════════════════════════ */
function AnimatedSlide({ delay = 0, direction = 'right', children, className, style }) {
  const ref = useRef(null);
  const translateStart = direction === 'right' ? 'translateX(20px)' : 'translateX(-20px)';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = translateStart;

    const t = setTimeout(() => {
      animateElement(el, [
        { opacity: 0, transform: translateStart },
        { opacity: 1, transform: 'translateX(0)' },
      ], { duration: 400, easing: SETTLE });
    }, delay);

    return () => clearTimeout(t);
  }, [delay, translateStart]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, transform: translateStart, ...style }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   OPT-OUT CONFIRMATION DIALOG
   ═══════════════════════════════════════════ */
function OptOutDialog({ open, onStay, onWithdraw }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onStay();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onStay]);

  // Focus trap inside dialog
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll('button');
    if (focusable.length) focusable[0].focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dialog scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onStay}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 110,
            }}
          />
          {/* Dialog centering wrapper */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 111,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              pointerEvents: 'none',
            }}
          >
          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="optout-title"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '24px 20px 20px',
              width: 'min(320px, 100%)',
              boxShadow: '0 24px 48px -12px rgba(0,0,0,0.25)',
              pointerEvents: 'auto',
            }}
          >
            <h3
              id="optout-title"
              className="text-[17px] font-bold leading-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Leave this promotion?
            </h3>
            <p
              className="text-[14px] leading-5 mt-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              You will lose all progress and will not be able to rejoin.
            </p>

            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={onStay}
                className="flex items-center justify-center h-[48px] w-full rounded-xl text-[15px] font-bold cursor-pointer border-none"
                style={{
                  background: 'var(--color-success)',
                  color: '#fff',
                  WebkitTapHighlightColor: 'transparent',
                  minHeight: 44,
                }}
              >
                Stay in promotion
              </button>
              <button
                onClick={onWithdraw}
                className="flex items-center justify-center h-[44px] w-full rounded-xl text-[15px] font-semibold cursor-pointer border-none bg-transparent"
                style={{
                  color: '#dc2626',
                  WebkitTapHighlightColor: 'transparent',
                  minHeight: 44,
                }}
              >
                Withdraw
              </button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   STATE CONTENT: PRE-QUALIFIED (Qualifying)
   Orange card treatment — white text on #c0490f
   ═══════════════════════════════════════════ */
function QualifyingContent({ deposit, play, onDeposit, onPlay, onWithdraw }) {
  const [showOptOut, setShowOptOut] = useState(false);

  const OPT_IN_DELAY = 100;
  const DEPOSIT_DELAY = 300;
  const PLAY_DELAY = 500;
  const REWARDS_DELAY = 700;

  const depositProgress = Math.min(100, (deposit / 20) * 100);
  const playProgress = Math.min(100, (play / 50) * 100);

  return (
    <>
      {/* Qualifiers section */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm font-bold leading-5 mb-1" style={{ color: '#fafafa' }}>
          Qualifiers
        </p>

        {/* Opt-in row — white circle with checkmark */}
        <AnimatedOptInRow delay={OPT_IN_DELAY} variant="orange" />

        {/* Deposit progress */}
        <AnimatedProgressRow
          delay={DEPOSIT_DELAY}
          progress={depositProgress}
          label="Deposit"
          hint={deposit >= 20 ? 'Complete' : `£${deposit} of £20`}
          action={deposit < 20 ? 'Deposit' : undefined}
          onAction={onDeposit}
          variant="orange"
        />

        {/* Play progress */}
        <AnimatedProgressRow
          delay={PLAY_DELAY}
          progress={playProgress}
          label="Play"
          hint={play >= 50 ? 'Complete' : `£${play} of £50`}
          action={play < 50 ? 'Play now' : undefined}
          onAction={onPlay}
          variant="orange"
        />
      </div>

      {/* Rewards locked — orange variant */}
      <AnimatedReveal delay={REWARDS_DELAY}>
        <div className="px-4 pt-4 pb-4">
          <p className="text-sm font-bold leading-5 mb-2.5" style={{ color: '#fafafa' }}>
            Rewards
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
              <img src="/cash-icon.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold leading-5" style={{ color: '#fafafa' }}>
                Cash & Free Spins Prizes!
              </p>
              <p className="text-[11px] font-normal leading-4 mt-0.5" style={{ color: 'rgba(250,250,250,0.7)' }}>
                Complete all qualifiers
              </p>
            </div>
            <div
              className="shrink-0 rounded-md px-2 py-0.5"
              style={{
                background: 'rgba(9,9,11,0.15)',
                color: '#fafafa',
                height: 20, fontSize: 12, fontWeight: 600,
              }}
            >
              Locked
            </div>
          </div>
        </div>
      </AnimatedReveal>

      {/* Withdraw link */}
      <div className="py-6 px-4">
        <button
          onClick={() => setShowOptOut(true)}
          className="text-[16px] font-semibold cursor-pointer border-none rounded-lg w-full"
          style={{
            color: '#fafafa',
            background: 'transparent',
            WebkitTapHighlightColor: 'transparent',
            minHeight: 48,
            padding: '12px 20px',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          Withdraw from promotion
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', margin: '0 16px' }} />

      {/* Terms — accessible link */}
      <div className="text-center pt-4 pb-4 px-4">
        <a
          href="#terms"
          className="text-[12px] font-semibold underline"
          style={{
            color: '#fafafa',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 6,
            display: 'inline-block',
            minHeight: 44,
            lineHeight: '28px',
            outline: 'none',
          }}
          onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #fff'}
          onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
          aria-label="View promotion terms and conditions"
        >
          Terms & conditions
        </a>
      </div>

      <OptOutDialog
        open={showOptOut}
        onStay={() => setShowOptOut(false)}
        onWithdraw={() => {
          setShowOptOut(false);
          onWithdraw?.();
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   STATE CONTENT: QUALIFIED (just-qualified / ongoing-in-prizes)
   ═══════════════════════════════════════════ */
function QualifiedContent({ rank, score, onPlayGame, onViewLeaderboard }) {
  const PILL_DELAY = 100;
  const POSITION_DELAY = 300;
  const DELTA_DELAY = 500;
  const REWARDS_DELAY = 700;

  const rankText = formatRank(rank);
  const isInPrizes = rank > 0 && rank <= 300;
  const distanceFromPrize = rank > 300 ? rank - 300 : 0;

  return (
    <>
      {/* Summary pill */}
      <AnimatedSpring delay={PILL_DELAY}>
        <div className="flex items-center justify-center px-4 pt-5">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: 'rgba(159,232,112,0.15)',
              color: 'var(--color-success-text)',
            }}
          >
            <CheckCircleIcon />
            <span className="text-[13px] font-semibold">All qualifiers met</span>
          </div>
        </div>
      </AnimatedSpring>

      {/* Position */}
      <AnimatedSpring delay={POSITION_DELAY} easing={PUNCHY}>
        <div className="text-center px-4 pt-4">
          <p
            className="text-[var(--font-size-position)] font-black leading-none"
            style={{
              color: 'var(--color-text-primary)',
              letterSpacing: '-2px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {rankText}
          </p>
          <p
            className="text-[14px] font-medium mt-1"
            style={{ color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}
          >
            {score.toLocaleString()} pts
          </p>
        </div>
      </AnimatedSpring>

      {/* Delta pill */}
      {distanceFromPrize > 0 && (
        <AnimatedSlide delay={DELTA_DELAY}>
          <div className="flex justify-center px-4 pt-3">
            <div
              className="inline-flex items-center gap-1 rounded-full px-3 py-1"
              style={{
                background: '#fef3c7',
                color: '#92400e',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              <span className="text-[12px] font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {distanceFromPrize} {distanceFromPrize === 1 ? 'place' : 'places'} from prizes
              </span>
            </div>
          </div>
        </AnimatedSlide>
      )}

      {isInPrizes && (
        <AnimatedSlide delay={DELTA_DELAY}>
          <div className="flex justify-center px-4 pt-3">
            <div
              className="inline-flex items-center gap-1 rounded-full px-3 py-1"
              style={{
                background: '#f0fdf4',
                color: '#052e16',
              }}
            >
              <span className="text-[12px] font-semibold">In prize zone</span>
            </div>
          </div>
        </AnimatedSlide>
      )}

      {/* Rewards unlocked */}
      <AnimatedReveal delay={REWARDS_DELAY}>
        <RewardsSection title="Cash & Free Spins Prizes!" status="unlocked" />
      </AnimatedReveal>

      {/* CTAs */}
      <AnimatedReveal delay={REWARDS_DELAY + 150}>
        <div className="px-4 pb-4">
          <motion.button
            onClick={onPlayGame}
            whileTap={{ scale: 0.97 }}
            whileHover={{ filter: 'brightness(1.05)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex w-full h-[48px] items-center justify-center gap-2 rounded-[var(--radius-button)] text-[15px] font-bold cursor-pointer border-none cta-shimmer"
            style={{
              background: 'var(--color-cta-primary)',
              color: 'var(--color-cta-primary-text)',
              boxShadow: '0 0 24px rgba(159, 232, 112, 0.25)',
              WebkitTapHighlightColor: 'transparent',
              minHeight: 48,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play now
          </motion.button>

          <motion.button
            onClick={onViewLeaderboard}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-center gap-1 mt-3 py-2 text-[var(--font-size-small)] font-semibold cursor-pointer border-none bg-transparent"
            style={{ color: 'var(--color-success-text)', minHeight: 44 }}
          >
            View leaderboard
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </motion.button>
        </div>
      </AnimatedReveal>

      {/* Terms */}
      <TermsLink />
    </>
  );
}

/* ═══════════════════════════════════════════
   STATE CONTENT: ENDED-WON
   ═══════════════════════════════════════════ */
function EndedWonContent({ rank, score, onClaim, onViewLeaderboard }) {
  const PRIZE_DELAY = 100;
  const CLAIM_DELAY = 400;
  const REWARDS_DELAY = 600;
  const LEADERBOARD_DELAY = 800;

  const suffix = getOrdinalSuffix(rank);

  return (
    <>
      {/* Prize */}
      <AnimatedSpring delay={PRIZE_DELAY} easing={PUNCHY}>
        <div className="px-4 pt-6 pb-4">
          <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#14532d' }}>
            You won
          </p>
          <p
            className="text-[var(--font-size-prize-amount)] font-black leading-none mt-1"
            style={{
              color: 'var(--color-text-primary)',
              letterSpacing: '-2px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            &pound;10
          </p>
          <p className="text-[14px] font-medium leading-5 mt-2" style={{ color: '#14532d' }}>
            Cash prize
          </p>
          <p className="text-[14px] font-medium leading-5 mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Finished{' '}
            <strong style={{ color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {rank}{suffix}
            </strong>{' '}
            &middot; {score.toLocaleString()} pts
          </p>
        </div>
      </AnimatedSpring>

      {/* Claim CTA */}
      <AnimatedReveal delay={CLAIM_DELAY}>
        <div className="px-4 pb-4">
          <motion.button
            onClick={onClaim}
            whileTap={{ scale: 0.97 }}
            whileHover={{ filter: 'brightness(1.05)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex w-full h-[48px] items-center justify-center rounded-[var(--radius-button)] text-[15px] font-bold cursor-pointer border-none cta-shimmer"
            style={{
              background: 'var(--color-success)',
              color: '#fff',
              boxShadow: '0 0 24px rgba(22, 101, 52, 0.3)',
              WebkitTapHighlightColor: 'transparent',
              minHeight: 48,
            }}
          >
            Claim &pound;10 to balance
          </motion.button>
        </div>
      </AnimatedReveal>

      {/* Rewards won */}
      <AnimatedReveal delay={REWARDS_DELAY}>
        <RewardsSection title="Cash & Free Spins Prizes!" status="in-prizes" />
      </AnimatedReveal>

      {/* View leaderboard */}
      <AnimatedReveal delay={LEADERBOARD_DELAY}>
        <div className="px-4 pb-4">
          <motion.button
            onClick={onViewLeaderboard}
            whileTap={{ scale: 0.97 }}
            className="flex w-full h-[44px] items-center justify-center gap-1 rounded-xl text-[14px] font-semibold cursor-pointer"
            style={{
              background: '#f4f4f5',
              color: 'var(--color-text-primary)',
              border: 'none',
              WebkitTapHighlightColor: 'transparent',
              minHeight: 44,
            }}
          >
            View full leaderboard
          </motion.button>
        </div>
      </AnimatedReveal>

      {/* Terms */}
      <TermsLink />
    </>
  );
}

/* ═══════════════════════════════════════════
   STATE CONTENT: ENDED-MISSED
   ═══════════════════════════════════════════ */
function EndedMissedContent({ rank, score, onViewLeaderboard }) {
  const POSITION_DELAY = 100;
  const REWARDS_DELAY = 400;
  const LEADERBOARD_DELAY = 600;

  const rankText = rank > 0 ? formatRank(rank) : 'Unranked';

  return (
    <>
      {/* Position */}
      <AnimatedSpring delay={POSITION_DELAY} easing={PUNCHY}>
        <div className="px-4 pt-6 pb-4">
          <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#71717a' }}>
            Final position
          </p>
          <p
            className="text-[48px] font-extrabold leading-[48px] mt-1"
            style={{
              color: 'var(--color-text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {rankText}
          </p>
          <p className="text-[14px] font-medium leading-5 mt-2" style={{ color: 'var(--color-text-secondary)' }}>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{score}</span> pts earned
          </p>
        </div>
      </AnimatedSpring>

      {/* Rewards */}
      <AnimatedReveal delay={REWARDS_DELAY}>
        <div className="px-4 pt-4 pb-4">
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
      </AnimatedReveal>

      {/* View leaderboard */}
      <AnimatedReveal delay={LEADERBOARD_DELAY}>
        <div className="px-4 pb-4">
          <motion.button
            onClick={onViewLeaderboard}
            whileTap={{ scale: 0.97 }}
            className="flex w-full h-[44px] items-center justify-center gap-1 rounded-xl text-[14px] font-semibold cursor-pointer"
            style={{
              background: '#f4f4f5',
              color: 'var(--color-text-primary)',
              border: 'none',
              WebkitTapHighlightColor: 'transparent',
              minHeight: 44,
            }}
          >
            View full leaderboard
          </motion.button>
        </div>
      </AnimatedReveal>

      {/* Terms */}
      <TermsLink />
    </>
  );
}

/* ═══════════════════════════════════════════
   FOCUS TRAP HOOK
   ═══════════════════════════════════════════ */
function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const previouslyFocused = document.activeElement;

    // Focus the first focusable element
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    requestAnimationFrame(() => {
      const first = container.querySelector(focusableSelector);
      if (first) first.focus();
    });

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(container.querySelectorAll(focusableSelector));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, active]);
}

/* ═══════════════════════════════════════════
   DRAG-TO-DISMISS HOOK (mobile swipe down)
   ═══════════════════════════════════════════ */
function useDragToDismiss(panelRef, onClose, active) {
  const dragState = useRef({ startY: 0, currentY: 0, isDragging: false });
  const DISMISS_THRESHOLD = 120;

  useEffect(() => {
    if (!active || !panelRef.current) return;
    const panel = panelRef.current;

    function onTouchStart(e) {
      // Only start drag if scrolled to top
      const scrollContainer = panel.querySelector('[data-scroll-content]') || panel;
      if (scrollContainer.scrollTop > 0) return;

      dragState.current.startY = e.touches[0].clientY;
      dragState.current.isDragging = true;
    }

    function onTouchMove(e) {
      if (!dragState.current.isDragging) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - dragState.current.startY;

      if (deltaY < 0) {
        // Scrolling up — cancel drag
        dragState.current.isDragging = false;
        panel.style.transform = '';
        return;
      }

      // Damped drag (rubber-band feel)
      const damped = deltaY * 0.6;
      panel.style.transform = `translateY(${damped}px)`;
      panel.style.transition = 'none';
      dragState.current.currentY = currentY;
    }

    function onTouchEnd() {
      if (!dragState.current.isDragging) return;

      const deltaY = dragState.current.currentY - dragState.current.startY;
      dragState.current.isDragging = false;

      if (deltaY > DISMISS_THRESHOLD) {
        onClose();
      } else {
        panel.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        panel.style.transform = '';
      }
    }

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchmove', onTouchMove, { passive: true });
    panel.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('touchend', onTouchEnd);
    };
  }, [panelRef, onClose, active]);
}

/* ═══════════════════════════════════════════
   URGENCY TEXT HELPER
   ═══════════════════════════════════════════ */
function getUrgencyConfig(effectiveState) {
  switch (effectiveState) {
    case 'pre-qualified':
      return { text: '6 days 14 hrs remaining', ended: false };
    case 'just-qualified':
    case 'ongoing-in-prizes':
      return { text: '6 days 14 hrs remaining', ended: false };
    case 'ended-won':
      return { text: 'Ended', ended: true, endedDotGreen: true };
    case 'ended-missed':
      return { text: 'Ended', ended: true };
    default:
      return { text: '6 days 14 hrs remaining', ended: false };
  }
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT: PromoModal
   ═══════════════════════════════════════════ */
export default function PromoModal({
  open,
  onClose,
  onWithdraw,
  effectiveState,
  rank = 0,
  score = 0,
  deposit = 0,
  play = 0,
  onDeposit,
  onPlay,
  onPlayGame,
  onViewLeaderboard,
  onClaim,
}) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const [contentKey, setContentKey] = useState(0);

  // Reset choreography when state or open changes
  useEffect(() => {
    if (open) {
      setContentKey((k) => k + 1);
    }
  }, [open, effectiveState]);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [open]);

  // Focus trap
  useFocusTrap(panelRef, open);

  // Drag-to-dismiss
  useDragToDismiss(panelRef, onClose, open);

  const urgencyConfig = useMemo(() => getUrgencyConfig(effectiveState), [effectiveState]);
  const promoTitle = 'Arise with Aristocrat';

  // Determine which state bucket we're in
  const isQualifying = effectiveState === 'pre-qualified';
  const isQualified = effectiveState === 'just-qualified' || effectiveState === 'ongoing-in-prizes';
  const isEndedWon = effectiveState === 'ended-won';
  const isEndedMissed = effectiveState === 'ended-missed';
  const isEnded = isEndedWon || isEndedMissed;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ─── Scrim ─── */}
          <motion.div
            key="promo-modal-scrim"
            variants={scrimVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
            className="promo-modal-scrim"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 100,
              WebkitTapHighlightColor: 'transparent',
            }}
          />

          {/* ─── Panel positioning wrapper ─── */}
          <div
            className="promo-modal-positioner"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 101,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
          <motion.div
            ref={panelRef}
            key="promo-modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={promoTitle}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              ...TIMING_VARS,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--color-surface)',
              pointerEvents: 'auto',
            }}
            className="promo-modal-panel"
          >
            {/* ─── Sticky Nav Bar ─── */}
            <div
              className="flex items-center shrink-0"
              style={{
                padding: '12px 16px',
                background: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <button
                onClick={onClose}
                aria-label="Close promotion details"
                className="flex items-center justify-center shrink-0 cursor-pointer border-none"
                style={{
                  width: 44,
                  height: 44,
                  background: '#f4f4f5',
                  borderRadius: 9999,
                  color: '#18181b',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <p
                className="flex-1 text-center text-[18px] font-semibold leading-[28px] truncate"
                style={{ color: '#18181b' }}
              >
                My Promotions
              </p>
              {/* Invisible spacer for perfect centering */}
              <div style={{ width: 44, height: 44, opacity: 0, flexShrink: 0 }} />
            </div>

            {/* ─── Scrollable Content ─── */}
            <div
              ref={scrollRef}
              data-scroll-content
              className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
              style={{
                WebkitOverflowScrolling: 'touch',
                background: isQualifying ? '#c0490f' : 'var(--color-surface)',
              }}
            >
              {/* ─── Hero Image ─── */}
              <div
                className="relative overflow-hidden"
                style={{ height: isQualifying ? 268 : 180 }}
              >
                <img
                  src="/hero-aristocrat.png"
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                  }}
                />
                {/* Gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isQualifying
                      ? 'linear-gradient(to top, #c0490f 0%, rgba(192,73,15,0.6) 25%, transparent 50%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
                    zIndex: 1,
                  }}
                />
                {/* Title overlaid at bottom — hidden for qualifying (image has text) */}
                {!isQualifying && (
                  <div
                    className="absolute bottom-0 left-0 right-0 px-5 pb-4"
                    style={{ zIndex: 2 }}
                  >
                    <h2
                      className="text-[22px] font-extrabold leading-[1.2]"
                      style={{
                        color: '#fff',
                        opacity: isEnded ? 0.7 : 1,
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }}
                    >
                      {promoTitle}
                    </h2>
                  </div>
                )}
              </div>

              {/* ─── Countdown/Status Line ─── */}
              {isQualifying ? (
                <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#c0490f' }}>
                  <div className="h-2 w-2 rounded-full shrink-0 animate-urgency-pulse" style={{ background: '#22c55e' }} />
                  <p className="text-[14px] font-medium leading-5" style={{ color: '#fafafa' }}>
                    Promotion ends in <strong>14h 42m</strong>
                  </p>
                </div>
              ) : (
                <UrgencyBar
                  text={urgencyConfig.text}
                  ended={urgencyConfig.ended}
                  endedText={urgencyConfig.text}
                  endedDotGreen={urgencyConfig.endedDotGreen}
                />
              )}

              {/* ─── State-specific content ─── */}
              <div key={contentKey}>
                {isQualifying && (
                  <QualifyingContent
                    deposit={deposit}
                    play={play}
                    onDeposit={onDeposit}
                    onPlay={onPlay}
                    onWithdraw={onWithdraw}
                  />
                )}

                {isQualified && (
                  <QualifiedContent
                    rank={rank}
                    score={score}
                    onPlayGame={onPlayGame}
                    onViewLeaderboard={onViewLeaderboard}
                  />
                )}

                {isEndedWon && (
                  <EndedWonContent
                    rank={rank}
                    score={score}
                    onClaim={onClaim}
                    onViewLeaderboard={onViewLeaderboard}
                  />
                )}

                {isEndedMissed && (
                  <EndedMissedContent
                    rank={rank}
                    score={score}
                    onViewLeaderboard={onViewLeaderboard}
                  />
                )}
              </div>

              {/* Bottom safe-area spacer (mobile) */}
              <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
            </div>

            {/* ─── Drag handle indicator (mobile) ─── */}
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
              style={{
                width: 36,
                height: 4,
                background: 'rgba(0,0,0,0.15)',
                zIndex: 11,
              }}
            />
          </motion.div>
          </div>

          {/* ─── Desktop media query styles (injected once) ─── */}
          <style>{`
            @media (min-width: 1200px) {
              .promo-modal-scrim {
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
              }
              .promo-modal-positioner {
                align-items: center !important;
                padding: 24px;
              }
              .promo-modal-panel {
                max-width: 600px !important;
                max-height: calc(100vh - 48px) !important;
                border-radius: 20px !important;
                overflow: hidden !important;
                box-shadow: 0 32px 64px -12px rgba(0,0,0,0.25);
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
