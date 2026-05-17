import { useState, useEffect, useMemo, useRef } from "react";
import countriesData from "../data/countries_full.json";

const POPULAR_COUNTRIES = [
  "ES","FR","IT","DE","GB","PT","NL","BE","CH","AT","SE","NO","DK","FI",
  "PL","GR","IE","RO","HU","CZ","RU","UA","TR",
  "US","CA","MX","BR","AR","CL","CO","PE","VE","EC","BO","UY","PY",
  "CU","DO","GT","HN","NI","CR","PA",
  "CN","JP","KR","KP","IN","PK","BD","TH","VN","ID","PH","MY","SG",
  "SA","AE","IR","IQ","IL","PS","JO","LB","SY","QA","KW",
  "EG","MA","DZ","TN","LY","ZA","NG","KE","ET","GH","SN","CI",
  "AU","NZ"
];

const START_DATE = new Date("2026-05-05T00:00:00.000Z");
const MAX_HINTS = 8;

// ── Helpers ──
function getDayNumber() {
  const now = new Date();
  const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.floor((utcNow.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
}
function getTodayString() {
  const n = new Date();
  return `${n.getUTCFullYear()}-${String(n.getUTCMonth()+1).padStart(2,"0")}-${String(n.getUTCDate()).padStart(2,"0")}`;
}
function shuffleWithSeed(arr, seed) {
  const a = [...arr]; let s = seed;
  for (let i = a.length-1; i > 0; i--) { s = (s*9301+49297)%233280; const j = Math.floor((s/233280)*(i+1)); [a[i],a[j]] = [a[j],a[i]]; }
  return a;
}
function buildCountryPool() {
  const ps = new Set(POPULAR_COUNTRIES);
  const pop = POPULAR_COUNTRIES.filter(c => countriesData[c]);
  const rest = Object.keys(countriesData).filter(c => !ps.has(c));
  return [...shuffleWithSeed(pop,42), ...shuffleWithSeed(rest,1337)];
}
function getCountryOfTheDay(d) { const p = buildCountryPool(); return countriesData[p[((d%p.length)+p.length)%p.length]]; }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function vibrate() { try { if (navigator.vibrate) navigator.vibrate(30); } catch(e){} }

// ── Continent & Subregion maps (inline SVG) ──
const CONTINENT_PATHS = {
  "África": { vb: "60 70 300 310", regions: {
    "Norte de África": "M 110 95 Q 130 88 165 90 Q 200 88 240 92 Q 275 96 295 110 Q 305 130 295 145 Q 270 155 230 152 Q 185 150 145 148 Q 115 145 105 130 Q 100 110 110 95 Z",
    "África Occidental": "M 105 130 Q 115 145 145 148 Q 175 150 195 165 Q 200 195 185 220 Q 165 235 145 230 Q 120 220 110 195 Q 100 170 105 130 Z",
    "África Central": "M 195 165 Q 230 158 270 165 Q 280 195 270 225 Q 245 240 215 235 Q 195 220 195 165 Z",
    "África Oriental": "M 270 165 Q 305 165 320 180 Q 325 215 315 240 Q 295 255 275 250 Q 265 235 270 165 Z",
    "África Austral": "M 185 220 Q 215 235 245 240 Q 275 250 290 270 Q 285 305 265 320 Q 230 325 200 315 Q 175 290 165 260 Q 170 235 185 220 Z"
  }},
  "Europa": { vb: "100 60 280 260", regions: {
    "Europa del Norte": "M 175 75 Q 200 65 230 70 Q 255 78 250 110 Q 245 130 220 135 Q 195 130 180 120 Q 170 100 175 75 Z",
    "Europa Occidental": "M 145 145 Q 175 140 200 145 Q 215 165 210 195 Q 195 215 170 215 Q 145 210 135 190 Q 130 165 145 145 Z",
    "Europa Central": "M 200 145 Q 235 140 260 150 Q 270 175 260 195 Q 235 210 210 200 Q 200 175 200 145 Z",
    "Europa del Este": "M 260 150 Q 305 145 335 165 Q 340 195 325 215 Q 290 220 265 210 Q 250 185 260 150 Z",
    "Europa del Sur": "M 130 215 Q 155 225 180 230 Q 210 230 240 235 Q 275 240 290 255 Q 285 280 260 285 Q 220 280 190 275 Q 155 270 130 260 Q 120 235 130 215 Z"
  }},
  "Asia": { vb: "40 80 340 230", regions: {
    "Asia Occidental": "M 70 130 Q 100 120 130 125 Q 150 145 145 175 Q 125 195 95 195 Q 75 180 65 160 Q 60 140 70 130 Z",
    "Asia Central": "M 130 125 Q 165 115 200 120 Q 210 145 200 165 Q 175 175 150 170 Q 135 150 130 125 Z",
    "Asia Meridional": "M 145 175 Q 175 180 200 185 Q 220 215 215 245 Q 195 270 175 270 Q 155 250 145 220 Q 140 195 145 175 Z",
    "Asia Oriental": "M 200 120 Q 250 110 310 120 Q 345 140 350 170 Q 340 195 310 200 Q 270 195 230 190 Q 210 175 200 145 Z",
    "Sudeste Asiático": "M 230 200 Q 265 210 295 215 Q 315 235 310 265 Q 285 285 255 280 Q 230 270 220 245 Q 215 220 230 200 Z"
  }},
  "América": { vb: "60 40 240 330", regions: {
    "Norteamérica": "M 80 60 Q 130 50 195 60 Q 230 75 235 110 Q 220 140 185 145 Q 145 140 110 130 Q 80 115 70 90 Q 70 70 80 60 Z",
    "Centroamérica": "M 145 145 Q 165 150 180 155 Q 195 175 190 195 Q 175 210 160 205 Q 145 195 140 175 Q 138 158 145 145 Z",
    "Caribe": "M 195 175 Q 225 170 250 175 Q 260 188 255 200 Q 230 205 200 200 Q 188 188 195 175 Z",
    "Sudamérica": "M 180 210 Q 215 215 240 225 Q 255 260 250 300 Q 230 335 200 345 Q 175 340 160 315 Q 150 280 155 245 Q 165 220 180 210 Z"
  }},
  "Oceanía": { vb: "80 70 300 230", regions: {
    "Australasia": "M 100 180 Q 160 170 210 175 Q 245 185 250 215 Q 235 240 195 245 Q 145 240 110 230 Q 90 215 90 200 Q 92 188 100 180 Z",
    "Melanesia": "M 230 130 Q 265 125 290 135 Q 295 155 280 165 Q 255 165 235 158 Q 225 145 230 130 Z",
    "Micronesia": "M 250 85 Q 290 80 325 90 Q 335 110 320 120 Q 285 120 255 110 Q 245 95 250 85 Z",
    "Polinesia": "M 295 200 Q 330 195 355 205 Q 365 235 350 260 Q 325 270 305 260 Q 290 235 295 200 Z"
  }}
};

function ContinentMap({ continent, subregion, showSubregion }) {
  const data = CONTINENT_PATHS[continent];
  if (!data) return null;
  return (
    <svg viewBox={data.vb} className="pdd-continent-svg" xmlns="http://www.w3.org/2000/svg">
      {Object.entries(data.regions).map(([name, path]) => {
        const isHighlighted = showSubregion && name === subregion;
        const isBase = !showSubregion;
        return (
          <path key={name} d={path}
            className={isHighlighted ? "pdd-region-highlight" : isBase ? "pdd-region-base" : "pdd-region-dim"}
          />
        );
      })}
    </svg>
  );
}

// ── Hint generation with rarity system ──
function generateHints(country) {
  const popRanges = [
    { max: 1e6, label: "Menos de 1 millón" },
    { max: 1e7, label: "Entre 1 y 10 millones" },
    { max: 5e7, label: "Entre 10 y 50 millones" },
    { max: 1e8, label: "Entre 50 y 100 millones" },
    { max: Infinity, label: "Más de 100 millones" }
  ];
  const popRange = popRanges.find(r => country.population < r.max).label;

  // Rarity: how unique is each hint value?
  const langCount = Object.values(countriesData).filter(c =>
    c.official_languages.some(l => country.official_languages.includes(l))
  ).length;
  const currCount = Object.values(countriesData).filter(c => c.currency === country.currency).length;

  // If language is very rare (<4 countries share it), push it to later position
  const langIsRare = langCount <= 3;
  const currIsRare = currCount <= 3;

  const langs = country.official_languages.map(capitalize).join(", ");

  const basePistas = [
    { icon: "🌎", label: "Continente", value: country.continent, type: "map_continent" },
    { icon: "📍", label: "Subregión", value: country.subregion, type: "map_subregion" },
    { icon: "👥", label: "Población", value: popRange + " de habitantes", type: "text" },
    {
      icon: country.has_coast ? "🏖️" : "🏔️", label: "Geografía", type: "text",
      value: country.landlocked ? "País sin salida al mar"
        : country.is_island ? "País insular"
        : `Tiene costa (${country.oceans.join(", ")})`
    }
  ];

  // Slot 5 & 6: balance rare vs common
  const langHint = { icon: "🗣️", label: "Idioma oficial", value: langs, type: "text" };
  const colorHint = { icon: "🎨", label: "Colores de bandera", value: country.flag_colors.map(capitalize).join(", "), type: "text" };
  const currHint = { icon: "💰", label: "Moneda", value: country.currency, type: "text" };

  if (langIsRare && currIsRare) {
    // Both rare → push both to later, use colors + geography instead
    basePistas.push(colorHint);
    basePistas.push({ icon: "🚗", label: "Conduce por la", value: country.drives_on === "left" ? "Izquierda" : "Derecha", type: "text" });
    basePistas.push(langHint);
  } else if (langIsRare) {
    basePistas.push(colorHint);
    basePistas.push(currHint);
    basePistas.push(langHint);
  } else {
    basePistas.push(langHint);
    basePistas.push(colorHint);
  }

  // Border hint
  if (country.borders && country.borders.length > 0) {
    const bc = countriesData[country.borders[0]];
    if (bc) basePistas.push({ icon: "🚧", label: "Frontera con", value: bc.name, type: "text" });
  } else {
    basePistas.push({ icon: "🏝️", label: "Fronteras", value: "No tiene fronteras terrestres", type: "text" });
  }

  // Capital first letter
  basePistas.push({ icon: "🏛️", label: "Capital empieza por", value: `"${country.capital.charAt(0).toUpperCase()}"`, type: "text" });

  return basePistas.slice(0, MAX_HINTS);
}

function getProximityFeedback(guessed, target) {
  if (guessed.code === target.code) return "correct";
  if (guessed.continent === target.continent && guessed.subregion === target.subregion) return "very_close";
  if (guessed.continent === target.continent) return "close";
  return "far";
}

// ── Main Component ──
export default function PaisDelDia() {
  const [mounted, setMounted] = useState(false);
  const [dayNumber, setDayNumber] = useState(0);
  const [todayCountry, setTodayCountry] = useState(null);
  const [hints, setHints] = useState([]);
  const [revealedHints, setRevealedHints] = useState(1);
  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [gameStatus, setGameStatus] = useState("playing");
  const [shareCopied, setShareCopied] = useState(false);
  const [justRevealed, setJustRevealed] = useState(-1);
  const [showConfetti, setShowConfetti] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const day = getDayNumber();
    const country = getCountryOfTheDay(day);
    setDayNumber(day);
    setTodayCountry(country);
    setHints(generateHints(country));

    const todayStr = getTodayString();
    try {
      const saved = JSON.parse(localStorage.getItem("mundovs_pais_del_dia") || "{}");
      if (saved.date === todayStr) {
        setRevealedHints(saved.revealedHints || 1);
        setAttempts(saved.attempts || []);
        setGameStatus(saved.gameStatus || "playing");
      }
    } catch(e){}
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Save state
  useEffect(() => {
    if (!mounted || !todayCountry) return;
    const todayStr = getTodayString();
    try {
      localStorage.setItem("mundovs_pais_del_dia", JSON.stringify({ date: todayStr, dayNumber, revealedHints, attempts, gameStatus }));
      if (gameStatus === "won" || gameStatus === "lost") {
        const sk = "mundovs_pais_del_dia_streak";
        const sd = JSON.parse(localStorage.getItem(sk) || '{"current":0,"best":0,"lastWonDate":null}');
        if (gameStatus === "won") {
          const y = new Date(); y.setUTCDate(y.getUTCDate()-1);
          const ys = `${y.getUTCFullYear()}-${String(y.getUTCMonth()+1).padStart(2,"0")}-${String(y.getUTCDate()).padStart(2,"0")}`;
          if (sd.lastWonDate === todayStr) { /* already saved */ }
          else if (sd.lastWonDate === ys) { sd.current += 1; }
          else { sd.current = 1; }
          if (sd.current > sd.best) sd.best = sd.current;
          sd.lastWonDate = todayStr;
        } else { sd.current = 0; }
        localStorage.setItem(sk, JSON.stringify(sd));
      }
    } catch(e){}
  }, [mounted, todayCountry, revealedHints, attempts, gameStatus, dayNumber]);

  const allCountriesArray = useMemo(() =>
    Object.values(countriesData).sort((a,b) => a.name.localeCompare(b.name,"es")), []);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return [];
    const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    return allCountriesArray.filter(c => norm(c.name).includes(norm(search))).slice(0,8);
  }, [search, allCountriesArray]);

  function handleGuess(country) {
    if (gameStatus !== "playing") return;
    if (attempts.some(a => a.code === country.code)) { setSearch(""); setShowDropdown(false); return; }

    const proximity = getProximityFeedback(country, todayCountry);
    const newAttempts = [...attempts, { code: country.code, name: country.name, flag: country.flag, proximity }];
    setAttempts(newAttempts);
    setSearch(""); setShowDropdown(false);

    if (proximity === "correct") {
      setGameStatus("won");
      setShowConfetti(true);
      vibrate();
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      vibrate();
      const nr = Math.min(revealedHints + 1, MAX_HINTS);
      setRevealedHints(nr);
      setJustRevealed(nr - 1);
      setTimeout(() => setJustRevealed(-1), 600);
      if (nr >= MAX_HINTS && newAttempts.length >= MAX_HINTS) setGameStatus("lost");
    }
  }

  function buildShareText() {
    const lines = [`🌍 MundoVS #${dayNumber}`];
    if (gameStatus === "won") {
      const stars = attempts.length <= 2 ? "⭐" : attempts.length <= 4 ? "🔥" : "✅";
      lines.push(`${stars} ${attempts.length}/${MAX_HINTS} pistas`);
    } else {
      lines.push(`❌ ${MAX_HINTS}/${MAX_HINTS}`);
    }
    const bar = [];
    for (let i = 0; i < MAX_HINTS; i++) {
      if (i < attempts.length - (gameStatus === "won" ? 1 : 0)) bar.push("🟥");
      else if (i === attempts.length - 1 && gameStatus === "won") bar.push("🟩");
      else bar.push("⬛");
    }
    lines.push(bar.join(""));
    lines.push("mundovs.com/pais-del-dia");
    return lines.join("\n");
  }

  async function handleShare() {
    const text = buildShareText();
    if (navigator.share) { try { await navigator.share({ text }); } catch(e){} }
    else { try { await navigator.clipboard.writeText(text); setShareCopied(true); setTimeout(() => setShareCopied(false), 2000); } catch(e){} }
  }

  if (!mounted || !todayCountry) return <div className="pdd-loading"><div className="pdd-loading-globe">🌍</div>Cargando...</div>;

  const formattedDate = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="pdd-container">
      {showConfetti && <div className="pdd-confetti" aria-hidden="true">
        {Array.from({length:24}).map((_,i) => <span key={i} className="pdd-confetti-piece" style={{ left: `${Math.random()*100}%`, animationDelay: `${Math.random()*0.5}s`, backgroundColor: ["#1D9E75","#FF8C42","#378ADD","#E24B4A","#FFD700","#9B59B6"][i%6] }} />)}
      </div>}

      <div className="pdd-header">
        <div className="pdd-day-badge">DÍA #{dayNumber}</div>
        <h1 className="pdd-title">País del Día</h1>
        <p className="pdd-date">{formattedDate}</p>
        <p className="pdd-subtitle">Adivina el país secreto. Cada fallo revela una pista nueva.</p>
      </div>

      {gameStatus === "playing" && (<>
        <div className="pdd-hints">
          {hints.slice(0, revealedHints).map((hint, idx) => (
            <div key={idx} className={`pdd-hint-card pdd-hint-revealed ${idx === justRevealed ? "pdd-hint-just-revealed" : ""}`}>
              {hint.type === "map_continent" ? (
                <div className="pdd-hint-map-wrap">
                  <ContinentMap continent={hint.value} subregion={null} showSubregion={false} />
                  <div className="pdd-hint-map-label">
                    <div className="pdd-hint-label">PISTA {idx+1} · {hint.label}</div>
                    <div className="pdd-hint-value">{hint.value}</div>
                  </div>
                </div>
              ) : hint.type === "map_subregion" ? (
                <div className="pdd-hint-map-wrap">
                  <ContinentMap continent={todayCountry.continent} subregion={hint.value} showSubregion={true} />
                  <div className="pdd-hint-map-label">
                    <div className="pdd-hint-label">PISTA {idx+1} · {hint.label}</div>
                    <div className="pdd-hint-value">{hint.value}</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="pdd-hint-icon">{hint.icon}</div>
                  <div className="pdd-hint-content">
                    <div className="pdd-hint-label">PISTA {idx+1} · {hint.label}</div>
                    <div className="pdd-hint-value">{hint.value}</div>
                  </div>
                </>
              )}
            </div>
          ))}
          {hints.slice(revealedHints).map((_,idx) => (
            <div key={idx+revealedHints} className="pdd-hint-card pdd-hint-locked">
              <div className="pdd-hint-icon">🔒</div>
              <div className="pdd-hint-content">
                <div className="pdd-hint-label">PISTA {idx+revealedHints+1}</div>
                <div className="pdd-hint-value">Falla un intento para revelar</div>
              </div>
            </div>
          ))}
        </div>

        <div className="pdd-search-wrapper" ref={searchRef}>
          <div className="pdd-search-box">
            <input type="text" className="pdd-search-input" placeholder="Escribe el nombre de un país..."
              value={search} onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)} />
            {showDropdown && filteredCountries.length > 0 && (
              <div className="pdd-search-dropdown">
                {filteredCountries.map(c => {
                  const tried = attempts.some(a => a.code === c.code);
                  return (<button key={c.code} className={`pdd-search-result ${tried?"pdd-search-result-disabled":""}`}
                    onClick={() => !tried && handleGuess(c)} disabled={tried}>
                    <span className="pdd-flag">{c.flag}</span>
                    <span className="pdd-country-name">{c.name}</span>
                    {tried && <span className="pdd-already-tried">ya probado</span>}
                  </button>);
                })}
              </div>
            )}
          </div>
          <div className="pdd-progress-bar">
            {Array.from({length:MAX_HINTS}).map((_,i) => (
              <div key={i} className={`pdd-progress-dot ${i < attempts.length ? "pdd-dot-used" : ""} ${i < revealedHints ? "pdd-dot-revealed" : ""}`} />
            ))}
          </div>
          <p className="pdd-attempts-counter">Intento {attempts.length + 1} de {MAX_HINTS}</p>
        </div>

        {attempts.length > 0 && (
          <div className="pdd-attempts">
            <h3 className="pdd-attempts-title">Tus intentos</h3>
            {attempts.map((a,idx) => (
              <div key={idx} className={`pdd-attempt pdd-attempt-${a.proximity}`}>
                <span className="pdd-attempt-num">#{idx+1}</span>
                <span className="pdd-attempt-flag">{a.flag}</span>
                <span className="pdd-attempt-name">{a.name}</span>
                <span className="pdd-attempt-feedback">
                  {a.proximity === "very_close" && "🔥 ¡Mismo continente y región!"}
                  {a.proximity === "close" && "📍 Mismo continente"}
                  {a.proximity === "far" && "❌ Otro continente"}
                </span>
              </div>
            ))}
          </div>
        )}
      </>)}

      {gameStatus === "won" && (
        <div className="pdd-result pdd-result-won">
          <div className="pdd-result-emoji">🎉</div>
          <h2 className="pdd-result-title">¡{attempts.length <= 2 ? "Increíble" : attempts.length <= 4 ? "Bien jugado" : "Lo conseguiste"}!</h2>
          <div className="pdd-result-flag">{todayCountry.flag}</div>
          <h3 className="pdd-result-country">{todayCountry.name}</h3>
          <p className="pdd-result-stats">
            Acertado en <strong>{attempts.length}</strong> {attempts.length === 1 ? "intento" : "intentos"}
            {attempts.length <= 2 && " ⭐"}
          </p>
          <CountryFactSheet country={todayCountry} />
          <div className="pdd-share-section">
            <button className="pdd-share-btn" onClick={handleShare}>
              {shareCopied ? "✅ ¡Copiado!" : "📤 Compartir resultado"}
            </button>
            <pre className="pdd-share-preview">{buildShareText()}</pre>
          </div>
          <p className="pdd-next-game">Vuelve mañana para el siguiente país 🌍</p>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="pdd-result pdd-result-lost">
          <div className="pdd-result-emoji">💀</div>
          <h2 className="pdd-result-title">¡Casi!</h2>
          <p className="pdd-result-subtitle">El país secreto era:</p>
          <div className="pdd-result-flag">{todayCountry.flag}</div>
          <h3 className="pdd-result-country">{todayCountry.name}</h3>
          <CountryFactSheet country={todayCountry} />
          <div className="pdd-share-section">
            <button className="pdd-share-btn" onClick={handleShare}>
              {shareCopied ? "✅ ¡Copiado!" : "📤 Compartir resultado"}
            </button>
            <pre className="pdd-share-preview">{buildShareText()}</pre>
          </div>
          <p className="pdd-next-game">Mañana hay otro país. ¡No te rindas! 🌍</p>
        </div>
      )}
    </div>
  );
}

function CountryFactSheet({ country }) {
  const fmt = n => n.toLocaleString("es-ES");
  return (
    <div className="pdd-fact-sheet">
      <h4 className="pdd-fact-title">📚 Sobre {country.name}</h4>
      <div className="pdd-fact-grid">
        <div className="pdd-fact-item"><div className="pdd-fact-label">Capital</div><div className="pdd-fact-value">{country.capital}</div></div>
        <div className="pdd-fact-item"><div className="pdd-fact-label">Población</div><div className="pdd-fact-value">{fmt(country.population)}</div></div>
        <div className="pdd-fact-item"><div className="pdd-fact-label">Superficie</div><div className="pdd-fact-value">{fmt(country.area_km2)} km²</div></div>
        <div className="pdd-fact-item"><div className="pdd-fact-label">Continente</div><div className="pdd-fact-value">{country.continent}</div></div>
        <div className="pdd-fact-item"><div className="pdd-fact-label">Idioma</div><div className="pdd-fact-value">{country.official_languages.map(capitalize).join(", ")}</div></div>
        <div className="pdd-fact-item"><div className="pdd-fact-label">Moneda</div><div className="pdd-fact-value">{country.currency}</div></div>
      </div>
    </div>
  );
}
