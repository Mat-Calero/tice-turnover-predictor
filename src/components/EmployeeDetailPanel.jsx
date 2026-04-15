import { useState } from 'react';
import RiskPill from './RiskPill';
import DraftEmailModal from './DraftEmailModal';
import { getScoreBarColor } from '../data/employees';

export default function EmployeeDetailPanel({ employee, onClose }) {
  const [showEmail, setShowEmail] = useState(false);
  const barColor = getScoreBarColor(employee.flightRiskScore);

  const monthsSinceRaise = employee.lastRaiseDate
    ? Math.floor((new Date('2026-04-15') - new Date(employee.lastRaiseDate)) / (1000 * 60 * 60 * 24 * 30))
    : null;

  return (
    <>
      <tr>
        <td colSpan={7} className="p-0">
          <div
            className="p-5 space-y-5"
            style={{ background: '#0f2240', borderTop: '1px solid #2a4a7a', borderBottom: '1px solid #2a4a7a' }}
          >
            {/* Top row */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-white font-bold text-base">{employee.name}</p>
                <p className="text-sm mt-0.5" style={{ color: '#7fa3c8' }}>
                  {employee.role} · {employee.storeName} · Hired {employee.hireDate} ({employee.daysEmployed} days)
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <RiskPill level={employee.flightRiskLevel} score={employee.flightRiskScore} />
                <button
                  onClick={() => setShowEmail(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: '#E8792B', color: '#fff' }}
                >
                  Draft Email
                </button>
                <button
                  onClick={onClose}
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: '#1e3a5f', color: '#7fa3c8' }}
                >
                  Collapse
                </button>
              </div>
            </div>

            {/* Score bar */}
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#7fa3c8' }}>
                <span>Flight Risk Score</span>
                <span className="font-bold text-white">{employee.flightRiskScore}/100</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: '#1e3a5f' }}>
                <div
                  className={`h-2 rounded-full transition-all ${barColor}`}
                  style={{ width: `${employee.flightRiskScore}%` }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Hours/Week', value: `${employee.hoursPerWeek} / ${employee.baselineHours}` },
                { label: 'Sched. Consistency', value: `${employee.scheduleConsistency}/10` },
                { label: 'Missed Shifts (30d)', value: employee.missedShifts },
                { label: 'Late Arrivals (30d)', value: employee.lateArrivals },
                { label: 'Overtime (4 wks)', value: `${employee.overtimeHours} hrs` },
                { label: 'Pay Rate', value: `$${employee.payRate}/hr` },
                { label: 'Manager Rating', value: `${employee.managerRating}/5` },
                { label: 'Last Raise', value: monthsSinceRaise !== null ? `${monthsSinceRaise} mo ago` : 'Never' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg p-3" style={{ background: '#132135' }}>
                  <p className="text-xs mb-0.5" style={{ color: '#4a6fa5' }}>{label}</p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Risk Factors */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#7fa3c8' }}>
                Risk Factors
              </p>
              <ul className="space-y-1.5">
                {employee.riskFactors.length > 0 ? employee.riskFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#c8d8ed' }}>
                    <span className="mt-0.5 text-orange-400 flex-shrink-0">▸</span>
                    {f}
                  </li>
                )) : (
                  <li className="text-sm" style={{ color: '#4a6fa5' }}>No significant risk factors detected.</li>
                )}
              </ul>
            </div>

            {/* Retention Actions */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#7fa3c8' }}>
                Recommended Retention Actions
              </p>
              <ul className="space-y-2">
                {employee.retentionActions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm rounded-lg p-3" style={{ background: 'rgba(232,121,43,0.08)', border: '1px solid rgba(232,121,43,0.2)', color: '#f0c090' }}>
                    <span className="flex-shrink-0 font-bold" style={{ color: '#E8792B' }}>{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ul>
              <p className="text-xs mt-2 font-medium" style={{ color: '#4a6fa5' }}>
                Retaining this employee saves an estimated <span className="text-green-400 font-bold">$3,500</span> in replacement costs.
              </p>
            </div>
          </div>
        </td>
      </tr>

      {showEmail && <DraftEmailModal employee={employee} onClose={() => setShowEmail(false)} />}
    </>
  );
}
