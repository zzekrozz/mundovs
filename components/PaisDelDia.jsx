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

// ── Continent images mapping ──
const CONTINENT_IMAGES = {
  "África": "/maps/africa.webp",
  "Europa": "/maps/europa.webp",
  "Asia": "/maps/asia.webp",
  "América": "/maps/america-norte.webp", // Default América
  "Oceanía": "/maps/oceania.webp"
};

// Refinar América por subregión
function getContinentImage(continent, subregion) {
  if (continent === "América") {
    if (subregion === "Sudamérica") return "/maps/america-sur.webp";
    if (subregion === "Norteamérica") return "/maps/america-norte.webp";
    // Centroamérica y Caribe: mostrar ambas Américas o solo Norte por defecto
    return "/maps/america-norte.webp";
  }
  return CONTINENT_IMAGES[continent] || "/maps/africa.webp";
}

function ContinentMap({ continent, subregion, showSubregion }) {
  const imgSrc = getContinentImage(continent, subregion);
  
  return (
    <div className="pdd-continent-img-wrap">
      <img 
        src={imgSrc} 
        alt={continent}
        className={`pdd-continent-img ${showSubregion ? "pdd-continent-highlight" : "pdd-continent-base"}`}
      />
      {showSubregion && <div className="pdd-continent-glow" />}
    </div>
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
