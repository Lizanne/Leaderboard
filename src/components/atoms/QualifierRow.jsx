import { motion } from 'motion/react';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-check)" strokeWidth="3">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ProgressRing({ progress = 0 }) {
  const r = 13;
  const circumference = 2 * Math.PI * r; // ~81.68
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width="32" height="32" viewBox="0 0 32 32"
      className="absolute inset-0"
      style={{ transform: 'rotate(-90deg)' }}
    >
      <circle cx="16" cy="16" r={r} fill="none" stroke="#e4e4e7" strokeWidth="2.5" />
      {progress > 0 && (
        <circle
          cx="16" cy="16" r={r} fill="none"
          stroke="var(--color-success-fill)"
          strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}
        />
      )}
    </svg>
  );
}

export default function QualifierRow({ step, title, hint, done = false, progress = 0, action, onAction }) {
  return (
    <div className="flex items-center gap-3 py-3 animate-row-enter">
      {/* Step circle */}
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        {done ? (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full animate-check-pop"
            style={{ background: 'var(--color-success)' }}
          >
            <CheckIcon />
          </div>
        ) : (
          <ProgressRing progress={progress} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap">
        <p className="text-[14px] font-bold leading-5" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </p>
        <p
          className="text-[12px] leading-4 mt-0.5"
          style={{
            color: 'var(--color-text-secondary)',
            fontWeight: done ? 600 : 500,
          }}
        >
          {hint}
        </p>
      </div>

      {/* Action button */}
      {!done && action && (
        <motion.button
          onClick={onAction}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="shrink-0 rounded-lg text-[14px] font-semibold cursor-pointer leading-5"
          style={{
            background: '#f4f4f5',
            color: '#18181b',
            border: 'none',
            height: 32,
            paddingLeft: 12,
            paddingRight: 12,
            minWidth: 82,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {action}
        </motion.button>
      )}
    </div>
  );
}
