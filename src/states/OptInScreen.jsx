import { useRef } from 'react';
import { motion } from 'motion/react';

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

function PromoCard({ image, bgColor, title, description, terms, buttonLabel, onButton, timeText, cardRef }) {
  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-xl overflow-hidden"
      style={{
        boxShadow: '0px 20px 24px -4px rgba(10,13,18,0.08), 0px 8px 8px -4px rgba(0,0,0,0.03), 0px 3px 3px -1.5px rgba(10,13,18,0.04)',
      }}
    >
      {image && (
        <div className="relative overflow-hidden" style={{ height: 268, background: bgColor }}>
          <img src={image} alt="" className="w-full h-full object-cover absolute inset-0" />
        </div>
      )}

      <div className="p-4" style={{ background: bgColor, color: '#fff' }}>
        <p className="text-xl font-bold leading-[30px] mb-2">{title}</p>
        {description && (
          <p className="text-sm font-medium leading-5 mb-3" style={{ opacity: 0.9 }}>{description}</p>
        )}
        {terms && (
          <>
            <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <p className="text-xs leading-[18px]" style={{ opacity: 0.8 }}>{terms}</p>
          </>
        )}
      </div>

      <div className="px-4 pb-4" style={{ background: bgColor }}>
        <motion.button
          onClick={onButton}
          whileTap={{ scale: 0.96 }}
          whileHover={{ filter: 'brightness(1.05)' }}
          className="w-full py-3 rounded-lg text-base font-bold cursor-pointer border-none"
          style={{ background: 'rgba(0,0,0,0.25)', color: '#fff', minHeight: 48 }}
        >
          {buttonLabel}
        </motion.button>
      </div>

      <div className="flex justify-between items-start p-4" style={{ background: bgColor, color: '#fff' }}>
        <p className="text-sm leading-5 flex-1 pr-8">
          <strong className="font-bold">{timeText}</strong>{' '}
          <span className="font-normal">left to opt in</span>
        </p>
        <a className="text-sm font-bold underline whitespace-nowrap cursor-pointer" style={{ color: '#fff' }}>
          Promo terms
        </a>
      </div>
    </motion.div>
  );
}

export default function OptInScreen({ onOptIn }) {
  const leaderboardCardRef = useRef(null);

  const handleOptIn = () => {
    const el = leaderboardCardRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      onOptIn({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    } else {
      onOptIn(null);
    }
  };

  return (
    <motion.div
      style={{ background: '#fff' }}
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <div className="py-6 px-4 flex flex-col gap-6">
        <PromoCard
          image="/hero-purple.png"
          bgColor="#783bfa"
          title="10 Free Spins on Book of the Full Moon"
          description="It's full steam ahead as we launch an offer of astronomical proportions that eclipses all others and sticks the landing with a stellar showing of 10 Free Spins on Book of the Full Moon!"
          terms="Claim (max. 1) within 72h of issue. No deposit required. Free Spins awarded (£0.20/spin) on Book of the full Moon. Use within 4 days of claim & 10x wagering fulfilled within 7 days. £1,000 max. redemption on winnings. Game eligibility & contributions vary. £0.10 to £5 bet range."
          buttonLabel="Opt in"
          timeText="14 hrs and 47 min"
        />

        <PromoCard
          cardRef={leaderboardCardRef}
          image="/hero-image.png"
          bgColor="#c0490f"
          title="Arise with Aristocrat Leaderboard"
          terms="Opt-in required. Runs 24.02.25 at 09:00 to 05.03.25 at 08:59 (UK time). Points calculated by cash wins over cash stakes (min. £0.10) on selected Aristocrat slots. Eligibility: Min. £20 in deposits & £50 cash staked on slots. Top 200 point scorers will win prizes according to rank within Leaderboard."
          buttonLabel="Opt in"
          onButton={handleOptIn}
          timeText="18 hours"
        />
      </div>
    </motion.div>
  );
}
