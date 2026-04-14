import { motion } from 'motion/react';

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function CTAButton({ label, variant = 'primary', icon, onClick, secondaryLabel, onSecondaryClick }) {
  const styles = {
    primary: { bg: 'var(--color-cta-primary)', color: 'var(--color-cta-primary-text)' },
    dark: { bg: 'var(--color-cta-dark)', color: 'var(--color-cta-dark-text)' },
  };

  const s = styles[variant] || styles.primary;
  const isPrimary = variant === 'primary';

  return (
    <div className="mt-6">
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        whileHover={{ filter: 'brightness(1.05)', y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`flex w-full min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-button)] px-5 py-3.5 text-[15px] font-bold cursor-pointer border-none ${isPrimary ? 'cta-shimmer' : ''}`}
        style={{
          background: s.bg,
          color: s.color,
          boxShadow: isPrimary ? '0 0 24px rgba(159, 232, 112, 0.25)' : undefined,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {icon === 'play' && <PlayIcon />}
        {label}
        {icon === 'chevron' && <ChevronRight />}
      </motion.button>

      {secondaryLabel && (
        <motion.button
          onClick={onSecondaryClick}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-1 mt-3 py-2 text-[var(--font-size-small)] font-semibold cursor-pointer border-none bg-transparent"
          style={{ color: 'var(--color-success-text)' }}
        >
          {secondaryLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
