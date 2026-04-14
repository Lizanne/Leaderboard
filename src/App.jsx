import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LeaderboardScreen from './components/composite/LeaderboardScreen';
import IOSStatusBar from './components/atoms/IOSStatusBar';
import OptInCard from './states/OptInCard';

const SPRING = [0.23, 1, 0.32, 1];
const pageTransition = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: SPRING } },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.3 } },
};

const STATES = ['opt-in', 'pre-qualified', 'just-qualified', 'qualified-ranked', 'ended-missed', 'ended-won'];
const STATE_LABELS = {
  'opt-in': 'Opt In',
  'pre-qualified': 'Qualifying',
  'just-qualified': 'Qualified - Unranked',
  'qualified-ranked': 'Qualified - Ranked',
  'ended-missed': 'Ended (No Prize)',
  'ended-won': 'Ended (Won)',
};

export default function App() {
  const [state, setState] = useState('opt-in');
  const [view, setView] = useState('promotions');
  const [listKey, setListKey] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [play, setPlay] = useState(0);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState(314);

  const isEnded = state === 'ended-missed' || state === 'ended-won';

  const handleDeposit = useCallback(() => setDeposit((d) => Math.min(20, d + Math.floor(Math.random() * 10) + 5)), []);
  const handlePlay = useCallback(() => setPlay((p) => Math.min(50, p + Math.floor(Math.random() * 18) + 8)), []);
  const handlePlayGame = useCallback(() => {
    setScore((s) => s + Math.floor(Math.random() * 40) + 5);
    setRank((r) => Math.max(1, r - Math.floor(Math.random() * 20)));
  }, []);
  const handleViewLeaderboard = useCallback(() => setView('leaderboard'), []);
  const handleBackFromLeaderboard = useCallback(() => {
    setView('promotions');
    setListKey((k) => k + 1);
    // Scroll to top — use setTimeout to ensure DOM has updated
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
  }, []);

  const handleOptIn = useCallback(() => {
    setState('pre-qualified');
    setDeposit(0); setPlay(0); setScore(0); setRank(314);
  }, []);

  const handleWithdraw = useCallback(() => {
    setState('opt-in');
    setDeposit(0); setPlay(0); setScore(0); setRank(314);
  }, []);

  const handleJumpState = useCallback((s) => {
    setState(s);
    setView('promotions');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
    switch (s) {
      case 'opt-in': setDeposit(0); setPlay(0); setScore(0); setRank(314); break;
      case 'pre-qualified': setDeposit(0); setPlay(0); setScore(0); setRank(314); break;
      case 'just-qualified': setDeposit(20); setPlay(50); setScore(892); setRank(412); break;
      case 'qualified-ranked': setDeposit(20); setPlay(50); setScore(1145); setRank(47); break;
      case 'ended-missed': setDeposit(20); setPlay(50); setScore(4); setRank(47); break;
      case 'ended-won': setDeposit(20); setPlay(50); setScore(1145); setRank(1); break;
    }
  }, []);

  const effectiveState = (() => {
    if (state === 'pre-qualified' && deposit >= 20 && play >= 50) return 'just-qualified';
    return state;
  })();

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--color-background)' }}>
      <div className="mx-auto w-full relative" style={{ maxWidth: 430, minHeight: '100vh', overflowX: 'clip', overflowY: 'visible' }}>
        <AnimatePresence mode="wait">
          {view === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ x: '100%', opacity: 0.6 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  x: { duration: 0.45, ease: [0.2, 0.9, 0.3, 1] },
                  opacity: { duration: 0.2, ease: 'easeOut' },
                },
              }}
              exit={{
                x: '100%',
                opacity: 0.6,
                transition: {
                  x: { duration: 0.35, ease: [0.4, 0, 0.6, 0] },
                  opacity: { duration: 0.25, ease: 'easeIn' },
                },
              }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
            >
              {/* Sticky nav bar */}
              <div className="flex items-center w-full px-4 shrink-0" style={{ background: '#fff', paddingTop: 12, paddingBottom: 12 }}>
                <div className="flex h-11 w-11 items-center justify-center shrink-0 cursor-pointer rounded-full"
                  style={{ background: '#f4f4f5' }}
                  onClick={handleBackFromLeaderboard}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </div>
                <p className="flex-1 text-center text-lg font-semibold" style={{ color: '#18181b', marginRight: 44 }}>Leaderboard</p>
              </div>
              {/* Scrollable leaderboard content */}
              <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <LeaderboardScreen />
              </div>
            </motion.div>
          )}
          {view === 'promotions' && (
            <motion.div
              key="promotions"
              initial={false}
            >
              <OptInCard
                key={listKey}
                effectiveState={effectiveState}
                isEnded={isEnded}
                state={state}
                rank={rank}
                score={score}
                deposit={deposit}
                play={play}
                onOptIn={handleOptIn}
                onDeposit={handleDeposit}
                onPlay={handlePlay}
                onPlayGame={handlePlayGame}
                onViewLeaderboard={handleViewLeaderboard}
                onWithdraw={handleWithdraw}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* State switcher */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[var(--color-border)] px-3 py-2.5 z-50">
        <div className="flex gap-1.5 overflow-x-auto max-w-[430px] mx-auto">
          {STATES.map((s) => (
            <button key={s} onClick={() => handleJumpState(s)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors"
              style={{
                background: (effectiveState === s || state === s) ? '#18181b' : '#fff',
                color: (effectiveState === s || state === s) ? '#fff' : '#71717a',
                borderColor: (effectiveState === s || state === s) ? '#18181b' : '#e4e4e7',
              }}>{STATE_LABELS[s]}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
