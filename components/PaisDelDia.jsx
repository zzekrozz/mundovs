import { useState, useEffect, useMemo } from "react";
import countriesData from "../data/countries_full.json";

// Lista curada de países "fáciles" para los primeros días (los más conocidos)
// Cuando se acabe esta lista, se pasa al pool completo
const POPULAR_COUNTRIES = [
  "ES", "FR", "IT", "DE", "GB", "PT", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI",
  "PL", "GR", "IE", "RO", "HU", "CZ", "RU", "UA", "TR",
  "US", "CA", "MX", "BR", "AR", "CL", "CO", "PE", "VE", "EC", "BO", "UY", "PY",
  "CU", "DO", "GT", "HN", "NI", "CR", "PA",
  "CN", "JP", "KR", "KP", "IN", "PK", "BD", "TH", "VN", "ID", "PH", "MY", "SG",
  "SA", "AE", "IR", "IQ", "IL", "PS", "JO", "LB", "SY", "QA", "KW",
  "EG", "MA", "DZ", "TN", "LY", "ZA", "NG", "KE", "ET", "GH", "SN", "CI",
  "AU", "NZ"
];

// Fecha de inicio del juego: 5 mayo 2026 (lanzamiento)
// Esto hace que el día #1 sea un país muy conocido, no uno aleatorio
const START_DATE = new Date("2026-05-05T00:00:00.000Z");

