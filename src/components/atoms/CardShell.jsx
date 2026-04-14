export default function CardShell({ children }) {
  return (
    <div
      className="overflow-hidden card-shell-hover"
      style={{
        background: 'var(--color-surface)',
        borderRadius: 12,
        boxShadow: '0px 20px 24px -4px rgba(10,13,18,0.08), 0px 8px 8px -4px rgba(0,0,0,0.03), 0px 3px 3px -1.5px rgba(10,13,18,0.04)',
      }}
    >
      {children}
    </div>
  );
}
