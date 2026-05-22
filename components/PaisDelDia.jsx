import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import countriesData from "../data/countries_full.json";

// ─── Constants ───────────────────────────────────────────────────────────────
const POPULAR_COUNTRIES = [
  "ES","FR","IT","DE","GB","PT","NL","BE","CH","AT","SE","NO","DK","FI",
  "PL","GR","IE","RO","HU","CZ","RU","UA","TR",
  "US","CA","MX","BR","AR","CL","CO","PE","VE","EC","BO","UY","PY",
  "CU","DO","GT","HN","NI","CR","PA",
  "CN","JP","KR","IN","PK","BD","TH","VN","ID","PH","MY","SG",
  "SA","AE","IR","IQ","IL","JO","EG","MA","DZ","ZA","NG","KE","ET",
  "AU","NZ",
];
const START_DATE = new Date("2026-05-05T00:00:00.000Z");
const MAX_HINTS = 5;

// ─── Date helpers ─────────────────────────────────────────────────────────────
function getDayNumber() {
  const now = new Date();
  const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.floor((utcNow - START_DATE) / 86400000);
}
function getTodayString() {
  const n = new Date();
  return `${n.getUTCFullYear()}-${String(n.getUTCMonth()+1).padStart(2,"0")}-${String(n.getUTCDate()).padStart(2,"0")}`;
}

