export default function IOSStatusBar({ light = false }) {
  const color = light ? '#fff' : '#000';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        height: 54,
        padding: '0 24px 6px',
        background: light ? 'transparent' : 'var(--color-surface)',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* ── Time ── */}
      <div style={{ width: 54, display: 'flex', alignItems: 'center', paddingLeft: 7 }}>
        <span
          style={{
            fontSize: 17,
            letterSpacing: -0.5,
            color,
            fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          9:41
        </span>
      </div>

      {/* ── Dynamic Island / Notch ── */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: 10,
        width: 126,
        height: 37,
        borderRadius: 22,
        background: '#000',
      }} />

      {/* ── Right indicators ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingBottom: 1 }}>
        {/* Cellular — 4 bars, iOS 17 style */}
        <svg width="17" height="12" viewBox="0 0 17 12">
          <rect x="0" y="6" width="3" height="6" rx="1" fill={color} />
          <rect x="4.5" y="4" width="3" height="8" rx="1" fill={color} />
          <rect x="9" y="2" width="3" height="10" rx="1" fill={color} />
          <rect x="13.5" y="0" width="3" height="12" rx="1" fill={color} />
        </svg>

        {/* WiFi — iOS 17 icon */}
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path
            d="M8.36 10.22a1.09 1.09 0 11-2.18 0 1.09 1.09 0 012.18 0z"
            fill={color} transform="translate(0.6, 0)"
          />
          <path
            d="M3.46 7.04a6.15 6.15 0 018.08 0"
            stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none"
          />
          <path
            d="M1.16 4.5a9.35 9.35 0 0112.68 0"
            stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none"
          />
        </svg>

        {/* Battery — iOS 17 style */}
        <svg width="27" height="13" viewBox="0 0 27 13">
          {/* Outer border */}
          <rect
            x="0.5" y="0.5" width="22" height="12" rx="3.8"
            stroke={color} strokeWidth="1" fill="none" opacity="0.35"
          />
          {/* Battery cap */}
          <path
            d="M24 4.5C24.8 4.5 25 5.1 25 5.8v1.4c0 .7-.2 1.3-1 1.3"
            stroke={color} strokeWidth="1" fill="none" opacity="0.4"
          />
          {/* Fill level */}
          <rect x="2" y="2" width="19" height="9" rx="2.5" fill={color} />
        </svg>
      </div>
    </div>
  );
}
