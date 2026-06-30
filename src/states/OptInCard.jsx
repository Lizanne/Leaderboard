import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/* ───────────────────────────────────────────
   Constants & Curves
   ─────────────────────────────────────────── */
const BRAND_ORANGE = '#FF5D1F';
const PRIMARY_TEXT = '#FAFAFA';
const SECONDARY_TEXT = '#fff3e4';
const CONTAINER_BG = 'rgba(0,0,0,0.12)';
const BADGE_BG = 'rgba(0,0,0,0.15)';
const BUTTON_TERTIARY_BG = 'rgba(255,255,255,0.85)';
const OPT_IN_BUTTON_BG = 'rgba(0,0,0,0.25)';
const RING_TRACK = 'rgba(9,9,11,0.25)';
const CHECK_CIRCLE_BG = '#ffffff';
const DELTA_PILL_BG = 'rgba(0,0,0,0.12)';

const SETTLE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const PUNCHY = 'cubic-bezier(0.22, 1.8, 0.36, 1)';
const SPRING_SOFT = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

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
   Animated element helper (Web Animations API)
   ─────────────────────────────────────────── */
function animateElement(el, keyframes, options) {
  if (!el) return null;
  if (prefersReducedMotion()) {
    const last = keyframes[keyframes.length - 1];
    Object.assign(el.style, last);
    return null;
  }
  return el.animate(keyframes, { fill: 'forwards', ...options });
}

/* ═══════════════════════════════════════════
   HERO IMAGE with blur dissolve
   ═══════════════════════════════════════════ */
