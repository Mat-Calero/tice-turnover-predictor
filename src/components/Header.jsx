export default function Header() {
  return (
    <header className="sticky top-0 z-50" style={{ background: '#0f1929', borderBottom: '1px solid #1e3a5f' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {/* TICE logo mark */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-white text-sm flex-shrink-0"
            style={{ background: '#E8792B' }}
          >
            T
          </div>
          <div>
            <h1 className="text-white font-bold text-lg sm:text-xl leading-tight">
              TICE Turnover Predictor
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: '#7fa3c8' }}>
              Proactive Retention Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full border"
            style={{ color: '#E8792B', borderColor: '#E8792B', background: 'rgba(232,121,43,0.12)' }}
          >
            Demo — Simulated Data
          </span>
          <span className="text-xs hidden sm:block" style={{ color: '#7fa3c8' }}>
            22 Locations · Popeyes Louisiana Kitchen
          </span>
        </div>
      </div>
    </header>
  );
}
