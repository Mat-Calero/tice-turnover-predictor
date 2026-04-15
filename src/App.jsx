import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FlightRiskDashboard from './tabs/FlightRiskDashboard';
import StoreHeatmap from './tabs/StoreHeatmap';
import RetentionActions from './tabs/RetentionActions';
import ALL_EMPLOYEES from './data/employees';

const TABS = [
  { id: 'dashboard',  label: 'Flight Risk Dashboard' },
  { id: 'heatmap',    label: 'Store Risk Heatmap' },
  { id: 'retention',  label: 'Retention Actions' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const critical = ALL_EMPLOYEES.filter(e => e.flightRiskLevel === 'Critical').length;
  const high      = ALL_EMPLOYEES.filter(e => e.flightRiskLevel === 'High').length;

  return (
    <div style={{ minHeight: '100vh', background: '#0f1929' }}>
      <Header />

      {/* Tab Navigation */}
      <div style={{ borderBottom: '1px solid #1e3a5f', background: '#0f1929' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-0">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const badge = tab.id === 'dashboard' || tab.id === 'retention'
                ? critical + high
                : null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 sm:px-5 py-4 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    color: isActive ? '#E8792B' : '#7fa3c8',
                    borderBottom: isActive ? '2px solid #E8792B' : '2px solid transparent',
                    marginBottom: '-1px',
                    background: 'transparent',
                  }}
                >
                  {tab.label}
                  {badge && isActive && (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(232,121,43,0.2)', color: '#E8792B' }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && <FlightRiskDashboard />}
        {activeTab === 'heatmap'   && <StoreHeatmap />}
        {activeTab === 'retention' && <RetentionActions />}
      </main>

      <Footer />
    </div>
  );
}
