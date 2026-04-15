import { useState, useMemo } from 'react';
import ALL_EMPLOYEES, { STORES, getRiskColor } from '../data/employees';
import RiskPill from '../components/RiskPill';

function storeCardColor(atRiskCount) {
  if (atRiskCount === 0) return { border: '#1a5a30', bg: 'rgba(22,90,48,0.15)', badge: 'bg-green-900 text-green-400' };
  if (atRiskCount <= 3) return { border: '#7a5500', bg: 'rgba(122,85,0,0.15)',  badge: 'bg-yellow-900 text-yellow-400' };
  return { border: '#7a1f1f', bg: 'rgba(122,31,31,0.15)', badge: 'bg-red-900 text-red-400' };
}

export default function StoreHeatmap() {
  const [selectedStore, setSelectedStore] = useState(null);

  const storeStats = useMemo(() => {
    return STORES.map(store => {
      const employees = ALL_EMPLOYEES.filter(e => e.storeId === store.id);
      const atRisk = employees.filter(e => e.flightRiskLevel === 'Critical' || e.flightRiskLevel === 'High');
      const avgScore = employees.length
        ? Math.round(employees.reduce((s, e) => s + e.flightRiskScore, 0) / employees.length)
        : 0;
      return { ...store, employees, atRisk, avgScore };
    }).sort((a, b) => b.atRisk.length - a.atRisk.length || b.avgScore - a.avgScore);
  }, []);

  const selected = selectedStore ? storeStats.find(s => s.id === selectedStore) : null;

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        {[
          { label: '0–1 at-risk', color: '#1a5a30', bg: 'rgba(22,90,48,0.2)' },
          { label: '2–3 at-risk', color: '#7a5500', bg: 'rgba(122,85,0,0.2)' },
          { label: '4+ at-risk',  color: '#7a1f1f', bg: 'rgba(122,31,31,0.2)' },
        ].map(({ label, color, bg }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ border: `2px solid ${color}`, background: bg }} />
            <span style={{ color: '#7fa3c8' }}>{label}</span>
          </div>
        ))}
        <span className="ml-auto text-xs" style={{ color: '#4a6fa5' }}>
          Sorted by # at-risk (worst first) · Click a card to view employees
        </span>
      </div>

      {/* Store Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {storeStats.map(store => {
          const c = storeCardColor(store.atRisk.length);
          const isSelected = selectedStore === store.id;
          return (
            <button
              key={store.id}
              onClick={() => setSelectedStore(isSelected ? null : store.id)}
              className="text-left rounded-xl p-4 transition-all"
              style={{
                background: isSelected ? 'rgba(232,121,43,0.12)' : c.bg,
                border: `1px solid ${isSelected ? '#E8792B' : c.border}`,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-white text-sm leading-tight">{store.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#7fa3c8' }}>{store.city}, {store.state}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4a6fa5' }}>{store.region}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${c.badge}`}>
                  {store.atRisk.length} at-risk
                </span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: '#7fa3c8' }}>
                <span>{store.employees.length} total employees</span>
                <span>Avg score: <strong className="text-white">{store.avgScore}</strong></span>
              </div>
              {/* Mini risk bar */}
              <div className="mt-2 flex gap-0.5 h-1.5">
                {store.employees.slice(0, 15).map(e => (
                  <div
                    key={e.id}
                    className={`flex-1 rounded-sm ${getRiskColor(e.flightRiskLevel).dot}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Drill-down Panel */}
      {selected && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a4a7a' }}>
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ background: '#1B2A4A', borderBottom: '1px solid #2a4a7a' }}
          >
            <div>
              <h3 className="text-white font-bold">{selected.name}, {selected.state}</h3>
              <p className="text-xs mt-0.5" style={{ color: '#7fa3c8' }}>
                {selected.employees.length} employees · {selected.atRisk.length} at risk
              </p>
            </div>
            <button
              onClick={() => setSelectedStore(null)}
              className="text-gray-400 hover:text-white text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Employee list for selected store */}
          <div className="divide-y" style={{ divideColor: '#1e3a5f' }}>
            {selected.employees
              .sort((a, b) => b.flightRiskScore - a.flightRiskScore)
              .map(emp => (
                <div
                  key={emp.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                  style={{ background: '#132a45' }}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{emp.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#7fa3c8' }}>
                      {emp.role} · {emp.daysEmployed}d employed · ${emp.payRate}/hr
                    </p>
                    {emp.riskFactors.length > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: '#4a6fa5' }}>
                        {emp.riskFactors[0]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {/* score bar */}
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-xs text-white font-bold w-6">{emp.flightRiskScore}</span>
                      <div className="w-20 h-1.5 rounded-full" style={{ background: '#1e3a5f' }}>
                        <div
                          className={`h-1.5 rounded-full ${getRiskColor(emp.flightRiskLevel).dot}`}
                          style={{ width: `${emp.flightRiskScore}%` }}
                        />
                      </div>
                    </div>
                    <RiskPill level={emp.flightRiskLevel} score={emp.flightRiskScore} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
