export default function TermsLink() {
  return (
    <div className="text-center pt-2.5 pb-3.5 px-4" style={{ borderTop: '1px solid #e4e4e7' }}>
      <a
        href="#terms"
        className="text-xs font-semibold underline"
        style={{
          color: 'var(--color-text-primary)',
          textDecorationSkipInk: 'none',
          padding: '8px 12px',
          borderRadius: 6,
          display: 'inline-block',
          minHeight: 44,
          lineHeight: '28px',
          outline: 'none',
        }}
        onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-text-primary)'}
        onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
        aria-label="View promotion terms and conditions"
      >
        Promo terms
      </a>
    </div>
  );
}
