import { getRiskColor } from '../data/employees';

export default function RiskPill({ level, score }) {
  const c = getRiskColor(level);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {score !== undefined ? `${score} · ` : ''}{level}
    </span>
  );
}
