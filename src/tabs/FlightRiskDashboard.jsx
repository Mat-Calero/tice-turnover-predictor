import { useState, useMemo } from 'react';
import ALL_EMPLOYEES, { STORES, REGIONS, REPLACEMENT_COST, getRiskColor, RISK_FORMULA } from '../data/employees';
import RiskPill from '../components/RiskPill';
import EmployeeDetailPanel from '../components/EmployeeDetailPanel';
import DraftEmailModal from '../components/DraftEmailModal';

// ─── Mobile inline detail (used in card list) ────────────────────────────────
function MobileDetail({ emp, onClose }) {
  const [emailEmployee, setEmailEmployee] = useState(null);

  const monthsSinceRaise = emp.lastRaiseDate
    ? Math.floor((new Date('2026-04-15') - new Date(emp.lastRaiseDate)) / (1000 * 60 * 60 * 24 * 30))
    : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {[
          ['Hours/Wk', `${emp.hoursPerWeek}/${emp.baselineHours}`],
          ['Consistency', `${emp.scheduleConsistency}/10`],
          ['Missed Shifts', emp.missedShifts],
          ['Late Arrivals', emp.lateArrivals],
          ['Pay Rate', `$${emp.payRate}`],
          ['Manager Rtg', `${emp.managerRating}/5`],
          ['Last Raise', monthsSinceRaise !== null ? `${monthsSinceRaise}mo ago` : 'Never'],
          ['Overtime', `${emp.overtimeHours}hrs`],
        ].map(([l, v]) => (
          <div key={l} className="rounded p-2" style={{ background: '#132135' }}>
            <p className="text-xs" style={{ color: '#4a6fa5' }}>{l}</p>
            <p className="text-sm font-semibold text-white">{v}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#7fa3c8' }}>Risk Factors</p>
        <ul className="space-y-1">
          {emp.riskFactors.map((f, i) => (
            <li key={i} className="text-xs flex gap-1.5" style={{ color: '#c8d8ed' }}>
              <span className="text-orange-400 flex-shrink-0">▸</span>{f}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#7fa3c8' }}>Retention Actions</p>
        <ul className="space-y-1.5">
          {emp.retentionActions.map((a, i) => (
            <li
              key={i}
              className="text-xs rounded p-2"
              style={{ background: 'rgba(232,121,43,0.08)', border: '1px solid rgba(232,121,43,0.2)', color: '#f0c090' }}
            >
              {i + 1}. {a}
            </li>
          ))}
        </ul>
        <p className="text-xs mt-1.5" style={{ color: '#4a6fa5' }}>
          Saving this employee = <span className="text-green-400 font-bold">$3,500</span>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setEmailEmployee(emp)}
          className="flex-1 text-xs font-semibold py-2 rounded-lg"
          style={{ background: '#E8792B', color: '#fff' }}
        >
          Draft Email
        </button>
        <button
          onClick={onClose}
          className="px-4 text-xs py-2 rounded-lg"
          style={{ background: '#1e3a5f', color: '#7fa3c8' }}
        >
          Close
        </button>
      </div>

      {emailEmployee && (
        <DraftEmailModal employee={emailEmployee} onClose={() => setEmailEmployee(null)} />
      )}
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function FlightRiskDashboard() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [expandedId, setExpandedId] = useState(null);
  const [showFormula, setShowFormula] = useState(false);

  const atRisk = useMemo(() =>
    ALL_EMPLOYEES
      .filter(e => e.flightRiskLevel === 'Critical' || e.flightRiskLevel === 'High')
      .sort((a, b) => b.flightRiskScore - a.flightRiskScore),
    []
  );

  const critical = ALL_EMPLOYEES.filter(e => e.flightRiskLevel === 'Critical');
  const high     = ALL_EMPLOYEES.filter(e => e.flightRiskLevel === 'High');
  const estimatedLoss = (critical.length + high.length) * REPLACEMENT_COST;

  const filtered = useMemo(() => {
    let result = atRisk;
    if (selectedRegion !== 'All Regions') result = result.filter(e => e.region === selectedRegion);
    if (selectedStore !== 'all') result = result.filter(e => e.storeId === selectedStore);
    return result;
  }, [atRisk, selectedStore, selectedRegion]);

  const storesInRegion = useMemo(() =>
    selectedRegion === 'All Regions' ? STORES : STORES.filter(s => s.region === selectedRegion),
    [selectedRegion]
  );

  function toggle(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  const cardBase = 'rounded-xl p-4 sm:p-5 flex flex-col gap-1';

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={cardBase} style={{ background: '#0d1e35', border: '1px solid #1e3a5f' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#4a6fa5', margin: 0 }}>Total Employees</p>
          <p style={{ fontSize: '36px', fontWeight: 900, color: 'white', lineHeight: 1.1, margin: '4px 0 2px' }}>{ALL_EMPLOYEES.length}</p>
          <p style={{ fontSize: '11px', color: '#4a6fa5', margin: 0 }}>Across 22 locations</p>
        </div>
        <div className={cardBase} style={{ background: '#0d1e35', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#ef4444', margin: 0 }}>Critical Risk</p>
          <p style={{ fontSize: '36px', fontWeight: 900, color: '#ef4444', lineHeight: 1.1, margin: '4px 0 2px' }}>{critical.length}</p>
          <p style={{ fontSize: '11px', color: 'rgba(239,68,68,0.5)', margin: 0 }}>Score 75–100 · Immediate action</p>
        </div>
        <div className={cardBase} style={{ background: '#0d1e35', border: '1px solid rgba(232,121,43,0.3)' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#E8792B', margin: 0 }}>High Risk</p>
          <p style={{ fontSize: '36px', fontWeight: 900, color: '#E8792B', lineHeight: 1.1, margin: '4px 0 2px' }}>{high.length}</p>
          <p style={{ fontSize: '11px', color: 'rgba(232,121,43,0.5)', margin: 0 }}>Score 50–74 · Intervene soon</p>
        </div>
        <div className={cardBase} style={{ background: '#0d1e35', border: '1px solid rgba(34,197,94,0.3)' }}>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#22c55e', margin: 0 }}>Est. Replacement Cost</p>
          <p style={{ fontSize: '28px', fontWeight: 900, color: '#22c55e', lineHeight: 1.1, margin: '4px 0 2px' }}>${estimatedLoss.toLocaleString()}</p>
          <p style={{ fontSize: '11px', color: 'rgba(34,197,94,0.5)', margin: 0 }}>If all at-risk employees quit</p>
        </div>
      </div>

      {/* ── Formula Disclosure ──────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a4a7a' }}>
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ background: '#1B2A4A' }}
          onClick={() => setShowFormula(v => !v)}
        >
          <span className="text-sm font-semibold text-white">
            Flight Risk Score Formula — How We Calculate Risk
          </span>
          <span style={{ color: '#7fa3c8' }}>{showFormula ? '▲' : '▼'}</span>
        </button>
        {showFormula && (
          <div className="px-4 pb-4 pt-2 grid sm:grid-cols-2 gap-x-6" style={{ background: '#142038' }}>
            {RISK_FORMULA.map(row => (
              <div
                key={row.factor}
                className="flex justify-between items-start gap-3 text-xs py-2.5"
                style={{ borderBottom: '1px solid #1e3a5f' }}
              >
                <div>
                  <p className="text-white font-medium">{row.factor}</p>
                  <p style={{ color: '#4a6fa5' }}>{row.description}</p>
                </div>
                <span className="font-black text-base flex-shrink-0" style={{ color: '#E8792B' }}>
                  +{row.weight}
                </span>
              </div>
            ))}
            <p className="text-xs col-span-full pt-2" style={{ color: '#4a6fa5' }}>
              Score is capped at 100. Multiple factors stack — an employee can hit 100 from several simultaneous signals.
            </p>
          </div>
        )}
      </div>

      {/* ── Filters ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedRegion}
          onChange={e => { setSelectedRegion(e.target.value); setSelectedStore('all'); }}
          className="flex-1 min-w-[160px] text-sm rounded-lg px-3 py-2"
          style={{ background: '#1B2A4A', color: '#c8d8ed', border: '1px solid #2a4a7a' }}
        >
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={selectedStore}
          onChange={e => setSelectedStore(e.target.value)}
          className="flex-1 min-w-[160px] text-sm rounded-lg px-3 py-2"
          style={{ background: '#1B2A4A', color: '#c8d8ed', border: '1px solid #2a4a7a' }}
        >
          <option value="all">All Stores</option>
          {storesInRegion.map(s => (
            <option key={s.id} value={s.id}>{s.name}, {s.state}</option>
          ))}
        </select>
        <div
          className="flex items-center px-3 py-2 rounded-lg text-sm"
          style={{ background: '#1B2A4A', border: '1px solid #2a4a7a', color: '#7fa3c8' }}
        >
          {filtered.length} employee{filtered.length !== 1 ? 's' : ''} flagged
        </div>
      </div>

      {/* ── Desktop Table ────────────────────────────────── */}
      <div className="hidden sm:block rounded-xl overflow-hidden" style={{ border: '1px solid #2a4a7a' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#1B2A4A', borderBottom: '1px solid #2a4a7a' }}>
                {['Employee', 'Store', 'Role', 'Days Employed', 'Risk Score', 'Level', 'Top Risk Factor'].map(h => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: '#7fa3c8' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm" style={{ color: '#4a6fa5' }}>
                    No at-risk employees match this filter.
                  </td>
                </tr>
              )}
              {filtered.map(emp => (
                <>
                  <tr
                    key={emp.id}
                    className="cursor-pointer transition-colors"
                    style={{
                      background: expandedId === emp.id ? '#0f2240' : '#132a45',
                      borderBottom: '1px solid #1e3a5f',
                    }}
                    onClick={() => toggle(emp.id)}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getRiskColor(emp.flightRiskLevel).dot}`} />
                        {emp.name}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#c8d8ed' }}>
                      {emp.storeName}, {emp.storeState}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#c8d8ed' }}>{emp.role}</td>
                    <td className="px-4 py-3" style={{ color: '#c8d8ed' }}>{emp.daysEmployed}d</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white w-6">{emp.flightRiskScore}</span>
                        <div className="h-1.5 rounded-full w-16" style={{ background: '#1e3a5f' }}>
                          <div
                            className={`h-1.5 rounded-full ${getRiskColor(emp.flightRiskLevel).dot}`}
                            style={{ width: `${emp.flightRiskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RiskPill level={emp.flightRiskLevel} />
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <span className="text-xs" style={{ color: '#7fa3c8' }}>
                        {emp.riskFactors[0] ?? '—'}
                      </span>
                    </td>
                  </tr>
                  {expandedId === emp.id && (
                    <EmployeeDetailPanel
                      key={`panel-${emp.id}`}
                      employee={emp}
                      onClose={() => setExpandedId(null)}
                    />
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Card List ─────────────────────────────── */}
      <div
        className="sm:hidden rounded-xl overflow-hidden"
        style={{ border: '1px solid #2a4a7a' }}
      >
        {filtered.length === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: '#4a6fa5' }}>
            No at-risk employees match this filter.
          </p>
        )}
        {filtered.map(emp => (
          <div key={emp.id} style={{ borderBottom: '1px solid #1e3a5f' }}>
            <button
              className="w-full text-left p-4 transition-colors"
              style={{ background: expandedId === emp.id ? '#0f2240' : '#132a45' }}
              onClick={() => toggle(emp.id)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm">{emp.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#7fa3c8' }}>
                    {emp.role} · {emp.storeName}, {emp.storeState}
                  </p>
                  <p className="text-xs mt-1 truncate" style={{ color: '#4a6fa5', maxWidth: '200px' }}>
                    {emp.daysEmployed}d · {emp.riskFactors[0]?.substring(0, 45)}{emp.riskFactors[0]?.length > 45 ? '…' : ''}
                  </p>
                </div>
                <RiskPill level={emp.flightRiskLevel} score={emp.flightRiskScore} />
              </div>
            </button>
            {expandedId === emp.id && (
              <div
                className="p-4 space-y-4"
                style={{ background: '#0f2240', borderTop: '1px solid #2a4a7a' }}
              >
                <MobileDetail emp={emp} onClose={() => setExpandedId(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