function getDayNumber() {
  const now = new Date();
  // Usar UTC para que todos los usuarios del mundo tengan el mismo país
  const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const diffTime = utcNow.getTime() - START_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getTodayString() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Shuffle determinístico con seed fija (mismo orden siempre)
function shuffleWithSeed(array, seed) {
  const arr = [...array];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Construir el pool ordenado: primero populares barajados, luego el resto
function buildCountryPool() {
  const popularSet = new Set(POPULAR_COUNTRIES);
  const popular = POPULAR_COUNTRIES.filter(code => countriesData[code]);
  const rest = Object.keys(countriesData).filter(code => !popularSet.has(code));
  
  const popularShuffled = shuffleWithSeed(popular, 42);
  const restShuffled = shuffleWithSeed(rest, 1337);
  
  return [...popularShuffled, ...restShuffled];
}

function getCountryOfTheDay(dayNumber) {
  const pool = buildCountryPool();
  const index = ((dayNumber % pool.length) + pool.length) % pool.length;
  return countriesData[pool[index]];
}

// Generar las pistas progresivas para un país
function generateHints(country) {
  const popRanges = [
    { max: 1_000_000, label: "menos de 1 millón" },
    { max: 10_000_000, label: "entre 1 y 10 millones" },
    { max: 50_000_000, label: "entre 10 y 50 millones" },
    { max: 100_000_000, label: "entre 50 y 100 millones" },
    { max: Infinity, label: "más de 100 millones" }
  ];
  const popRange = popRanges.find(r => country.population < r.max).label;
  
  const hints = [
    {
      icon: "🌎",
      label: "Continente",
      value: country.continent
    },
    {
      icon: "📍",
      label: "Subregión",
      value: country.subregion
    },
    {
      icon: "👥",
      label: "Población",
      value: popRange + " de habitantes"
    },
    {
      icon: country.has_coast ? "🏖️" : "🏔️",
      label: "Geografía",
      value: country.landlocked
        ? "País sin salida al mar"
        : country.is_island
        ? "País insular"
        : `Tiene costa (${country.oceans.join(", ")})`
    },
    {
      icon: "🗣️",
      label: "Idioma oficial",
      value: country.official_languages.join(", ")
    },
    {
      icon: "🎨",
      label: "Colores de bandera",
      value: country.flag_colors.join(", ")
    }
  ];
  
  // Pista 7: frontera (si tiene)
  if (country.borders && country.borders.length > 0) {
    const randomBorder = country.borders[0]; // Primera frontera (determinístico)
    const borderCountry = countriesData[randomBorder];
    if (borderCountry) {
      hints.push({
        icon: "🚧",
        label: "Frontera con",
        value: borderCountry.name
      });
    }
  } else if (country.is_island) {
    hints.push({
      icon: "🏝️",
      label: "Frontera con",
      value: "No tiene fronteras terrestres"
    });
  }
  
  // Pista 8: capital (primera letra)
  hints.push({
    icon: "🏛️",
    label: "Capital empieza por",
    value: country.capital.charAt(0).toUpperCase()
  });
  
  return hints;
}

// Calcular qué tan "cerca" está un país de otro (para el feedback "casi")
function getProximityFeedback(guessed, target) {
  if (guessed.code === target.code) return "correct";
  if (guessed.continent === target.continent && guessed.subregion === target.subregion) return "very_close";
  if (guessed.continent === target.continent) return "close";
  return "far";
}

export default function PaisDelDia() {
  const [mounted, setMounted] = useState(false);
  const [dayNumber, setDayNumber] = useState(0);
  const [todayCountry, setTodayCountry] = useState(null);
  const [hints, setHints] = useState([]);
  const [revealedHints, setRevealedHints] = useState(1); // Empieza con 1 pista visible
  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [gameStatus, setGameStatus] = useState("playing"); // playing | won | lost
  const [shareCopied, setShareCopied] = useState(false);
  
  const MAX_HINTS = 8;
  
  useEffect(() => {
    setMounted(true);
    const day = getDayNumber();
    const country = getCountryOfTheDay(day);
    const generatedHints = generateHints(country);
    
    setDayNumber(day);
    setTodayCountry(country);
    setHints(generatedHints);
    
    // Cargar estado guardado si es del mismo día
    const todayStr = getTodayString();
    try {
      const saved = JSON.parse(localStorage.getItem("mundovs_pais_del_dia") || "{}");
      if (saved.date === todayStr) {
        setRevealedHints(saved.revealedHints || 1);
        setAttempts(saved.attempts || []);
        setGameStatus(saved.gameStatus || "playing");
      }
    } catch (e) {
      // Si hay error en localStorage, ignorar
    }
  }, []);
  
  // Guardar estado en cada cambio
  useEffect(() => {
    if (!mounted || !todayCountry) return;
    
    const todayStr = getTodayString();
    const state = {
      date: todayStr,
      dayNumber,
      revealedHints,
      attempts,
      gameStatus
    };
    
    try {
      localStorage.setItem("mundovs_pais_del_dia", JSON.stringify(state));
      
      // También guardar streak
      if (gameStatus === "won" || gameStatus === "lost") {
        const streakKey = "mundovs_pais_del_dia_streak";
        const streakData = JSON.parse(localStorage.getItem(streakKey) || '{"current":0,"best":0,"lastWonDate":null}');
        
        if (gameStatus === "won") {
          // Verificar si ganó ayer también
          const yesterday = new Date();
          yesterday.setUTCDate(yesterday.getUTCDate() - 1);
          const yY = yesterday.getUTCFullYear();
          const yM = String(yesterday.getUTCMonth() + 1).padStart(2, "0");
          const yD = String(yesterday.getUTCDate()).padStart(2, "0");
          const yesterdayStr = `${yY}-${yM}-${yD}`;
          
          if (streakData.lastWonDate === todayStr) {
            // Ya ganó hoy, no hacer nada
          } else if (streakData.lastWonDate === yesterdayStr) {
            streakData.current += 1;
          } else {
            streakData.current = 1;
          }
          
          if (streakData.current > streakData.best) {
            streakData.best = streakData.current;
          }
          streakData.lastWonDate = todayStr;
        } else if (gameStatus === "lost") {
          streakData.current = 0;
        }
        
        localStorage.setItem(streakKey, JSON.stringify(streakData));
      }
    } catch (e) {
      // Ignorar errores de localStorage
    }
  }, [mounted, todayCountry, revealedHints, attempts, gameStatus, dayNumber]);
  
  const allCountriesArray = useMemo(() => 
    Object.values(countriesData).sort((a, b) => a.name.localeCompare(b.name, "es")),
    []
  );
  
  const filteredCountries = useMemo(() => {
    if (!search.trim()) return [];
    const normalize = (s) => s.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const q = normalize(search);
    return allCountriesArray
      .filter(c => normalize(c.name).includes(q))
      .slice(0, 8);
  }, [search, allCountriesArray]);
  
  function handleGuess(country) {
    if (gameStatus !== "playing") return;
    
    // No permitir el mismo país dos veces
    if (attempts.some(a => a.code === country.code)) {
      setSearch("");
      setShowDropdown(false);
      return;
    }
    
    const proximity = getProximityFeedback(country, todayCountry);
    const newAttempt = {
      code: country.code,
      name: country.name,
      flag: country.flag,
      proximity
    };
    
    const newAttempts = [...attempts, newAttempt];
    setAttempts(newAttempts);
    setSearch("");
    setShowDropdown(false);
    
    if (proximity === "correct") {
      setGameStatus("won");
    } else {
      // Revelar siguiente pista
      const newRevealed = Math.min(revealedHints + 1, MAX_HINTS);
      setRevealedHints(newRevealed);
      
      // Si ya reveló todas las pistas y no acertó → perdió
      if (newRevealed >= MAX_HINTS && newAttempts.length >= MAX_HINTS) {
        setGameStatus("lost");
      }
    }
  }
  
  function buildShareText() {
    const lines = [`🌍 MundoVs País del Día #${dayNumber}`];
    
    if (gameStatus === "won") {
      lines.push(`✅ Acertado en ${attempts.length} ${attempts.length === 1 ? "intento" : "intentos"}`);
    } else {
      lines.push(`❌ No lo acerté`);
    }
    
    // Barra de progreso visual
    const bar = [];
    for (let i = 0; i < MAX_HINTS; i++) {
      if (i < attempts.length - (gameStatus === "won" ? 1 : 0)) {
        bar.push("🟥");
      } else if (i === attempts.length - 1 && gameStatus === "won") {
        bar.push("🟩");
      } else {
        bar.push("⬛");
      }
    }
    lines.push(bar.join(""));
    lines.push(`mundovs-ajhz.vercel.app/pais-del-dia`);
    
    return lines.join("\n");
  }
  
  async function handleShare() {
    const text = buildShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // Usuario canceló
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch (e) {
        // No se pudo copiar
      }
    }
  }
  
  if (!mounted || !todayCountry) {
    return <div className="pdd-loading">Cargando...</div>;
  }
  
  const todayStr = getTodayString();
  const formattedDate = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  
  return (
    <div className="pdd-container">
      <div className="pdd-header">
        <div className="pdd-day-badge">DÍA #{dayNumber}</div>
        <h1 className="pdd-title">País del Día</h1>
        <p className="pdd-date">{formattedDate}</p>
        <p className="pdd-subtitle">
          Adivina el país secreto. Cada fallo revela una pista nueva.
        </p>
      </div>
      
      {gameStatus === "playing" && (
        <>
          {/* Pistas reveladas */}
          <div className="pdd-hints">
            {hints.slice(0, revealedHints).map((hint, idx) => (
              <div key={idx} className="pdd-hint-card pdd-hint-revealed">
                <div className="pdd-hint-icon">{hint.icon}</div>
                <div className="pdd-hint-content">
                  <div className="pdd-hint-label">PISTA {idx + 1} · {hint.label}</div>
                  <div className="pdd-hint-value">{hint.value}</div>
                </div>
              </div>
            ))}
            
            {/* Pistas bloqueadas */}
            {hints.slice(revealedHints).map((hint, idx) => (
              <div key={idx + revealedHints} className="pdd-hint-card pdd-hint-locked">
                <div className="pdd-hint-icon">🔒</div>
                <div className="pdd-hint-content">
                  <div className="pdd-hint-label">PISTA {idx + revealedHints + 1}</div>
                  <div className="pdd-hint-value">Falla un intento para revelar</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Buscador */}
          <div className="pdd-search-wrapper">
            <div className="pdd-search-box">
              <input
                type="text"
                className="pdd-search-input"
                placeholder="Escribe el nombre de un país..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && filteredCountries.length > 0 && (
                <div className="pdd-search-dropdown">
                  {filteredCountries.map(country => {
                    const alreadyTried = attempts.some(a => a.code === country.code);
                    return (
                      <button
                        key={country.code}
                        className={`pdd-search-result ${alreadyTried ? "pdd-search-result-disabled" : ""}`}
                        onClick={() => !alreadyTried && handleGuess(country)}
                        disabled={alreadyTried}
                      >
                        <span className="pdd-flag">{country.flag}</span>
                        <span className="pdd-country-name">{country.name}</span>
                        {alreadyTried && <span className="pdd-already-tried">ya probado</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="pdd-attempts-counter">
              Intentos: {attempts.length} / {MAX_HINTS}
            </p>
          </div>
          
          {/* Lista de intentos previos */}
          {attempts.length > 0 && (
            <div className="pdd-attempts">
              <h3 className="pdd-attempts-title">Tus intentos:</h3>
              {attempts.map((a, idx) => (
                <div key={idx} className={`pdd-attempt pdd-attempt-${a.proximity}`}>
                  <span className="pdd-attempt-flag">{a.flag}</span>
                  <span className="pdd-attempt-name">{a.name}</span>
                  <span className="pdd-attempt-feedback">
                    {a.proximity === "very_close" && "🔥 Mismo continente y región"}
                    {a.proximity === "close" && "📍 Mismo continente"}
                    {a.proximity === "far" && "❌ Lejos"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Pantalla de victoria */}
      {gameStatus === "won" && (
        <div className="pdd-result pdd-result-won">
          <div className="pdd-result-emoji">🎉</div>
          <h2 className="pdd-result-title">¡Lo conseguiste!</h2>
          <div className="pdd-result-flag">{todayCountry.flag}</div>
          <h3 className="pdd-result-country">{todayCountry.name}</h3>
          <p className="pdd-result-stats">
            Acertado en <strong>{attempts.length}</strong> {attempts.length === 1 ? "intento" : "intentos"}
          </p>
          
          <CountryFactSheet country={todayCountry} />
          
          <div className="pdd-share-section">
            <button className="pdd-share-btn" onClick={handleShare}>
              {shareCopied ? "✅ ¡Copiado!" : "📤 Compartir resultado"}
            </button>
            <pre className="pdd-share-preview">{buildShareText()}</pre>
          </div>
          
          <p className="pdd-next-game">
            Vuelve mañana para el siguiente país 🌍
          </p>
        </div>
      )}
      
      {/* Pantalla de derrota */}
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
          
          <p className="pdd-next-game">
            Mañana hay otro país. ¡No te rindas! 🌍
          </p>
        </div>
      )}
    </div>
  );
}

// Tarjeta de datos del país (para post-juego)
function CountryFactSheet({ country }) {
  const formatNumber = (n) => n.toLocaleString("es-ES");
  
  return (
    <div className="pdd-fact-sheet">
      <h4 className="pdd-fact-title">📚 Sobre {country.name}</h4>
      <div className="pdd-fact-grid">
        <div className="pdd-fact-item">
          <div className="pdd-fact-label">Capital</div>
          <div className="pdd-fact-value">{country.capital}</div>
        </div>
        <div className="pdd-fact-item">
          <div className="pdd-fact-label">Población</div>
          <div className="pdd-fact-value">{formatNumber(country.population)}</div>
        </div>
        <div className="pdd-fact-item">
          <div className="pdd-fact-label">Superficie</div>
          <div className="pdd-fact-value">{formatNumber(country.area_km2)} km²</div>
        </div>
        <div className="pdd-fact-item">
          <div className="pdd-fact-label">Continente</div>
          <div className="pdd-fact-value">{country.continent}</div>
        </div>
        <div className="pdd-fact-item">
          <div className="pdd-fact-label">Idioma</div>
          <div className="pdd-fact-value">{country.official_languages.join(", ")}</div>
        </div>
        <div className="pdd-fact-item">
          <div className="pdd-fact-label">Moneda</div>
          <div className="pdd-fact-value">{country.currency}</div>
        </div>
      </div>
    </div>
  );
}