function HeroImage() {
  return (
    <div className="relative w-full" style={{ height: 268, overflow: 'hidden' }}>
      <img
        src="/hero-leaderboard.webp"
        alt=""
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   COUNTDOWN ROW
   ═══════════════════════════════════════════ */
function CountdownRow({ text, dotColor = '#22c55e', muted = false }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: muted ? dotColor : dotColor,
          flexShrink: 0,
        }}
      />
      <p
        className="text-sm font-medium leading-5"
        style={{
          color: PRIMARY_TEXT,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {text}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STATUS BANNER (e.g. "All qualifiers met")
   ═══════════════════════════════════════════ */
function StatusBanner({ children }) {
  return (
    <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: CONTAINER_BG }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PRIMARY_TEXT} strokeWidth="2.5">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
      <span className="text-[13px] font-semibold" style={{ color: PRIMARY_TEXT }}>
        {children}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DISMISSED EMPTY STATE
   Shown after the player dismisses the Ended-No-Prize card.
   ═══════════════════════════════════════════ */
function DismissedEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center rounded-xl"
      style={{
        background: '#fff',
        border: '1px solid #e4e4e7',
        padding: '40px 24px',
        gap: 12,
      }}
      role="status"
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{ background: '#f4f4f5', width: 48, height: 48 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <p className="text-[16px] font-semibold leading-6" style={{ color: '#18181b' }}>
        You&rsquo;re all caught up
      </p>
      <p className="text-[14px] font-normal leading-5" style={{ color: '#71717a', maxWidth: 280 }}>
        No active promotions right now. We&rsquo;ll let you know when something new is on.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   QUALIFIERS-MET BANNER
   Saved for a future "qualifiers met" milestone screen.
   ═══════════════════════════════════════════ */
function QualifiersMetBanner() {
  return (
    <div className="flex items-start gap-2 p-4 rounded-[10px]" style={{ background: CONTAINER_BG }}>
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{ background: BADGE_BG }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-[16px] font-semibold leading-6" style={{ color: PRIMARY_TEXT }}>
        All qualifiers met
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TERMS LINK (white-on-dark)
   ═══════════════════════════════════════════ */
function TermsLinkOrange() {
  return (
    <div className="flex items-center justify-center px-4 py-4">
      <a
        href="#terms"
        className="text-[14px] font-semibold underline"
        style={{
          color: '#FAFAFA',
          cursor: 'pointer',
          lineHeight: '20px',
          outline: 'none',
          borderRadius: 4,
        }}
        onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.5)'}
        onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
        aria-label="View promotion terms and conditions"
      >
        Promo terms
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DIVIDER (white-on-dark)
   ═══════════════════════════════════════════ */
function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', margin: '0 16px' }} />;
}

/* ═══════════════════════════════════════════
   ANIMATED OPT-IN ROW (checkmark with spring)
   ═══════════════════════════════════════════ */
function AnimatedOptInRow({ delay = 0 }) {
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
        style={{ background: CHECK_CIRCLE_BG, transform: 'scale(0)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="3">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-bold leading-5" style={{ color: PRIMARY_TEXT }}>Opt in</p>
        <p className="text-[12px] leading-4 mt-0.5" style={{ color: SECONDARY_TEXT, fontWeight: 600 }}>Complete</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED PROGRESS ROW (SVG ring + action button)
   ═══════════════════════════════════════════ */
function AnimatedProgressRow({ progress = 0, delay = 0, label, hint, action, onAction, done = false }) {
  const rowRef = useRef(null);
  const circleContainerRef = useRef(null);
  const circleRef = useRef(null);
  const prevDoneRef = useRef(done);
  const [showCheck, setShowCheck] = useState(done);
  const r = 13;
  const circumference = 2 * Math.PI * r;
  const targetOffset = circumference - (progress / 100) * circumference;

  // Detect transition from not-done to done and animate it
  useEffect(() => {
    if (done && !prevDoneRef.current) {
      const container = circleContainerRef.current;
      if (container && !prefersReducedMotion()) {
        // Scale down the ring
        animateElement(container, [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0)', opacity: 0 },
        ], { duration: 200, easing: SETTLE });

        // After ring shrinks, swap to checkmark and spring in
        setTimeout(() => {
          setShowCheck(true);
          requestAnimationFrame(() => {
            animateElement(container, [
              { transform: 'scale(0)', opacity: 0 },
              { transform: 'scale(1.2)', opacity: 1, offset: 0.6 },
              { transform: 'scale(0.95)', opacity: 1, offset: 0.8 },
              { transform: 'scale(1)', opacity: 1 },
            ], { duration: 350, easing: 'linear' });
          });
        }, 220);
      } else {
        setShowCheck(true);
      }
    }
    prevDoneRef.current = done;
  }, [done]);

  // Initial entrance animation (on mount)
  useEffect(() => {
    const row = rowRef.current;
    const circleContainer = circleContainerRef.current;
    if (!row || !circleContainer) return;

    if (prefersReducedMotion()) {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
      circleContainer.style.transform = 'scale(1)';
      circleContainer.style.opacity = '1';
      if (!showCheck && circleRef.current) circleRef.current.style.strokeDashoffset = String(targetOffset);
      return;
    }

    row.style.opacity = '0';
    row.style.transform = 'translateY(6px)';
    circleContainer.style.transform = 'scale(0)';
    circleContainer.style.opacity = '0';
    if (!showCheck && circleRef.current) circleRef.current.style.strokeDashoffset = String(circumference);

    const t1 = setTimeout(() => {
      animateElement(row, [
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 300, easing: SETTLE });

      animateElement(circleContainer, [
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'scale(1.2)', opacity: 1, offset: 0.6 },
        { transform: 'scale(0.95)', opacity: 1, offset: 0.8 },
        { transform: 'scale(1)', opacity: 1 },
      ], { duration: showCheck ? 350 : 500, easing: 'linear', delay: 80 });

      if (!showCheck && circleRef.current) {
        circleRef.current.animate([
          { strokeDashoffset: circumference },
          { strokeDashoffset: targetOffset },
        ], { duration: 600, easing: SETTLE, fill: 'forwards', delay: 130 });
      }
    }, delay);

    return () => clearTimeout(t1);
  }, []);

  // Update stroke when progress changes (but not on mount)
  useEffect(() => {
    if (!showCheck && circleRef.current && prevDoneRef.current === done) {
      circleRef.current.animate([
        { strokeDashoffset: circleRef.current.style.strokeDashoffset || String(circumference) },
        { strokeDashoffset: targetOffset },
      ], { duration: 400, easing: SETTLE, fill: 'forwards' });
    }
  }, [targetOffset]);

  return (
    <div ref={rowRef} className="flex items-center gap-3 py-3" style={{ opacity: 0, transform: 'translateY(6px)' }}>
      <div
        ref={circleContainerRef}
        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{
          transform: 'scale(0)', opacity: 0,
          background: showCheck ? CHECK_CIRCLE_BG : 'transparent',
          transition: 'background 0.2s ease',
        }}
      >
        {showCheck ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="16" cy="16" r={r} fill="none" stroke={RING_TRACK} strokeWidth="2.5" />
            <circle
              ref={circleRef}
              cx="16" cy="16" r={r} fill="none"
              stroke="#FAFAFA"
              strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
            />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold leading-5" style={{ color: PRIMARY_TEXT }}>{label}</p>
        <p className="text-[12px] leading-4 mt-0.5" style={{ color: SECONDARY_TEXT, fontWeight: showCheck ? 600 : 500 }}>
          {showCheck ? 'Complete' : hint}
        </p>
      </div>

      <AnimatePresence>
        {!showCheck && action && (
          <motion.button
            key="action-btn"
            onClick={onAction}
            whileTap={{ scale: 0.9 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="shrink-0 flex items-center justify-center rounded-lg cursor-pointer border-none"
            style={{
              background: 'rgba(9,9,11,0.25)',
              width: 44,
              height: 44,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {action === 'Deposit' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2" strokeLinejoin="round">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
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
      ], { duration: 300, easing: SETTLE });
    }, delay);

    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div ref={ref} style={{ opacity: 0, transform: 'translateY(12px)' }}>
      {children}
    </div>
  );
}

// Celebration entrance — scale-pop with overshoot easing.
// Used for the "hero" position card on Qualified / Ended-Won states so it feels
// rewarding instead of static. EndedNotWon uses AnimatedReveal (no scale-pop).
function AnimatedPodium({ delay = 0, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    el.style.opacity = '0';
    el.style.transform = 'scale(0.88) translateY(8px)';

    const t = setTimeout(() => {
      animateElement(el, [
        { opacity: 0, transform: 'scale(0.88) translateY(8px)' },
        { opacity: 1, transform: 'scale(1) translateY(0)' },
      ], {
        duration: 560,
        // Slight overshoot — feels like the card lands with weight.
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      });
    }, delay);

    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div ref={ref} style={{ opacity: 0, transform: 'scale(0.88) translateY(8px)', transformOrigin: 'center' }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   OPT-OUT CONFIRMATION DIALOG
   (centered white dialog over card, blurred backdrop)
   ═══════════════════════════════════════════ */
function OptOutDialog({ open, onStay, onWithdraw }) {
  const sheetRef = useRef(null);
  const dragY = useMotionValue(0);
  const sheetOpacity = useTransform(dragY, [0, 200], [1, 0.5]);
  const scrimOpacity = useTransform(dragY, [0, 200], [0.5, 0]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onStay(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onStay]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  useEffect(() => {
    if (!open || !sheetRef.current) return;
    const focusable = sheetRef.current.querySelectorAll('button');
    if (focusable.length) focusable[0].focus();
  }, [open]);

  const handleDragEnd = useCallback((_, info) => {
    if (info.offset.y > 80 || info.velocity.y > 300) {
      dragY.jump(0);
      onStay();
    } else {
      animate(dragY, 0, { type: 'spring', damping: 30, stiffness: 300 });
    }
  }, [onStay, dragY]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            onClick={onStay}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#18181b',
              opacity: scrimOpacity,
              zIndex: 100,
            }}
          />

          {/* Bottom sheet */}
          <motion.div
            ref={sheetRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="optout-title"
            className="fixed left-0 right-0 bottom-0"
            style={{
              zIndex: 101,
              maxWidth: 430,
              margin: '0 auto',
              opacity: sheetOpacity,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%', transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDrag={(_, info) => dragY.set(Math.max(0, info.offset.y))}
            onDragEnd={handleDragEnd}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: '16px 16px 0 0',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
                paddingBottom: 'env(safe-area-inset-bottom, 8px)',
              }}
            >
              {/* Header — title + close X horizontally aligned */}
              <div className="flex items-center gap-3 pt-5 px-4 pb-4">
                <h3
                  id="optout-title"
                  className="flex-1 text-[18px] font-bold leading-[26px]"
                  style={{ color: '#18181b' }}
                >
                  Opt out of this promotion?
                </h3>
                <motion.button
                  onClick={onStay}
                  whileHover={{ background: '#E4E4E7' }}
                  whileTap={{ background: '#D4D4D8' }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center cursor-pointer border-none shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9999,
                    background: '#f4f4f5',
                    transition: 'background 0.15s ease',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Body */}
              <div className="px-4 pb-2">
                <p className="text-[14px] font-normal leading-5" style={{ color: '#52525b' }}>
                  You'll be removed from this promotion. You can opt back in any time
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 px-4 pt-5 pb-4">
                <motion.button
                  onClick={onStay}
                  whileTap={{ background: '#1D4ED8' }}
                  whileHover={{ background: '#1D4ED8' }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center w-full text-[16px] font-semibold cursor-pointer border-none"
                  style={{
                    background: '#2563eb',
                    color: '#FAFAFA',
                    height: 48,
                    lineHeight: '24px',
                    borderRadius: 8,
                    transition: 'background 0.15s ease',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Stay in promotion
                </motion.button>
                <motion.button
                  onClick={onWithdraw}
                  whileHover={{ background: '#FEE2E2' }}
                  whileTap={{ background: '#FECACA' }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center w-full text-[16px] font-semibold cursor-pointer border-none"
                  style={{
                    background: '#FEF2F2',
                    color: '#991b1b',
                    height: 48,
                    lineHeight: '24px',
                    borderRadius: 8,
                    transition: 'background 0.15s ease',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Opt out
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   REWARDS (orange card variant)
   ═══════════════════════════════════════════ */
function RewardsOrange({ status = 'locked', claimAction, onClaim }) {
  const isLocked = status === 'locked';
  const isUnlocked = status === 'unlocked';
  const isClaim = status === 'claim';

  const badgeLabel = isLocked ? 'Locked' : isUnlocked ? 'Unlocked' : isClaim ? 'Won' : 'Locked';

  return (
    <div className="px-4 pt-4 pb-4">
      <p className="text-sm font-bold leading-5 mb-2.5" style={{ color: SECONDARY_TEXT }}>
        Rewards
      </p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
          <img src="/cash-icon.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold leading-5" style={{ color: PRIMARY_TEXT }}>
            Cash & Free Spins Prizes!
          </p>
          {isLocked && (
            <p className="text-[11px] font-normal leading-4 mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Based on your final leaderboard position
            </p>
          )}
        </div>
        {!isClaim && (
          <div
            className="shrink-0 rounded-md px-2 py-0.5 flex items-center"
            style={{
              background: BADGE_BG,
              color: SECONDARY_TEXT,
              height: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {badgeLabel}
          </div>
        )}
        {isClaim && (
          <motion.button
            onClick={onClaim}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 rounded-lg text-[13px] font-bold cursor-pointer"
            style={{
              background: '#16a34a',
              color: '#FAFAFA',
              border: 'none',
              height: 32,
              paddingLeft: 12,
              paddingRight: 12,
              minHeight: 44,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Claim
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REWARDS for ended-not-won
   ═══════════════════════════════════════════ */
function RewardsNoPrize() {
  return (
    <div className="px-4 pt-4 pb-4">
      <p className="text-sm font-bold leading-5 mb-2.5" style={{ color: SECONDARY_TEXT }}>
        Rewards
      </p>
      <div className="flex items-center gap-3">
        <p className="flex-1 text-[14px] font-semibold leading-5" style={{ color: PRIMARY_TEXT }}>
          Top 300 received prizes
        </p>
        <div
          className="shrink-0 rounded-md px-2 py-0.5 flex items-center"
          style={{
            background: BADGE_BG,
            color: SECONDARY_TEXT,
            height: 20,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          No reward
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   VIEW LEADERBOARD LINK
   ═══════════════════════════════════════════ */
function ViewLeaderboardLink({ onViewLeaderboard }) {
  return (
    <div className="px-4 pb-4">
      <motion.button
        onClick={onViewLeaderboard}
        whileTap={{ scale: 0.97 }}
        className="flex w-full items-center justify-center gap-2 rounded-lg text-[16px] font-semibold cursor-pointer border-none"
        style={{
          background: '#FAFAFA',
          color: '#18181b',
          height: 48,
          lineHeight: '24px',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        View leaderboard
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2.5">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </motion.button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STATE: PRE OPT-IN
   Hero + description + Opt in button + countdown + Promo terms
   ═══════════════════════════════════════════ */
function PreOptInState({ onOptIn }) {
  return (
    <>
      {/* Hero image — uses aspect-ratio sizing so the container height tracks the
          image's natural 1340:1000 ratio. This guarantees the full image (including
          the right-side roundel) is visible on every viewport width without cropping.
          - overflow-hidden + display:block + vertical-align:top kills the sub-pixel
            baseline gap that browsers render under inline images.
          - container bg matches the orange section below so any rounding gap blends in. */}
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{
          aspectRatio: '1340 / 1000',
          background: BRAND_ORANGE,
          lineHeight: 0,
          fontSize: 0,
        }}
      >
        <img
          src="/hero-leaderboard.webp"
          alt=""
          aria-hidden="true"
          className="block w-full h-full max-w-none object-contain pointer-events-none"
          style={{
            display: 'block',
            verticalAlign: 'top',
            border: 'none',
            margin: 0,
            padding: 0,
          }}
        />
      </div>

      {/* Title + description + terms — all on orange.
          marginTop: -1 makes this section overlap the hero by 1px so any
          subpixel rounding gap (where the white OrangeCard wrapper would
          otherwise peek through as a thin line above the title) is hidden. */}
      <div
        className="p-4 flex flex-col gap-2"
        style={{
          background: BRAND_ORANGE,
          color: PRIMARY_TEXT,
          border: 'none',
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          borderTopStyle: 'none',
          marginTop: -1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p className="text-[20px] font-bold leading-[30px]">Giddy up for Cash &amp; Free Spins!</p>

        {/* Description block + divider + terms */}
        <div className="flex flex-col gap-3">
          {/* Marketing description — 14px/20px regular with bold emphasis */}
          <p className="text-[14px] font-normal leading-5" style={{ color: PRIMARY_TEXT }}>
            Gee up for the <strong className="font-bold">Royal Ascot</strong> with a course of{' '}
            <strong className="font-bold">Cash</strong> or <strong className="font-bold">Free Spins</strong>{' '}
            up for grabs right out of the gate in our daily{' '}
            <strong className="font-bold">Giddy Up Leaderboards</strong>. Score your way to a share of a marvelous{' '}
            <strong className="font-bold">daily £1K Prize Pool</strong> simply by playing your favourite{' '}
            <strong className="font-bold">Pragmatic Play slots</strong>, with selected games scoring double points!
          </p>

          {/* Thin divider between description and legal terms */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.20)' }} />

          {/* Legal terms — 12px/16px regular */}
          <p className="text-[12px] font-normal leading-4" style={{ color: PRIMARY_TEXT }}>
            Claim (max. 1) within 72h of issue. No deposit required. Free Spins awarded (£0.20/spin) on Book of the full Moon. Use within 4 days of claim &amp; 10x wagering fulfilled within 7 days. £1,000 max. redemption on winnings. Game eligibility &amp; contributions vary. £0.10 to £5 bet range.
          </p>
        </div>
      </div>

      {/* Opt in button */}
      <div className="px-4 pb-4" style={{ background: BRAND_ORANGE }}>
        <motion.button
          onClick={onOptIn}
          whileTap={{ scale: 0.96 }}
          className="w-full rounded-lg text-[16px] font-semibold border-none flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.25)',
            color: PRIMARY_TEXT,
            padding: '12px 18px',
            lineHeight: '24px',
            cursor: 'pointer',
          }}
        >
          Opt in
        </motion.button>
      </div>

      {/* Footer: countdown + promo terms side by side */}
      <div className="flex items-start justify-between p-4" style={{ background: BRAND_ORANGE, color: PRIMARY_TEXT }}>
        <p className="text-[14px] leading-5">
          <strong className="font-bold">18 hours</strong>{' '}
          <span className="font-medium">left to opt in</span>
        </p>
        <a
          href="#terms"
          className="text-[14px] font-bold leading-5 underline shrink-0"
          style={{ color: PRIMARY_TEXT }}
          aria-label="View promotion terms and conditions"
        >
          Promo terms
        </a>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   STATE: QUALIFYING (pre-qualified)
   Hero + countdown + Qualifiers + Rewards(locked) + Withdraw + Terms
   ═══════════════════════════════════════════ */
function QualifyingState({ deposit, play, onDeposit, onPlay, onWithdraw }) {
  const [showOptOut, setShowOptOut] = useState(false);

  const OPT_IN_DELAY = 0;
  const DEPOSIT_DELAY = 150;
  const PLAY_DELAY = 300;
  const REWARDS_DELAY = 450;

  const depositProgress = Math.min(100, (deposit / 20) * 100);
  const playProgress = Math.min(100, (play / 50) * 100);

  return (
    <>
      <HeroImage />
      <CountdownRow text={<><strong>14h 42m</strong> left to qualify</>} dotColor="#22c55e" />

      {/* Qualifiers section */}
      <div className="px-4 pt-2 pb-2">
        <p className="text-sm font-bold leading-5 mb-1" style={{ color: SECONDARY_TEXT }}>
          Qualifiers
        </p>

        {/* Opt-in row */}
        <AnimatedOptInRow delay={OPT_IN_DELAY} />

        {/* Deposit progress */}
        <AnimatedProgressRow
          delay={DEPOSIT_DELAY}
          progress={depositProgress}
          label="Deposit"
          hint={`£${deposit} of £20`}
          action={deposit < 20 ? 'Deposit' : undefined}
          onAction={onDeposit}
          done={deposit >= 20}
        />

        {/* Play progress */}
        <AnimatedProgressRow
          delay={PLAY_DELAY}
          progress={playProgress}
          label="Play"
          hint={`£${play} of £50`}
          action={play < 50 ? 'Play now' : undefined}
          onAction={onPlay}
          done={play >= 50}
        />
      </div>

      {/* Encouragement line — sits between qualifiers and rewards (Figma 16588:1899) */}
      <AnimatedReveal delay={REWARDS_DELAY}>
        <p className="text-[14px] font-normal leading-5 px-4 pt-4 w-full" style={{ color: PRIMARY_TEXT, maxWidth: 'none' }}>
          To appear in the rankings, you must qualify first. Your play will still contribute to the leaderboard whilst qualifying.
        </p>
      </AnimatedReveal>

      {/* Rewards — card style with lock icon */}
      <AnimatedReveal delay={REWARDS_DELAY}>
        <div className="px-4 pt-4 pb-4">
          <p className="text-sm font-bold leading-5 mb-4" style={{ color: PRIMARY_TEXT }}>
            Rewards
          </p>
          <div className="flex items-center gap-3 py-3 rounded-lg">
            <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
              <img src="/cash-icon.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold leading-5" style={{ color: PRIMARY_TEXT }}>
                Cash & Free Spins Prizes!
              </p>
              <p className="text-[12px] font-normal leading-4" style={{ color: PRIMARY_TEXT }}>
                Based on your final leaderboard position
              </p>
            </div>
            <div
              className="flex items-center justify-center shrink-0 rounded-lg"
              style={{
                background: 'transparent',
                border: '2px solid rgba(0, 0, 0, 0.25)',
                width: 44,
                height: 44,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
          </div>
        </div>
      </AnimatedReveal>

      <AnimatedReveal delay={650}>
        <Divider />
        <TermsLinkOrange />
      </AnimatedReveal>

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
   STATE: QUALIFIED (just-qualified / ongoing-in-prizes)
   Hero + countdown + StatusBanner + Position block + Rewards + Leaderboard + Terms
   ═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   STATE: LOADING (skeleton)
   Shows after qualifying while position is being calculated
   ═══════════════════════════════════════════ */
function LoadingState() {
  return (
    <>
      <HeroImage />

      <div className="flex flex-col gap-5 px-4 py-4">
        {/* All qualifiers met banner */}
        <QualifiersMetBanner />

        {/* Loading position card */}
        <div
          className="flex flex-col gap-2 rounded-lg p-3"
          style={{ background: 'rgba(0,0,0,0.12)' }}
          role="status"
          aria-live="polite"
          aria-label="Counting you in. We're working out where you rank against everyone else who's qualified. This can take up to a minute."
        >
          <p
            className="text-[12px] font-semibold leading-4 uppercase"
            style={{ color: PRIMARY_TEXT, letterSpacing: '0.24px' }}
          >
            Your position
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <svg
                className="animate-spin"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FAFAFA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <p className="text-[14px] font-bold leading-5" style={{ color: PRIMARY_TEXT }}>
                Counting you in...
              </p>
            </div>
            <p className="text-[14px] font-normal leading-5" style={{ color: PRIMARY_TEXT }}>
              We&rsquo;re working out where you rank against everyone else who&rsquo;s qualified. This can take up to a minute.
            </p>
          </div>
        </div>
      </div>

      {/* Play here button (disabled during loading) */}
      <div className="px-4 pb-4">
        <button
          disabled
          aria-disabled="true"
          className="flex w-full items-center justify-center rounded-lg text-[16px] font-semibold border-none"
          style={{
            background: 'rgba(0,0,0,0.25)',
            color: PRIMARY_TEXT,
            height: 48,
            lineHeight: '24px',
            cursor: 'not-allowed',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Play here
        </button>
      </div>

      {/* Rewards — card with lock */}
      <div className="flex flex-col gap-4 px-4 pb-4">
        <p className="text-[14px] font-bold leading-5" style={{ color: PRIMARY_TEXT }}>
          Rewards
        </p>
        <div className="flex items-center gap-3 py-3 rounded-lg">
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
            <img src="/cash-icon.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold leading-5" style={{ color: PRIMARY_TEXT }}>
              Cash & Free Spins Prizes!
            </p>
            <p className="text-[12px] font-normal leading-4" style={{ color: PRIMARY_TEXT }}>
              Keep in the top 400 to get a prize!
            </p>
          </div>
          <div
            className="flex items-center justify-center shrink-0 rounded-lg"
            style={{
              background: 'transparent',
              border: '2px solid rgba(0, 0, 0, 0.25)',
              width: 44,
              height: 44,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        </div>
      </div>

      <Divider />
      <TermsLinkOrange />
    </>
  );
}

function QualifiedState({ rank, score, onPlayGame, onViewLeaderboard }) {
  const suffix = getOrdinalSuffix(rank);
  const PRIZE_THRESHOLD = 400;

  return (
    <>
      <HeroImage />
      <CountdownRow text={<>Leaderboard ends in <strong>14h 42m</strong></>} dotColor="#22c55e" />

      {/* Content — Position block, white-bordered card with sparkles */}
      <AnimatedPodium delay={0}>
      <div className="px-4 py-4">
        <div
          className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-4"
          style={{ border: '2px solid #FAFAFA' }}
        >
          {/* Sparkles illustration — top-right. Matches Figma 16725:2049 exactly:
              124x100 overflow-clip container, with the inner img scaled to
              132.28% × 117.86% and offset -6.93% left, -9.52% top so the sparkles
              fill (and slightly overflow) the box. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute overflow-hidden"
            style={{ top: 16, right: 16, width: 124, height: 100 }}
          >
            <img
              src="/qualified-sparkles.png"
              alt=""
              className="absolute"
              style={{
                left: '-6.93%',
                top: '-9.52%',
                width: '132.28%',
                height: '117.86%',
                maxWidth: 'none',
              }}
            />
          </div>

          {/* Title: label + rank */}
          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-semibold leading-4 uppercase" style={{ color: PRIMARY_TEXT, letterSpacing: '0.24px' }}>
              Your position
            </p>
            <div className="flex items-baseline">
              <span
                className="text-[48px] font-extrabold leading-[48px]"
                style={{ color: PRIMARY_TEXT, fontVariantNumeric: 'tabular-nums' }}
              >
                {rank}
              </span>
              <span className="text-[20px] font-bold leading-[30px]" style={{ color: PRIMARY_TEXT }}>
                {suffix}
              </span>
            </div>
          </div>

          {/* Stats: badges + last updated */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-1 flex-wrap">
              <div
                className="inline-flex items-center rounded-md px-2 py-0.5"
                style={{ background: 'rgba(0,0,0,0.5)', height: 20 }}
              >
                <span className="text-[12px] font-semibold leading-4" style={{ color: PRIMARY_TEXT, fontVariantNumeric: 'tabular-nums' }}>
                  {score.toLocaleString()} pts
                </span>
              </div>
            </div>

            {/* Last updated */}
            <div className="flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-[12px] font-normal leading-4" style={{ color: PRIMARY_TEXT }}>
                Last updated just now
              </span>
            </div>
          </div>
        </div>
      </div>
      </AnimatedPodium>

      {/* Actions */}
      <AnimatedReveal delay={200}>
      <div className="flex flex-col gap-3 px-4 pt-6 pb-6">
        <motion.button
          onClick={onPlayGame}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center rounded-lg text-[16px] font-semibold cursor-pointer border-none"
          style={{
            background: 'rgba(0,0,0,0.25)',
            color: PRIMARY_TEXT,
            height: 48,
            lineHeight: '24px',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Play here
        </motion.button>

        <motion.button
          onClick={onViewLeaderboard}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-lg text-[16px] font-semibold cursor-pointer border-none bg-transparent"
          style={{
            color: '#FAFAFA',
            height: 48,
            lineHeight: '24px',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          View leaderboard
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2.5">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </motion.button>
      </div>
      </AnimatedReveal>

      {/* Rewards — card with lock */}
      <AnimatedReveal delay={400}>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <p className="text-[14px] font-bold leading-5" style={{ color: PRIMARY_TEXT }}>
          Rewards
        </p>
        <div className="flex items-center gap-3 py-3 rounded-lg">
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
            <img src="/cash-icon.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold leading-5" style={{ color: PRIMARY_TEXT }}>
              Cash & Free Spins Prizes!
            </p>
            <p className="text-[12px] font-normal leading-4" style={{ color: PRIMARY_TEXT }}>
              Keep in the top {PRIZE_THRESHOLD} to get a prize!
            </p>
          </div>
          <div
            className="flex items-center justify-center shrink-0 rounded-lg"
            style={{
              background: 'transparent',
              border: '2px solid rgba(0, 0, 0, 0.25)',
              width: 44,
              height: 44,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        </div>
      </div>
      </AnimatedReveal>

      <AnimatedReveal delay={550}>
      <Divider />
      <TermsLinkOrange />
      </AnimatedReveal>
    </>
  );
}

/* ═══════════════════════════════════════════
   STATE: ENDED WON
   Hero + countdown(muted) + Prize block + Rewards with Claim + Leaderboard + Terms
   Podium visuals vary by rank (1st = gold, 2nd = blue, ...)
   ═══════════════════════════════════════════ */
const WON_PODIUM_VARIANTS = {
  1: {
    gradient: 'linear-gradient(180deg, #fde68a 0%, #f59e0b 100%)',
    fg: '#78350f',
    badgeBg: '#78350f',
    image: '/won-confetti.png',
    imageW: 74,
    imageH: 77,
    direction: 'ahead',
    comparedTo: '2nd',
  },
  2: {
    gradient: 'linear-gradient(180deg, #bae6fd 0%, #38bdf8 100%)',
    fg: '#1e3a8a',
    badgeBg: '#1e3a8a',
    image: '/won-2nd-confetti.png',
    imageW: 83,
    imageH: 77,
    direction: 'behind',
    comparedTo: '1st',
  },
  3: {
    gradient: 'linear-gradient(180deg, #ebe8ff 0%, #7e51ff 100%)',
    fg: '#270a6b',
    badgeBg: '#270a6b',
    // Figma 16588:3440 → asset img3rdPlaceIcon1 (magic wand with sparkles)
    // positioned top:8, right:-16 (extends 16px past the card edge), w:136, h:99.
    image: '/won-3rd-wand.png',
    imageW: 136,
    imageH: 99,
    imageTop: 8,
    imageRight: -16,
    direction: 'behind',
    comparedTo: '1st',
  },
};

function EndedWonState({ rank, score, onViewLeaderboard }) {
  const suffix = getOrdinalSuffix(rank);
  const variant = WON_PODIUM_VARIANTS[rank] || WON_PODIUM_VARIANTS[1];

  return (
    <>
      <HeroImage />
      <CountdownRow text={<>Ended · <strong>2</strong> rewards to claim</>} muted dotColor="rgba(250,250,250,0.4)" />

      {/* Position block — gradient card, white border, confetti */}
      <AnimatedPodium delay={0}>
      <div className="px-4 py-4">
        <div
          className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-4"
          style={{
            background: variant.gradient,
            border: '2px solid #FAFAFA',
          }}
        >
          {/* Illustration — top-right. Per-variant top offset (3rd uses top:8 per Figma).
              Omitted entirely on variants without an image. */}
          {variant.image && (
            <img
              src={variant.image}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{
                top: variant.imageTop ?? 16,
                right: variant.imageRight ?? 16,
                width: variant.imageW,
                height: variant.imageH,
                objectFit: 'cover',
              }}
            />
          )}

          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-semibold leading-4 uppercase" style={{ color: variant.fg, letterSpacing: '0.24px' }}>
              Your position
            </p>
            <div className="flex items-baseline">
              <span
                className="text-[48px] font-extrabold leading-[48px]"
                style={{ color: variant.fg, fontVariantNumeric: 'tabular-nums' }}
              >
                {rank}
              </span>
              <span className="text-[20px] font-bold leading-[30px]" style={{ color: variant.fg }}>
                {suffix}
              </span>
            </div>
          </div>

          {/* Stats badges — dark accent on gradient */}
          <div className="flex gap-1 flex-wrap">
            <div
              className="inline-flex items-center rounded-md px-2 py-0.5"
              style={{ background: variant.badgeBg, height: 20 }}
            >
              <span className="text-[12px] font-semibold leading-4" style={{ color: PRIMARY_TEXT, fontVariantNumeric: 'tabular-nums' }}>
                {score.toLocaleString()} pts
              </span>
            </div>
          </div>
        </div>
      </div>
      </AnimatedPodium>

      {/* Rewards — two cards with Claim buttons */}
      <div className="flex flex-col gap-4 px-4 pb-4">
        <AnimatedReveal delay={250}>
        <p className="text-[14px] font-bold leading-5" style={{ color: PRIMARY_TEXT }}>
          Rewards
        </p>
        </AnimatedReveal>

        {/* Cash prize card */}
        <AnimatedReveal delay={350}>
        <div className="flex items-center gap-3 py-3 rounded-lg">
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
            <img src="/cash-icon.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold leading-5" style={{ color: PRIMARY_TEXT }}>
              £10 Cash prize
            </p>
            <p className="text-[12px] font-normal leading-4" style={{ color: PRIMARY_TEXT }}>
              6 hrs and 40 mins left to claim
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="shrink-0 flex items-center justify-center rounded-lg text-[16px] font-semibold cursor-pointer"
            style={{
              background: 'rgba(0,0,0,0.25)',
              color: PRIMARY_TEXT,
              border: 'none',
              height: 44,
              paddingLeft: 16,
              paddingRight: 16,
              WebkitTapHighlightColor: 'transparent',
              boxShadow: '0 1px 2px 0 rgba(10,13,18,0.05)',
            }}
          >
            Claim
          </motion.button>
        </div>
        </AnimatedReveal>

        {/* Free spins card */}
        <AnimatedReveal delay={450}>
        <div className="flex items-center gap-3 py-3 rounded-lg">
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
            <img src="/game-icon-spins.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold leading-5" style={{ color: PRIMARY_TEXT }}>
              10 free spins
            </p>
            <p className="text-[12px] font-normal leading-4" style={{ color: PRIMARY_TEXT }}>
              7 hrs and 32 mins left to claim
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="shrink-0 flex items-center justify-center rounded-lg text-[16px] font-semibold cursor-pointer"
            style={{
              background: 'rgba(0,0,0,0.25)',
              color: PRIMARY_TEXT,
              border: 'none',
              height: 44,
              paddingLeft: 16,
              paddingRight: 16,
              WebkitTapHighlightColor: 'transparent',
              boxShadow: '0 1px 2px 0 rgba(10,13,18,0.05)',
            }}
          >
            Claim
          </motion.button>
        </div>
        </AnimatedReveal>
      </div>

      {/* View final results */}
      <AnimatedReveal delay={600}>
      <div className="px-4 pb-4">
        <motion.button
          onClick={onViewLeaderboard}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-lg text-[16px] font-semibold cursor-pointer border-none bg-transparent"
          style={{
            color: '#FAFAFA',
            height: 48,
            lineHeight: '24px',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          View final results
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2.5">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </motion.button>
      </div>
      </AnimatedReveal>

      <AnimatedReveal delay={750}>
      <Divider />
      <TermsLinkOrange />
      </AnimatedReveal>
    </>
  );
}

/* ═══════════════════════════════════════════
   STATE: ENDED NOT WON
   Hero + countdown(muted) + Position block + Rewards(no prize) + Leaderboard + Terms
   ═══════════════════════════════════════════ */
function EndedNotWonState({ rank, score, onViewLeaderboard, onDismiss }) {
  const suffix = getOrdinalSuffix(rank);

  return (
    <>
      <HeroImage />
      <CountdownRow text={<>Ended · Results available for <strong>3d 22h</strong></>} muted dotColor="rgba(250,250,250,0.4)" />

      {/* Position block — white-bordered card */}
      <AnimatedReveal delay={0}>
      <div className="px-4 py-4">
        <div
          className="flex flex-col gap-4 overflow-hidden rounded-xl p-4"
          style={{ border: '2px solid #FAFAFA' }}
        >
          <div className="flex flex-col gap-1">
            <p className="text-[12px] font-semibold leading-4 uppercase" style={{ color: PRIMARY_TEXT, letterSpacing: '0.24px' }}>
              Your position
            </p>
            <div className="flex items-baseline">
              <span
                className="text-[48px] font-extrabold leading-[48px]"
                style={{ color: PRIMARY_TEXT, fontVariantNumeric: 'tabular-nums' }}
              >
                {rank}
              </span>
              <span className="text-[20px] font-bold leading-[30px]" style={{ color: PRIMARY_TEXT }}>
                {suffix}
              </span>
            </div>
          </div>

          {/* Stats badge */}
          <div
            className="inline-flex items-center self-start rounded-md px-2 py-0.5"
            style={{ background: 'rgba(0,0,0,0.5)', height: 20 }}
          >
            <span className="text-[12px] font-semibold leading-4" style={{ color: PRIMARY_TEXT, fontVariantNumeric: 'tabular-nums' }}>
              {score} pts earned
            </span>
          </div>
        </div>
      </div>
      </AnimatedReveal>

      {/* Rewards */}
      <AnimatedReveal delay={200}>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <p className="text-[14px] font-bold leading-5" style={{ color: PRIMARY_TEXT }}>
          Rewards
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold leading-5" style={{ color: PRIMARY_TEXT }}>
              No reward
            </p>
            <p className="text-[12px] font-normal leading-4" style={{ color: PRIMARY_TEXT }}>
              Only the top 400 received prizes.
            </p>
          </div>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              background: 'transparent',
              width: 44,
              height: 44,
              borderRadius: 8,
              border: '2px solid rgba(0, 0, 0, 0.25)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        </div>
      </div>
      </AnimatedReveal>

      {/* Actions: View final results (primary) + Dismiss (secondary) */}
      <AnimatedReveal delay={350}>
      <div className="flex flex-col gap-3 px-4 py-5">
        <motion.button
          onClick={onViewLeaderboard}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-lg text-[16px] font-semibold cursor-pointer border-none"
          style={{
            background: 'rgba(0,0,0,0.25)',
            color: PRIMARY_TEXT,
            height: 48,
            lineHeight: '24px',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          View final results
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2.5">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </motion.button>

        <motion.button
          onClick={onDismiss}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center rounded-lg text-[16px] font-semibold cursor-pointer border-none bg-transparent"
          style={{
            color: PRIMARY_TEXT,
            height: 48,
            lineHeight: '24px',
            opacity: 0.9,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Dismiss
        </motion.button>
      </div>
      </AnimatedReveal>

      <AnimatedReveal delay={500}>
      <Divider />
      <TermsLinkOrange />
      </AnimatedReveal>
    </>
  );
}

/* ═══════════════════════════════════════════
   ORANGE LEADERBOARD CARD
   The primary interaction surface — all states render inline
   ═══════════════════════════════════════════ */
function OrangeCard({
  effectiveState,
  rank,
  score,
  deposit,
  play,
  onOptIn,
  onDeposit,
  onPlay,
  onPlayGame,
  onViewLeaderboard,
  onWithdraw,
  onDismiss,
}) {
  const isOptIn = effectiveState === 'opt-in';
  const isLoading = effectiveState === 'loading';
  const isQualifying = effectiveState === 'pre-qualified';
  const reachedFirst = rank === 1 && (effectiveState === 'just-qualified' || effectiveState === 'qualified' || effectiveState === 'qualified-ranked' || effectiveState === 'ongoing-in-prizes');
  const isQualified = !reachedFirst && (effectiveState === 'just-qualified' || effectiveState === 'qualified' || effectiveState === 'qualified-ranked' || effectiveState === 'ongoing-in-prizes');
  const isEndedWon = effectiveState === 'ended-won' || effectiveState === 'ended-won-2nd' || effectiveState === 'ended-won-3rd' || reachedFirst;
  const isEndedMissed = effectiveState === 'ended-missed';

  return (
    <div
      className="overflow-hidden relative"
      style={{
        borderRadius: 12,
        boxShadow: '0px 20px 24px -4px rgba(10,13,18,0.08), 0px 8px 8px -4px rgba(0,0,0,0.03), 0px 3px 3px -1.5px rgba(10,13,18,0.04)',
        background: isOptIn ? '#fff' : BRAND_ORANGE,
      }}
    >
      {isOptIn && (
        <PreOptInState onOptIn={onOptIn} />
      )}
      {isLoading && (
        <LoadingState />
      )}
      {isQualifying && (
        <QualifyingState
          deposit={deposit}
          play={play}
          onDeposit={onDeposit}
          onPlay={onPlay}
          onWithdraw={onWithdraw}
        />
      )}
      {isQualified && (
        <QualifiedState
          rank={rank}
          score={score}
          onPlayGame={onPlayGame}
          onViewLeaderboard={onViewLeaderboard}
        />
      )}
      {isEndedWon && (
        <EndedWonState
          key={`ended-won-${rank}`}
          rank={rank}
          score={score}
          onViewLeaderboard={onViewLeaderboard}
        />
      )}
      {isEndedMissed && (
        <EndedNotWonState
          rank={rank}
          score={score}
          onViewLeaderboard={onViewLeaderboard}
          onDismiss={onDismiss}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT: OptInCard
   Card list is the primary interaction surface.
   All states render inline on the card — no modal
   except the leaderboard view.
   ═══════════════════════════════════════════ */
export default function OptInCard({
  cardMode,
  effectiveState,
  isEnded,
  state,
  rank,
  score,
  deposit,
  play,
  qualifierRows,
  onOptIn,
  onDeposit,
  onPlay,
  onPlayGame,
  onViewLeaderboard,
  onClose,
  onWithdraw,
  onDismiss,
  dismissed,
}) {
  const showDismissedEmpty = dismissed && state === 'ended-missed';

  // Warm the browser cache for state-card illustrations and reward icons on mount,
  // so they're already decoded by the time a card animates in (avoids the flash
  // where the card appears, then the image pops in a frame or two later).
  useEffect(() => {
    const assets = [
      '/qualified-sparkles.png',
      '/won-confetti.png',
      '/won-2nd-confetti.png',
      '/won-3rd-wand.png',
      '/cash-icon.png',
      '/game-icon-spins.png',
    ];
    assets.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  }, []);

  return (
    <div style={{ background: '#f4f4f5' }}>
      {/* Header — white bg, back button + title */}
      <div className="flex items-center px-4" style={{ background: '#fff', paddingTop: 12, paddingBottom: 12 }}>
        <div
          className="flex h-11 w-11 items-center justify-center shrink-0 cursor-pointer rounded-full"
          style={{ background: '#f4f4f5' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
        <p className="flex-1 text-center text-[18px] font-semibold leading-7" style={{ color: '#18181b' }}>
          My Promotions
        </p>
        <div style={{ width: 44, height: 44, opacity: 0, flexShrink: 0 }} />
      </div>

      <div className="py-4 px-4 flex flex-col gap-6" style={{ paddingBottom: 80 }}>
        {showDismissedEmpty ? (
          <DismissedEmptyState />
        ) : (
          <OrangeCard
            effectiveState={effectiveState}
            rank={rank}
            score={score}
            deposit={deposit}
            play={play}
            onOptIn={onOptIn}
            onDeposit={onDeposit}
            onPlay={onPlay}
            onPlayGame={onPlayGame}
            onViewLeaderboard={onViewLeaderboard}
            onWithdraw={onWithdraw}
            onDismiss={onDismiss}
          />
        )}
      </div>
    </div>
  );
}