// ─── Country pool & selection ─────────────────────────────────────────────────
function shuffleWithSeed(arr, seed) {
  const a = [...arr]; let s = seed;
  for (let i = a.length-1; i > 0; i--) {
    s = (s*9301+49297)%233280;
    const j = Math.floor((s/233280)*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
function buildCountryPool() {
  const ps = new Set(POPULAR_COUNTRIES);
  const pop  = POPULAR_COUNTRIES.filter(c => countriesData[c]);
  const rest = Object.keys(countriesData).filter(c => !ps.has(c));
  return [...shuffleWithSeed(pop,42), ...shuffleWithSeed(rest,1337)];
}
function getCountryOfTheDay(d) {
  const p = buildCountryPool();
  return countriesData[p[((d%p.length)+p.length)%p.length]];
}

// ─── Normalize text for comparison ────────────────────────────────────────────
function normalize(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9\s]/g,"")
    .trim();
}

// Country aliases for flexible matching (name variants)
const ALIASES = {
  "US": ["usa","estados unidos","united states","eeuu","estados unidos de america"],
  "GB": ["reino unido","uk","gran bretana","great britain","united kingdom"],
  "RU": ["rusia","russia"],
  "KR": ["corea del sur","south korea"],
  "KP": ["corea del norte","north korea"],
  "CN": ["china"],
  "IR": ["iran"],
  "VN": ["vietnam"],
  "TW": ["taiwan"],
  "PS": ["palestina","palestine"],
};

function matchesCountry(input, country) {
  const inp = normalize(input);
  if (!inp) return false;
  if (normalize(country.name).includes(inp)) return true;
  const extra = ALIASES[country.code] || [];
  return extra.some(alias => alias.includes(inp) || inp.includes(alias));
}

// ─── Hint generation — progressive difficulty ─────────────────────────────────
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function generateHints(country) {
  const allCountries = Object.values(countriesData);
  const totalCountries = allCountries.length;

  // Median population for comparison
  const sorted = [...allCountries].sort((a,b) => a.population - b.population);
  const medPop = sorted[Math.floor(sorted.length/2)].population;

  // Pista 1 — ambiguous facts (multiple countries share these)
  const hint1Items = [];
  hint1Items.push(country.has_coast ? "Tiene salida al mar" : "No tiene salida al mar (país sin costa)");
  hint1Items.push(`Hemisferio ${country.hemisphere_NS}`);
  if (country.flag_colors.length > 0) hint1Items.push(`Su bandera tiene ${cap(country.flag_colors[0])}`);
  hint1Items.push(country.drives_on === "left" ? "Conduce por la izquierda" : "Conduce por la derecha");
  const hint1 = hint1Items.join(" · ");

  // Pista 2 — geography (island, landlocked, ocean, hemisphere EW)
  let hint2;
  if (country.is_island) {
    hint2 = `País insular · Hemisferio ${country.hemisphere_EW}`;
  } else if (country.landlocked) {
    hint2 = `Sin acceso al mar · Hemisferio ${country.hemisphere_EW}`;
  } else {
    const oceans = country.oceans.length ? country.oceans.join(" y ") : "un océano";
    hint2 = `Con costas al ${oceans} · Hemisferio ${country.hemisphere_EW}`;
  }

  // Pista 3 — economic/cultural (currency, EU/NATO, government)
  const hint3Parts = [];
  hint3Parts.push(`Moneda: ${country.currency}`);
  if (country.in_EU) hint3Parts.push("Miembro de la UE");
  if (country.in_NATO) hint3Parts.push("Miembro de la OTAN");
  if (country.government) hint3Parts.push(country.government);
  const hint3 = hint3Parts.join(" · ");

  // Pista 4 — clearer: continent, population size, name length
  const popSize = country.population > medPop ? "superior a la media" : "inferior a la media";
  const nameParts = `El nombre del país tiene ${country.name.length} letras · Su inicial es "${country.name.charAt(0).toUpperCase()}"`;
  const hint4 = `Continente: ${country.continent} (${country.subregion}) · Población ${popSize} · ${nameParts}`;

  // Pista 5 — almost definitive: capital first letter, languages, borders count
  const langs = country.official_languages.map(cap).join(", ");
  const borderCount = country.borders.length;
  const borderText = borderCount === 0
    ? "No tiene fronteras terrestres"
    : `Fronteras con ${borderCount} ${borderCount === 1 ? "país" : "países"}`;
  const hint5 = `Capital empieza por "${country.capital.charAt(0).toUpperCase()}" · Idioma: ${langs} · ${borderText}`;

  return [
    { id: 1, icon: "📡", label: "Datos generales",      text: hint1 },
    { id: 2, icon: "🗺️", label: "Geografía",             text: hint2 },
    { id: 3, icon: "💡", label: "Economía y política",   text: hint3 },
    { id: 4, icon: "🌍", label: "Continente y nombre",   text: hint4 },
    { id: 5, icon: "🏛️", label: "Pista final",            text: hint5 },
  ];
}

// ─── Proximity feedback ────────────────────────────────────────────────────────
function getProximity(guessed, target) {
  if (guessed.code === target.code) return "correct";
  if (guessed.continent === target.continent && guessed.subregion === target.subregion) return "very_close";
  if (guessed.continent === target.continent) return "close";
  return "far";
}

// ─── Share text ───────────────────────────────────────────────────────────────
function buildShareText(dayNumber, attempts, gameStatus, maxHints) {
  const hintsUsed = gameStatus === "won" ? attempts.length : maxHints;
  const bar = Array.from({length: maxHints}, (_,i) => {
    if (gameStatus === "won" && i === attempts.length - 1) return "🟩";
    if (i < attempts.length - (gameStatus === "won" ? 1 : 0)) return "🟥";
    return "⬛";
  });
  return [
    `🌍 MundoVS — País del Día #${dayNumber}`,
    gameStatus === "won"
      ? `✅ Descubierto en ${hintsUsed}/${maxHints} pistas`
      : `❌ No lo conseguí (${maxHints}/${maxHints})`,
    bar.join(""),
    "mundovs.com/pais-del-dia",
  ].join("\n");
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PaisDelDia({ dayOffset = 0 }) {
  const [mounted,       setMounted]       = useState(false);
  const [dayNumber,     setDayNumber]     = useState(0);
  const [todayCountry,  setTodayCountry]  = useState(null);
  const [hints,         setHints]         = useState([]);
  const [revealedHints, setRevealedHints] = useState(1);  // how many hints unlocked
  const [attempts,      setAttempts]      = useState([]);
  const [search,        setSearch]        = useState("");
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [gameStatus,    setGameStatus]    = useState("playing"); // playing | won | lost
  const [shareCopied,   setShareCopied]   = useState(false);
  const [wrongShake,    setWrongShake]    = useState(false);
  const [newHintIdx,    setNewHintIdx]    = useState(-1); // index just revealed
  const [showConfetti,  setShowConfetti]  = useState(false);
  const [isArchive,     setIsArchive]     = useState(false);

  const searchRef  = useRef(null);
  const answerRef  = useRef(null);

  // ── Init ──
  useEffect(() => {
    setMounted(true);
    const today      = getDayNumber();
    const targetDay  = dayOffset !== 0 ? today + dayOffset : today;
    const country    = getCountryOfTheDay(targetDay);
    setDayNumber(targetDay);
    setTodayCountry(country);
    setHints(generateHints(country));
    setIsArchive(dayOffset !== 0);

    const storageKey = dayOffset !== 0
      ? `mundovs_pais_del_dia_archive_${targetDay}`
      : "mundovs_pais_del_dia";
    const todayStr = dayOffset !== 0 ? `archive-${targetDay}` : getTodayString();

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (saved.date === todayStr) {
        setRevealedHints(saved.revealedHints || 1);
        setAttempts(saved.attempts || []);
        setGameStatus(saved.gameStatus || "playing");
      }
    } catch(e) {}
  }, [dayOffset]);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    function h(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Persist state ──
  useEffect(() => {
    if (!mounted || !todayCountry) return;
    const todayStr   = isArchive ? `archive-${dayNumber}` : getTodayString();
    const storageKey = isArchive ? `mundovs_pais_del_dia_archive_${dayNumber}` : "mundovs_pais_del_dia";
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        date: todayStr, dayNumber, revealedHints, attempts, gameStatus,
      }));
      if (!isArchive && (gameStatus === "won" || gameStatus === "lost")) {
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
    } catch(e) {}
  }, [mounted, todayCountry, revealedHints, attempts, gameStatus, dayNumber, isArchive]);

  // ── Filtered countries for autocomplete ──
  const allCountriesArray = useMemo(() =>
    Object.values(countriesData).sort((a,b) => a.name.localeCompare(b.name,"es")), []);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return [];
    return allCountriesArray.filter(c => matchesCountry(search, c)).slice(0, 8);
  }, [search, allCountriesArray]);

  // ── Handle guess ──
  function handleGuess(country) {
    if (gameStatus !== "playing") return;
    if (attempts.some(a => a.code === country.code)) {
      setSearch(""); setShowDropdown(false); return;
    }

    const proximity    = getProximity(country, todayCountry);
    const newAttempts  = [...attempts, { code: country.code, name: country.name, flag: country.flag, proximity }];
    setAttempts(newAttempts);
    setSearch(""); setShowDropdown(false);

    if (proximity === "correct") {
      setGameStatus("won");
      setShowConfetti(true);
      try { if (navigator.vibrate) navigator.vibrate([30,50,80]); } catch(e) {}
      setTimeout(() => setShowConfetti(false), 3500);
    } else {
      // Shake feedback
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
      try { if (navigator.vibrate) navigator.vibrate([15,40,15]); } catch(e) {}

      const nextRevealed = Math.min(revealedHints + 1, MAX_HINTS);
      setRevealedHints(nextRevealed);
      setNewHintIdx(nextRevealed - 1);
      setTimeout(() => setNewHintIdx(-1), 800);

      // Scroll to answer area after a brief pause
      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);

      if (newAttempts.length >= MAX_HINTS) setGameStatus("lost");
    }
  }

  async function handleShare() {
    const text = buildShareText(dayNumber, attempts, gameStatus, MAX_HINTS);
    if (navigator.share) {
      try { await navigator.share({ text }); } catch(e) {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      } catch(e) {}
    }
  }

  if (!mounted || !todayCountry) {
    return (
      <div className="pdd-mv-loading">
        <div className="pdd-mv-loading-inner">
          <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#1d9e75" strokeWidth="1.5" opacity=".3"/>
            <circle cx="24" cy="24" r="14" fill="none" stroke="#1d9e75" strokeWidth="1.2" opacity=".5" className="pdd-mv-spin-ring"/>
            <circle cx="24" cy="24" r="3" fill="#1d9e75"/>
          </svg>
          <span>Cargando misión...</span>
        </div>
      </div>
    );
  }

  const realDate = new Date(START_DATE);
  realDate.setUTCDate(realDate.getUTCDate() + dayNumber);
  const formattedDate = realDate.toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });

  const hintsUsedCount = gameStatus === "won" ? attempts.length : attempts.length;

  return (
    <div className="pdd-mv-wrap">

      {/* ── Confetti ── */}
      {showConfetti && (
        <div className="pdd-mv-confetti" aria-hidden="true">
          {Array.from({length: 28}).map((_,i) => (
            <span key={i} className="pdd-mv-confetti-piece"
              style={{
                left: `${(i * 37) % 100}%`,
                animationDelay: `${(i * 0.07) % 0.6}s`,
                backgroundColor: ["#1d9e75","#378add","#e24b4a","#ffd700","#9b59b6","#ff8c42"][i%6],
              }}
            />
          ))}
        </div>
      )}

      {/* ── GEO BACKGROUND ── */}
      <div className="pdd-mv-geo-bg" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 360 600" preserveAspectRatio="xMidYMid slice">
          <line x1="0" y1="100" x2="360" y2="100" stroke="#1d9e75" strokeWidth=".4" opacity=".06"/>
          <line x1="0" y1="250" x2="360" y2="250" stroke="#1d9e75" strokeWidth=".4" opacity=".05"/>
          <line x1="0" y1="400" x2="360" y2="400" stroke="#1d9e75" strokeWidth=".4" opacity=".04"/>
          <line x1="0" y1="550" x2="360" y2="550" stroke="#1d9e75" strokeWidth=".4" opacity=".03"/>
          <line x1="90"  y1="0" x2="90"  y2="600" stroke="#1d9e75" strokeWidth=".4" opacity=".06"/>
          <line x1="180" y1="0" x2="180" y2="600" stroke="#1d9e75" strokeWidth=".4" opacity=".06"/>
          <line x1="270" y1="0" x2="270" y2="600" stroke="#1d9e75" strokeWidth=".4" opacity=".04"/>
          <path d="M 20 160 Q 120 130 220 180 Q 300 220 350 200"
            fill="none" stroke="#1d9e75" strokeWidth=".9" opacity=".09"
            strokeDasharray="4 4" className="pdd-mv-route"/>
          <circle cx="220" cy="180" r="2" fill="#1d9e75" opacity=".2" className="pdd-mv-node-a"/>
          <circle cx="20"  cy="160" r="1.5" fill="#1d9e75" opacity=".15" className="pdd-mv-node-b"/>
          <circle cx="350" cy="200" r="1.5" fill="#1d9e75" opacity=".15" className="pdd-mv-node-c"/>
        </svg>
      </div>

      {/* ── HEADER ── */}
      <div className="pdd-mv-header">
        <div className="pdd-mv-topbar">
          <span className="pdd-mv-coord">LAT 40.71° N</span>
          <span className="pdd-mv-coord">LON 74.00° W</span>
        </div>
        <div className="pdd-mv-badge">
          {isArchive ? "ARCHIVO · " : ""}DAILY_MISSION_{String(dayNumber).padStart(3,"0")}
        </div>
        <h1 className="pdd-mv-title">País del Día</h1>
        <p className="pdd-mv-date">{formattedDate}</p>
        <p className="pdd-mv-subtitle">Descubre el país secreto con las mínimas pistas.</p>

        {/* Status chips */}
        <div className="pdd-mv-status-row">
          <span className="pdd-mv-chip">
            {gameStatus === "playing" ? "🔴 EN PROGRESO" : gameStatus === "won" ? "🟢 DESCUBIERTO" : "💀 FALLIDO"}
          </span>
          <span className="pdd-mv-chip">
            {attempts.length}/{MAX_HINTS} intentos
          </span>
          <span className="pdd-mv-chip">
            {revealedHints}/{MAX_HINTS} pistas
          </span>
        </div>

        {!isArchive && (
          <Link href="/pais-del-dia/archivo" className="pdd-mv-archive-link">
            📅 Retos anteriores
          </Link>
        )}
        {isArchive && (
          <Link href="/pais-del-dia" className="pdd-mv-archive-link">
            ← Reto de hoy
          </Link>
        )}
      </div>

      {/* ── HINTS GRID ── */}
      <div className="pdd-mv-hints-section">
        <div className="pdd-mv-section-label">PISTAS DESBLOQUEADAS</div>
        <div className="pdd-mv-hints-grid">
          {hints.map((hint, idx) => {
            const unlocked = idx < revealedHints;
            const isActive = unlocked && idx === revealedHints - 1;
            const isNew    = idx === newHintIdx;
            return (
              <div
                key={hint.id}
                className={[
                  "pdd-mv-hint-card",
                  unlocked ? "pdd-mv-hint-unlocked" : "pdd-mv-hint-locked",
                  isActive  ? "pdd-mv-hint-active"   : "",
                  isNew     ? "pdd-mv-hint-new"       : "",
                ].join(" ")}
              >
                {unlocked ? (
                  <>
                    <div className="pdd-mv-hint-top">
                      <span className="pdd-mv-hint-icon">{hint.icon}</span>
                      <span className="pdd-mv-hint-num">PISTA {hint.id}</span>
                    </div>
                    <div className="pdd-mv-hint-label">{hint.label}</div>
                    <div className="pdd-mv-hint-text">{hint.text}</div>
                  </>
                ) : (
                  <>
                    <div className="pdd-mv-hint-top">
                      <span className="pdd-mv-hint-icon">🔒</span>
                      <span className="pdd-mv-hint-num">PISTA {hint.id}</span>
                    </div>
                    <div className="pdd-mv-hint-label">{hint.label}</div>
                    <div className="pdd-mv-hint-locked-text">Falla para desbloquear</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ANSWER AREA ── */}
      {gameStatus === "playing" && (
        <div className="pdd-mv-answer-area" ref={answerRef}>
          <div className="pdd-mv-answer-cta">
            ↓ Responder
          </div>

          <div className="pdd-mv-search-wrap" ref={searchRef}>
            <input
              type="text"
              className={`pdd-mv-search-input ${wrongShake ? "pdd-mv-shake" : ""}`}
              placeholder="Escribe el nombre de un país..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              autoComplete="off"
            />
            {showDropdown && filteredCountries.length > 0 && (
              <div className="pdd-mv-dropdown">
                {filteredCountries.map(c => {
                  const tried = attempts.some(a => a.code === c.code);
                  return (
                    <button
                      key={c.code}
                      className={`pdd-mv-dropdown-item ${tried ? "pdd-mv-dropdown-tried" : ""}`}
                      onClick={() => !tried && handleGuess(c)}
                      disabled={tried}
                    >
                      <span className="pdd-mv-d-flag">{c.flag}</span>
                      <span className="pdd-mv-d-name">{c.name}</span>
                      {tried && <span className="pdd-mv-d-tried">ya probado</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Attempt history */}
          {attempts.length > 0 && (
            <div className="pdd-mv-attempts">
              {attempts.map((a, i) => (
                <div key={i} className={`pdd-mv-attempt pdd-mv-attempt-${a.proximity}`}>
                  <span className="pdd-mv-att-num">#{i+1}</span>
                  <span className="pdd-mv-att-flag">{a.flag}</span>
                  <span className="pdd-mv-att-name">{a.name}</span>
                  <span className="pdd-mv-att-fb">
                    {a.proximity === "very_close" && "🔥 Mismo continente y región"}
                    {a.proximity === "close"      && "📍 Mismo continente"}
                    {a.proximity === "far"        && "❌ Continente diferente"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── RESULT: WON ── */}
      {gameStatus === "won" && (
        <div className="pdd-mv-result pdd-mv-result-won">
          <div className="pdd-mv-result-badge">🟢 MISIÓN COMPLETADA</div>
          <div className="pdd-mv-result-flag">{todayCountry.flag}</div>
          <h2 className="pdd-mv-result-country">{todayCountry.name}</h2>
          <p className="pdd-mv-result-stat">
            Descubierto en <strong>{attempts.length}</strong> {attempts.length === 1 ? "intento" : "intentos"}
            {attempts.length <= 2 && " ⭐"}
          </p>
          <FactSheet country={todayCountry} />
          <ShareBlock
            text={buildShareText(dayNumber, attempts, gameStatus, MAX_HINTS)}
            shareCopied={shareCopied}
            onShare={handleShare}
          />
          <p className="pdd-mv-next-game">Vuelve mañana para el siguiente país 🌍</p>
        </div>
      )}

      {/* ── RESULT: LOST ── */}
      {gameStatus === "lost" && (
        <div className="pdd-mv-result pdd-mv-result-lost">
          <div className="pdd-mv-result-badge">💀 MISIÓN FALLIDA</div>
          <p className="pdd-mv-result-reveal-label">El país era:</p>
          <div className="pdd-mv-result-flag">{todayCountry.flag}</div>
          <h2 className="pdd-mv-result-country">{todayCountry.name}</h2>
          <FactSheet country={todayCountry} />
          <ShareBlock
            text={buildShareText(dayNumber, attempts, gameStatus, MAX_HINTS)}
            shareCopied={shareCopied}
            onShare={handleShare}
          />
          <p className="pdd-mv-next-game">Mañana hay otro país. ¡No te rindas! 🌍</p>
        </div>
      )}

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FactSheet({ country }) {
  const fmt = n => n.toLocaleString("es-ES");
  const fields = [
    { label: "Capital",    value: country.capital },
    { label: "Continente", value: `${country.continent} · ${country.subregion}` },
    { label: "Población",  value: fmt(country.population) + " hab." },
    { label: "Superficie", value: fmt(country.area_km2) + " km²" },
    { label: "Idioma",     value: country.official_languages.map(cap).join(", ") },
    { label: "Moneda",     value: country.currency },
  ];
  return (
    <div className="pdd-mv-fact">
      <div className="pdd-mv-fact-title">📚 Datos del país</div>
      <div className="pdd-mv-fact-grid">
        {fields.map(f => (
          <div key={f.label} className="pdd-mv-fact-item">
            <div className="pdd-mv-fact-label">{f.label}</div>
            <div className="pdd-mv-fact-value">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShareBlock({ text, shareCopied, onShare }) {
  return (
    <div className="pdd-mv-share">
      <button className="pdd-mv-share-btn" onClick={onShare}>
        {shareCopied ? "✅ ¡Copiado!" : "📤 Compartir resultado"}
      </button>
      <pre className="pdd-mv-share-preview">{text}</pre>
    </div>
  );
}

