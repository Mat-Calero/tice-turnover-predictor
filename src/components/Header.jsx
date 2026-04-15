export default function Header() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)',
      borderBottom: '1px solid rgba(232,121,43,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #E8792B, #c45e18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, color: 'white', fontSize: '18px', letterSpacing: '-1px',
            boxShadow: '0 4px 12px rgba(232,121,43,0.4)',
            flexShrink: 0,
          }}>T</div>
          <div>
            <h1 style={{ color: 'white', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.3px', lineHeight: 1.2, margin: 0 }}>
              TICE Turnover Predictor
            </h1>
            <p style={{ color: '#7fa3c8', fontSize: '11px', margin: 0, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Proactive Retention Intelligence
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, padding: '4px 12px',
            borderRadius: '20px', border: '1px solid rgba(232,121,43,0.5)',
            color: '#E8792B', background: 'rgba(232,121,43,0.1)',
            letterSpacing: '0.3px',
          }}>
            Demo · Simulated Data
          </span>
          <span style={{ fontSize: '12px', color: '#4a6fa5', display: 'none' }} className="sm-show">
            22 Locations · Popeyes Louisiana Kitchen
          </span>
        </div>
      </div>
    </header>
  );
}
