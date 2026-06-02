export default function InteractiveHero() {
  return (
    <div className="mv-hero">
      <div className="mv-geo-bg" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 360 260" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="65" x2="360" y2="65" stroke="#1d9e75" strokeWidth=".4" opacity=".07"/>
          <line x1="0" y1="130" x2="360" y2="130" stroke="#1d9e75" strokeWidth=".4" opacity=".07"/>
          <line x1="0" y1="195" x2="360" y2="195" stroke="#1d9e75" strokeWidth=".4" opacity=".05"/>
          <line x1="90" y1="0" x2="90" y2="260" stroke="#1d9e75" strokeWidth=".4" opacity=".07"/>
          <line x1="180" y1="0" x2="180" y2="260" stroke="#1d9e75" strokeWidth=".4" opacity=".07"/>
          <line x1="270" y1="0" x2="270" y2="260" stroke="#1d9e75" strokeWidth=".4" opacity=".05"/>
          <path d="M 30 90 Q 110 60 190 120 Q 270 180 340 140" fill="none" stroke="#1d9e75" strokeWidth="1" opacity=".11" strokeDasharray="4 4" className="mv-route-1"/>
          <path d="M 20 180 Q 120 150 210 190 Q 290 225 355 200" fill="none" stroke="#1d9e75" strokeWidth=".8" opacity=".07" strokeDasharray="4 4" className="mv-route-2"/>
          <circle cx="190" cy="120" r="2.5" fill="#1d9e75" opacity=".2" className="mv-node"/>
          <circle cx="30" cy="90" r="2" fill="#1d9e75" opacity=".15" className="mv-node mv-node-b"/>
          <circle cx="340" cy="140" r="2" fill="#1d9e75" opacity=".15" className="mv-node mv-node-c"/>
          <circle cx="120" cy="175" r="1.8" fill="#1d9e75" opacity=".12" className="mv-node mv-node-b"/>
          <circle cx="290" cy="195" r="1.8" fill="#1d9e75" opacity=".12" className="mv-node mv-node-c"/>
        </svg>
      </div>

      <div className="mv-hero-topbar">
        <span>LAT 40.71° N</span>
        <span>LON 74.00° W</span>
      </div>

      <div className="mv-hero-emblem" aria-hidden="true">
        <svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
          <circle cx="45" cy="45" r="40" fill="none" stroke="#1d9e75" strokeWidth=".8" opacity=".2"/>
          <circle cx="45" cy="45" r="32" fill="none" stroke="#1d9e75" strokeWidth="1.2" opacity=".4" className="mv-pulse-ring"/>
          <circle cx="45" cy="45" r="20" fill="none" stroke="#1d9e75" strokeWidth="1.5" opacity=".65"/>
          <line x1="45" y1="5" x2="45" y2="85" stroke="#1d9e75" strokeWidth=".7" opacity=".25"/>
          <line x1="5" y1="45" x2="85" y2="45" stroke="#1d9e75" strokeWidth=".7" opacity=".25"/>
          <polygon points="45,8 48.5,18 41.5,18" fill="#1d9e75"/>
          <polygon points="45,82 48.5,72 41.5,72" fill="#1d9e75" opacity=".65"/>
          <polygon points="8,45 18,41.5 18,48.5" fill="#1d9e75" opacity=".65"/>
          <polygon points="82,45 72,41.5 72,48.5" fill="#1d9e75"/>
          <circle cx="45" cy="45" r="10" fill="none" stroke="#1a4f63" strokeWidth=".8" opacity=".5"/>
          <circle cx="45" cy="45" r="4.5" fill="none" stroke="#1d9e75" strokeWidth="1.5"/>
          <circle cx="45" cy="45" r="2" fill="#1d9e75"/>
        </svg>
      </div>

      <div className="mv-hero-content">
        <div className="mv-hero-label">CENTRO DE CONTROL</div>
        <h1 className="mv-hero-title">Descubre<br />el mundo</h1>
        <div className="mv-hero-sub">MISIÓN: GEOGRAFÍA GLOBAL</div>
        <p className="mv-hero-desc">Tres modos. Cada uno un reto distinto.</p>
      </div>
    </div>
  );
}
