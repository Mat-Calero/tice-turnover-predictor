import { useState, useMemo } from 'react';
import ALL_EMPLOYEES, { REGIONS, STORES, REPLACEMENT_COST } from '../data/employees';
import RiskPill from '../components/RiskPill';
import DraftEmailModal from '../components/DraftEmailModal';

export default function RetentionActions() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [emailEmployee, setEmailEmployee] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const atRisk = useMemo(() =>
    ALL_EMPLOYEES
      .filter(e => e.flightRiskLevel === 'Critical' || e.flightRiskLevel === 'High')
      .sort((a, b) => {
        const order = { Critical: 0, High: 1 };
        return (order[a.flightRiskLevel] - order[b.flightRiskLevel]) || b.flightRiskScore - a.flightRiskScore;
      }),
    []
  );

  const storesInRegion = useMemo(() =>
    selectedRegion === 'All Regions' ? STORES : STORES.filter(s => s.region === selectedRegion),
    [selectedRegion]
  );

  const filtered = useMemo(() => {
    let result = atRisk;
    if (selectedRegion !== 'All Regions') result = result.filter(e => e.region === selectedRegion);
    if (selectedStore !== 'all') result = result.filter(e => e.storeId === selectedStore);
    if (selectedLevel !== 'all') result = result.filter(e => e.flightRiskLevel === selectedLevel);
    return result;
  }, [atRisk, selectedRegion, selectedStore, selectedLevel]);

  const totalSavings = filtered.length * REPLACEMENT_COST;

  return (
    <div className="space-y-6">
      {/* Savings Banner */}
      <div
        className="rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
        style={{ background: 'rgba(16,100,40,0.2)', border: '1px solid #1a5a30' }}
      >
        <div>
          <p className="text-sm font-semibold text-green-400">Potential Retention Savings</p>
          <p className="text-xs mt-0.5" style={{ color: '#4a6fa5' }}>
            Retaining all {filtered.length} flagged employees below = <strong className="text-green-400">${totalSavings.toLocaleString()}</strong> saved in recruiting & training costs
          </p>
        </div>
        <p className="text-2xl font-black text-green-400">${totalSavings.toLocaleString()}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedLevel}
          onChange={e => setSelectedLevel(e.target.value)}
          className="text-sm rounded-lg px-3 py-2"
          style={{ background: '#1B2A4A', color: '#c8d8ed', border: '1px solid #2a4a7a' }}
        >
          <option value="all">All Levels</option>
          <option value="Critical">Critical Only</option>
          <option value="High">High Only</option>
        </select>
        <select
          value={selectedRegion}
          onChange={e => { setSelectedRegion(e.target.value); setSelectedStore('all'); }}
          className="flex-1 min-w-[140px] text-sm rounded-lg px-3 py-2"
          style={{ background: '#1B2A4A', color: '#c8d8ed', border: '1px solid #2a4a7a' }}
        >
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={selectedStore}
          onChange={e => setSelectedStore(e.target.value)}
          className="flex-1 min-w-[140px] text-sm rounded-lg px-3 py-2"
          style={{ background: '#1B2A4A', color: '#c8d8ed', border: '1px solid #2a4a7a' }}
        >
          <option value="all">All Stores</option>
          {storesInRegion.map(s => <option key={s.id} value={s.id}>{s.name}, {s.state}</option>)}
        </select>
      </div>

      {/* Action Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: '#4a6fa5' }}>
            No employees match these filters.
          </p>
        )}
        {filtered.map(emp => {
          const isExpanded = expandedId === emp.id;
          const isCritical = emp.flightRiskLevel === 'Critical';
          return (
            <div
              key={emp.id}
              className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${isCritical ? '#7a1f3a' : '#7a4a00'}` }}
            >
              {/* Card Header */}
              <button
                className="w-full text-left px-4 sm:px-5 py-4 flex flex-wrap items-center justify-between gap-3"
                style={{ background: isCritical ? '#2a1020' : '#2a1a00' }}
                onClick={() => setExpandedId(isExpanded ? null : emp.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-white text-sm">{emp.name}</p>
                      <RiskPill level={emp.flightRiskLevel} score={emp.flightRiskScore} />
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#7fa3c8' }}>
                      {emp.role} · {emp.storeName}, {emp.storeState} · {emp.daysEmployed}d employed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-green-400 hidden sm:block">Saves $3,500</span>
                  <span style={{ color: '#7fa3c8' }}>{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-4 space-y-4" style={{ background: '#142038' }}>
                  {/* Risk factors */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#7fa3c8' }}>Why They're Flagged</p>
                    <ul className="space-y-1">
                      {emp.riskFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm" style={{ color: '#c8d8ed' }}>
                          <span className="text-orange-400 flex-shrink-0">▸</span>{f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#7fa3c8' }}>Recommended Actions</p>
                    <ol className="space-y-2">
                      {emp.retentionActions.map((action, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs sm:text-sm rounded-lg p-3"
                          style={{ background: 'rgba(232,121,43,0.08)', border: '1px solid rgba(232,121,43,0.2)', color: '#f0c090' }}
                        >
                          <span className="font-black flex-shrink-0" style={{ color: '#E8792B' }}>{i + 1}.</span>
                          {action}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Employee quick stats */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      ['Pay', `$${emp.payRate}/hr`],
                      ['Hours', `${emp.hoursPerWeek}/${emp.baselineHours}`],
                      ['Missed', `${emp.missedShifts} shifts`],
                      ['Late', `${emp.lateArrivals}x`],
                      ['Mgr Rtg', `${emp.managerRating}/5`],
                      ['Sched', `${emp.scheduleConsistency}/10`],
                    ].map(([l, v]) => (
                      <div key={l} className="rounded p-2 text-center" style={{ background: '#0f1929' }}>
                        <p className="text-xs" style={{ color: '#4a6fa5' }}>{l}</p>
                        <p className="text-xs font-bold text-white">{v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Savings + email button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <p className="text-xs" style={{ color: '#4a6fa5' }}>
                      Retaining <span className="text-white font-semibold">{emp.name}</span> saves an estimated{' '}
                      <span className="text-green-400 font-bold">$3,500</span> in replacement costs.
                    </p>
                    <button
                      onClick={() => setEmailEmployee(emp)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                      style={{ background: '#E8792B', color: '#fff' }}
                    >
                      ✉ Draft Manager Email
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {emailEmployee && (
        <DraftEmailModal employee={emailEmployee} onClose={() => setEmailEmployee(null)} />
      )}
    </div>
  );
}
