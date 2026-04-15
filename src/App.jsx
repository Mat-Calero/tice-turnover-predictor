import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FlightRiskDashboard from './tabs/FlightRiskDashboard';
import StoreHeatmap from './tabs/StoreHeatmap';
import RetentionActions from './tabs/RetentionActions';
import ALL_EMPLOYEES from './data/employees';

const TABS = [
  { id: 'dashboard', label: 'Flight Risk Dashboard', icon: '⚡' },
  { id: 'heatmap',   label: 'Store Risk Heatmap',    icon: '🗺' },
  { id: 'retention', label: 'Retention Actions',      icon: '🎯' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const critical = ALL_EMPLOYEES.filter(e => e.flightRiskLevel === 'Critical').length;
  const high      = ALL_EMPLOYEES.filter(e => e.flightRiskLevel === 'High').length;
  const total     = critical + high;

  return (
    <div style={{ minHeight: '100vh', background: '#080f1e' }}>
      <Header />

      {/* Tab Navigation */}
      <div style={{
        background: 'linear-gradient(180deg, #0a1628 0%, #0d1a30 100%)',
        borderBottom: '1px solid rgba(30,58,95,0.8)',
        position: 'sticky', top: '64px', zIndex: 40,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '4px' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const showBadge = (tab.id === 'dashboard' || tab.id === 'retention') && isActive;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '14px 20px',
                  fontSize: '13px', fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#E8792B' : '#5a7fa8',
                  borderBottom: isActive ? '2px solid #E8792B' : '2px solid transparent',
                  marginBottom: '-1px',
                  background: isActive ? 'rgba(232,121,43,0.05)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'all 0.15s ease',
                  borderRadius: '6px 6px 0 0',
                }}
              >
                <span style={{ fontSize: '14px' }}>{tab.icon}</span>
                {tab.label}
                {showBadge && total > 0 && (
                  <span style={{
                    fontSize: '11px', fontWeight: 800,
                    padding: '2px 8px', borderRadius: '10px',
                    background: 'rgba(232,121,43,0.2)', color: '#E8792B',
                    border: '1px solid rgba(232,121,43,0.3)',
                  }}>{total}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {activeTab === 'dashboard' && <FlightRiskDashboard />}
        {activeTab === 'heatmap'   && <StoreHeatmap />}
        {activeTab === 'retention' && <RetentionActions />}
      </main>

      <Footer />
    </div>
  );
}
