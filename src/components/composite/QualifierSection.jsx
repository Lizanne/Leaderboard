import QualifierRow from '../atoms/QualifierRow';

export default function QualifierSection({ rows }) {
  return (
    <div className="px-4 pt-4 pb-2">
      <p className="text-sm font-semibold leading-5 mb-1" style={{ color: 'var(--color-text-secondary)' }}>
        Qualifiers
      </p>
      {rows.map((row, i) => (
        <QualifierRow key={i} {...row} />
      ))}
    </div>
  );
}
