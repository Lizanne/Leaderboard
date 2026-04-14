export default function UrgencyBar({ text, ended = false, endedText, endedDotGreen = false }) {
  const dotColor = ended
    ? (endedDotGreen ? '#22c55e' : 'var(--color-urgency-dot-ended)')
    : '#22c55e';

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div
        className={`h-2 w-2 rounded-full shrink-0 ${(!ended || endedDotGreen) ? 'animate-urgency-pulse' : ''}`}
        style={{ background: dotColor }}
      />
      <p className="text-[14px] font-medium leading-5" style={{ color: 'var(--color-text-secondary)' }}>
        {ended ? (endedText || 'Ended') : text}
      </p>
    </div>
  );
}
