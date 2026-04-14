function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-check)" strokeWidth="3">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function QualifiedRow() {
  return (
    <div
      className="flex items-center gap-3 px-[var(--spacing-card-x)] py-3 animate-qualified-enter"
      style={{ background: 'var(--color-success-light)', overflow: 'hidden' }}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full animate-check-pop"
        style={{ background: 'var(--color-success)' }}
      >
        <CheckIcon />
      </div>
      <div>
        <p className="text-[var(--font-size-body)] font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Qualified
        </p>
        <p className="text-[var(--font-size-xs)] font-medium" style={{ color: 'var(--color-success-text)' }}>
          Deposit and play complete
        </p>
      </div>
    </div>
  );
}
