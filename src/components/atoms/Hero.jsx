import { motion } from 'motion/react';

export default function Hero({ eyebrow, title, amount, subtitle, ended = false, won = false, bgColor, image, imageLayoutId }) {
  // Image-only mode: show the CRM image full-bleed
  if (image && !ended) {
    return (
      <motion.div layoutId={imageLayoutId} className="relative overflow-hidden">
        <img src={image} alt="" className="w-full block" style={{ display: 'block' }} />
      </motion.div>
    );
  }

  // Ended state with image
  if (image && ended) {
    return (
      <motion.div layoutId={imageLayoutId} className="relative overflow-hidden">
        <img src={image} alt="" className="w-full block" style={{ display: 'block' }} />
      </motion.div>
    );
  }

  const heroClasses = [
    'relative overflow-hidden px-[var(--spacing-card-x)] pt-[var(--spacing-card-y)] pb-5',
    !ended ? 'hero-animated' : '',
    won ? 'hero-won' : '',
    ended && !won ? 'hero-ended' : '',
  ].filter(Boolean).join(' ');

  const bgStyle = ended
    ? 'var(--color-hero-bg-ended)'
    : won
      ? 'linear-gradient(135deg, #0a2a10, #1a4a2a, #0a3a1a)'
      : (bgColor || 'var(--color-hero-bg)');

  return (
    <div
      className={heroClasses}
      style={{ background: bgStyle }}
    >
      {/* Floating gradient orbs */}
      <div className="hero-orb hero-orb--primary" />
      <div className="hero-orb hero-orb--secondary" />

      <p
        className="relative text-[var(--font-size-xxs)] font-bold uppercase tracking-[1.2px]"
        style={{ color: ended ? 'rgba(255,255,255,0.4)' : 'var(--color-hero-eyebrow)', marginBottom: 6 }}
      >
        {eyebrow}
      </p>
      <h2
        className="relative text-[var(--font-size-hero-title)] font-extrabold leading-[1.2]"
        style={{ color: 'var(--color-hero-text)', opacity: ended ? 0.7 : 1 }}
      >
        {title}
      </h2>
      <p
        className="relative text-[var(--font-size-hero-amount)] font-black mt-2"
        style={{ color: ended ? 'rgba(255,255,255,0.4)' : 'var(--color-hero-amount)' }}
      >
        {amount}
      </p>
      <p
        className="relative text-[var(--font-size-small)] mt-1"
        style={{ color: ended ? 'rgba(255,255,255,0.3)' : 'var(--color-hero-sub)' }}
      >
        {subtitle}
      </p>
    </div>
  );
}
