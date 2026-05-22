import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import countries from "../data/countries.json";
import { CATEGORIES } from "../data/categories";

const MIN_COUNTRIES = 10;
const RECORD_GLOBAL_KEY  = "mundovs_higherlower_best_global";
const RECORD_CATEGORY_KEY = "mundovs_higherlower_best_by_category";
const LAST_RESULT_KEY    = "mundovs_higherlower_last_result";

// ── Messages ─────────────────────────────────────────────────────────────────
const MSG = {
  correct: [
    "La cadena sigue viva.",
    "Radar confirmado. Siguiente duelo.",
    "Buena lectura del mapa.",
    "El dato te da la razón.",
    "Comparación superada.",
  ],
  wrong: [
    "La cadena se ha roto.",
    "El mapa acaba de girar la trampa.",
    "Ese dato venía con colmillo.",
    "Respuesta incorrecta. Misión terminada.",
    "El mundo no perdona una mala comparación.",
  ],
  hotStreak: [
    "Esto ya parece una expedición seria.",
    "La cadena empieza a brillar.",
    "El panel de control está impresionado.",
    "Racha peligrosa. Sigue.",
  ],
};
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];

// ── Data adapters ────────────────────────────────────────────────────────────
function getValidCountriesForCategory(catKey) {
  return Object.entries(countries)
    .filter(([_, c]) => c[catKey] !== null && c[catKey] !== undefined && !isNaN(c[catKey]))
    .map(([code, c]) => ({ code, ...c }));
}

function getValidCategories() {
  return CATEGORIES
    .map(cat => ({
      ...cat,
      validCount: getValidCountriesForCategory(cat.key).length,
    }))
    .filter(cat => cat.validCount >= MIN_COUNTRIES);
}

function getCountryValue(country, catKey) {
  return country[catKey];
}

function formatCategoryValue(value, category) {
  if (value === null || value === undefined) return "—";
  try { return category.format(value); } catch (e) { return String(value); }
}

function getRandomValidCategory() {
  const valid = getValidCategories();
  return valid[Math.floor(Math.random() * valid.length)];
}

// Devuelve [countryA, countryB] con valores diferentes
function pickInitialPair(category) {
  const pool = getValidCountriesForCategory(category.key);
  if (pool.length < 2) return null;
  for (let i = 0; i < 30; i++) {
    const a = pool[Math.floor(Math.random() * pool.length)];
    const b = pool[Math.floor(Math.random() * pool.length)];
    if (a.code !== b.code && a[category.key] !== b[category.key]) return [a, b];
  }
  return null;
}

// Devuelve el siguiente país: distinto del actual y con valor distinto
function getNextCountry(previousCountry, category, usedCodes) {
  const pool = getValidCountriesForCategory(category.key)
    .filter(c => c.code !== previousCountry.code && c[category.key] !== previousCountry[category.key]);
  if (pool.length === 0) return null;

  // Preferir países no usados todavía
  const fresh = pool.filter(c => !usedCodes.includes(c.code));
  const source = fresh.length > 0 ? fresh : pool;
  return source[Math.floor(Math.random() * source.length)];
}

// ── Record storage ───────────────────────────────────────────────────────────
function readRecords() {
  let best = 0;
  let byCat = {};
  try {
    best  = parseInt(localStorage.getItem(RECORD_GLOBAL_KEY) || "0", 10) || 0;
    byCat = JSON.parse(localStorage.getItem(RECORD_CATEGORY_KEY) || "{}") || {};
  } catch (e) {}
  return { best, byCat };
}

function writeRecords({ streak, categoryKey }) {
  try {
    const cur = readRecords();
    if (streak > cur.best) localStorage.setItem(RECORD_GLOBAL_KEY, String(streak));
    if (streak > (cur.byCat[categoryKey] || 0)) {
      const next = { ...cur.byCat, [categoryKey]: streak };
      localStorage.setItem(RECORD_CATEGORY_KEY, JSON.stringify(next));
    }
  } catch (e) {}
}

// ── Share text ───────────────────────────────────────────────────────────────
function buildShareText(streak, category, isRecord) {
  return [
    "🌍 MundoVS — Higher/Lower VS",
    isRecord ? `🔥 Nuevo récord: ${streak}` : `Racha: ${streak}`,
    `Categoría: ${category.label}`,
    "¿Puedes superarme?",
    "mundovs.com/infinito",
  ].join("\n");
}

// ── Main component ───────────────────────────────────────────────────────────
export default function HigherLowerVs() {
  const [mounted,         setMounted]         = useState(false);
  const [gameStatus,      setGameStatus]      = useState("setup"); // setup | playing | reveal | lost
  const [category,        setCategory]        = useState(null);
  const [countryA,        setCountryA]        = useState(null);
  const [countryB,        setCountryB]        = useState(null);
  const [userChoice,      setUserChoice]      = useState(null);
  const [lastResult,      setLastResult]      = useState(null);
  const [streak,          setStreak]          = useState(0);
  const [usedCodes,       setUsedCodes]       = useState([]);
  const [records,         setRecords]         = useState({ best: 0, byCat: {} });
  const [shareCopied,     setShareCopied]     = useState(false);
  const [feedback,        setFeedback]        = useState("");

  const validCategories = useMemo(() => getValidCategories(), []);

  useEffect(() => {
    setMounted(true);
    setRecords(readRecords());
  }, []);

  // Group categories by group for selector
  const grouped = useMemo(() => {
    const g = {};
    validCategories.forEach(c => {
      g[c.group] = g[c.group] || [];
      g[c.group].push(c);
    });
    return g;
  }, [validCategories]);

  function startGame(cat) {
    const pair = pickInitialPair(cat);
    if (!pair) {
      setFeedback("No hay suficientes datos para esta categoría.");
      return;
    }
    setCategory(cat);
    setCountryA(pair[0]);
    setCountryB(pair[1]);
    setUsedCodes([pair[0].code, pair[1].code]);
    setStreak(0);
    setUserChoice(null);
    setLastResult(null);
    setGameStatus("playing");
    setFeedback("");
  }

  function startRandom() {
    const cat = getRandomValidCategory();
    if (cat) startGame(cat);
  }

  function handleChoice(choice) {
    if (gameStatus !== "playing" || !category) return;
    const valueA = getCountryValue(countryA, category.key);
    const valueB = getCountryValue(countryB, category.key);
    const correctChoice = valueA > valueB ? "more" : "less";
    const correct = choice === correctChoice;

    setUserChoice(choice);
    setLastResult({ valueA, valueB, correctChoice, userChoice: choice, correct });

    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      writeRecords({ streak: nextStreak, categoryKey: category.key });
      setRecords(readRecords());
      setFeedback(nextStreak >= 5 && nextStreak % 5 === 0 ? rnd(MSG.hotStreak) : rnd(MSG.correct));
      try { if (navigator.vibrate) navigator.vibrate(25); } catch(e) {}
      setGameStatus("reveal");
    } else {
      setFeedback(rnd(MSG.wrong));
      try { if (navigator.vibrate) navigator.vibrate([20, 60, 20]); } catch(e) {}
      setGameStatus("lost");
      try { localStorage.setItem(LAST_RESULT_KEY, JSON.stringify({ streak, category: category.key, date: Date.now() })); } catch(e) {}
    }
  }

  function nextRound() {
    if (!category || !countryB) return;
    const newA = countryB;
    const newB = getNextCountry(newA, category, usedCodes);
    if (!newB) {
      // Fallback: agotamos opciones, perdemos
      setGameStatus("lost");
      return;
    }
    setUsedCodes([...usedCodes, newB.code]);
    setCountryA(newA);
    setCountryB(newB);
    setUserChoice(null);
    setLastResult(null);
    setGameStatus("playing");
    setFeedback("");
  }

  function restartSameCategory() {
    if (category) startGame(category);
  }

  function changeCategory() {
    setGameStatus("setup");
    setCategory(null);
    setCountryA(null);
    setCountryB(null);
    setStreak(0);
    setUserChoice(null);
    setLastResult(null);
    setUsedCodes([]);
    setFeedback("");
  }

  async function handleShare() {
    if (!category) return;
    const isRecord = streak > 0 && streak === records.best;
    const text = buildShareText(streak, category, isRecord);
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

  if (!mounted) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // SETUP — selector de categoría
  // ─────────────────────────────────────────────────────────────────────────
  if (gameStatus === "setup") {
    return (
      <div className="hlv-wrap">
        <HlvGeoBg />

        <div className="hlv-header">
          <div className="hlv-topbar">
            <span className="hlv-coord">LAT 40.71° N</span>
            <span className="hlv-coord">LON 74.00° W</span>
          </div>
          <div className="hlv-badge">INFINITE_VS · MODO_HIGHER_LOWER</div>
          <h1 className="hlv-title">Higher / Lower VS</h1>
          <p className="hlv-subtitle">
            Compara países sin parar. Una respuesta mal y se acaba la misión.
          </p>

          {records.best > 0 && (
            <div className="hlv-records-summary">
              <span>🏆 RÉCORD GLOBAL: <strong>{records.best}</strong></span>
            </div>
          )}
        </div>

        <div className="hlv-setup">
          <div className="hlv-section-label">ELIGE TU CATEGORÍA</div>

          <button className="hlv-btn-random" onClick={startRandom}>
            🎲 Categoría aleatoria
          </button>

          <div className="hlv-category-groups">
            {Object.entries(grouped).map(([groupId, cats]) => (
              <div key={groupId} className="hlv-cat-group">
                <div className="hlv-cat-group-name">{groupId.toUpperCase()}</div>
                <div className="hlv-cat-list">
                  {cats.map(c => {
                    const best = records.byCat[c.key] || 0;
                    return (
                      <button
                        key={c.key}
                        className="hlv-cat-item"
                        onClick={() => startGame(c)}
                      >
                        <span className="hlv-cat-label">{c.label}</span>
                        {best > 0 && <span className="hlv-cat-best">RÉC: {best}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {feedback && <div className="hlv-error">{feedback}</div>}
        </div>

        <div className="hlv-back">
          <Link href="/">← Volver al menú principal</Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PLAYING / REVEAL
  // ─────────────────────────────────────────────────────────────────────────
  if (gameStatus === "playing" || gameStatus === "reveal") {
    const isReveal = gameStatus === "reveal";
    const recordThisCategory = records.byCat[category.key] || 0;

    return (
      <div className="hlv-wrap">
        <HlvGeoBg />

        {/* Topbar */}
        <div className="hlv-game-topbar">
          <span className="hlv-game-mode">INFINITE_VS</span>
          <span className="hlv-game-cat">{category.label}</span>
        </div>

        {/* Stats row */}
        <div className="hlv-stats-row">
          <div className="hlv-stat-box">
            <div className="hlv-stat-num">{streak}</div>
            <div className="hlv-stat-label">RACHA</div>
          </div>
          <div className="hlv-stat-box">
            <div className="hlv-stat-num">{records.best}</div>
            <div className="hlv-stat-label">RÉCORD GLOBAL</div>
          </div>
          <div className="hlv-stat-box">
            <div className="hlv-stat-num">{recordThisCategory}</div>
            <div className="hlv-stat-label">EN CATEGORÍA</div>
          </div>
        </div>

        {/* Question */}
        <div className="hlv-question-block">
          <div className="hlv-question-label">OBJETIVO DE MISIÓN</div>
          <div className="hlv-question-text">
            ¿<strong>{countryA.name}</strong> tiene más o menos {category.label.toLowerCase()} que <strong>{countryB.name}</strong>?
          </div>
        </div>

        {/* Country cards */}
        <div className="hlv-duel">
          <div className={`hlv-country ${isReveal && lastResult ? (lastResult.valueA > lastResult.valueB ? "hlv-country-winner" : "") : ""}`}>
            <div className="hlv-flag">{countryA.flag}</div>
            <div className="hlv-name">{countryA.name}</div>
            {isReveal && lastResult && (
              <div className="hlv-value">{formatCategoryValue(lastResult.valueA, category)}</div>
            )}
          </div>

          <div className="hlv-vs">
            <div className="hlv-vs-line" />
            <span className="hlv-vs-text">VS</span>
            <div className="hlv-vs-line" />
          </div>

          <div className={`hlv-country ${isReveal && lastResult ? (lastResult.valueB > lastResult.valueA ? "hlv-country-winner" : "") : ""}`}>
            <div className="hlv-flag">{countryB.flag}</div>
            <div className="hlv-name">{countryB.name}</div>
            {isReveal && lastResult && (
              <div className="hlv-value">{formatCategoryValue(lastResult.valueB, category)}</div>
            )}
          </div>
        </div>

        {/* Buttons */}
        {!isReveal && (
          <div className="hlv-choice-row">
            <button className="hlv-choice hlv-choice-more"  onClick={() => handleChoice("more")}>
              <span className="hlv-choice-icon">▲</span>
              <span className="hlv-choice-text">MÁS</span>
            </button>
            <button className="hlv-choice hlv-choice-less" onClick={() => handleChoice("less")}>
              <span className="hlv-choice-icon">▼</span>
              <span className="hlv-choice-text">MENOS</span>
            </button>
          </div>
        )}

        {/* Reveal feedback */}
        {isReveal && lastResult && (
          <>
            <div className="hlv-feedback hlv-feedback-correct">
              ✅ {feedback}
            </div>
            <button className="hlv-btn-next" onClick={nextRound}>
              Siguiente duelo →
            </button>
          </>
        )}

        {/* Back link */}
        <div className="hlv-back">
          <button className="hlv-back-btn" onClick={changeCategory}>
            ← Cambiar categoría
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOST — pantalla final
  // ─────────────────────────────────────────────────────────────────────────
  if (gameStatus === "lost") {
    const isNewRecord = streak > 0 && streak === records.best;
    const recordCat = records.byCat[category?.key] || 0;

    return (
      <div className="hlv-wrap">
        <HlvGeoBg />

        <div className="hlv-game-topbar">
          <span className="hlv-game-mode">CADENA_ROTA</span>
          {category && <span className="hlv-game-cat">{category.label}</span>}
        </div>

        <div className="hlv-result">
          {isNewRecord && (
            <div className="hlv-result-record-badge">🏆 NUEVO RÉCORD</div>
          )}
          <div className="hlv-result-title">Cadena rota</div>
          <div className="hlv-result-streak">{streak}</div>
          <div className="hlv-result-label">comparaciones encadenadas</div>

          <div className="hlv-result-msg">{feedback}</div>

          {lastResult && countryA && countryB && (
            <div className="hlv-result-comparison">
              <div className="hlv-result-comparison-title">Última comparación</div>
              <div className="hlv-result-comparison-row">
                <span>{countryA.flag} {countryA.name}</span>
                <strong>{formatCategoryValue(lastResult.valueA, category)}</strong>
              </div>
              <div className="hlv-result-comparison-row">
                <span>{countryB.flag} {countryB.name}</span>
                <strong>{formatCategoryValue(lastResult.valueB, category)}</strong>
              </div>
            </div>
          )}

          <div className="hlv-result-records">
            <div className="hlv-result-rec-row">
              <span>Récord global</span>
              <strong>{records.best}</strong>
            </div>
            <div className="hlv-result-rec-row">
              <span>Récord en {category?.label}</span>
              <strong>{recordCat}</strong>
            </div>
          </div>
        </div>

        <button className="hlv-btn-next" onClick={restartSameCategory}>
          ⚡ Volver a intentarlo
        </button>
        <button className="hlv-btn-next hlv-btn-ghost" onClick={changeCategory}>
          🔄 Cambiar categoría
        </button>
        <button className="hlv-btn-next hlv-btn-ghost" onClick={handleShare}>
          {shareCopied ? "✅ ¡Copiado!" : "📤 Compartir resultado"}
        </button>

        <div className="hlv-back">
          <Link href="/">Volver al menú principal</Link>
        </div>
      </div>
    );
  }

  return null;
}

// ── Geo background ───────────────────────────────────────────────────────────
function HlvGeoBg() {
  return (
    <div className="hlv-geo-bg" aria-hidden="true">
      <svg width="100%" height="100%" viewBox="0 0 360 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100" x2="360" y2="100" stroke="#1d9e75" strokeWidth=".4" opacity=".06"/>
        <line x1="0" y1="280" x2="360" y2="280" stroke="#1d9e75" strokeWidth=".4" opacity=".05"/>
        <line x1="0" y1="460" x2="360" y2="460" stroke="#1d9e75" strokeWidth=".4" opacity=".04"/>
        <line x1="90"  y1="0" x2="90"  y2="700" stroke="#1d9e75" strokeWidth=".4" opacity=".05"/>
        <line x1="270" y1="0" x2="270" y2="700" stroke="#1d9e75" strokeWidth=".4" opacity=".05"/>
        <path d="M 20 180 Q 120 140 220 200 Q 300 250 350 220" fill="none" stroke="#1d9e75" strokeWidth=".9" opacity=".09" strokeDasharray="4 4" className="hlv-route"/>
        <circle cx="220" cy="200" r="2.2" fill="#1d9e75" opacity=".18" className="hlv-node"/>
        <circle cx="20"  cy="180" r="1.8" fill="#1d9e75" opacity=".14" className="hlv-node hlv-node-b"/>
        <circle cx="350" cy="220" r="1.8" fill="#1d9e75" opacity=".14" className="hlv-node hlv-node-c"/>
      </svg>
    </div>
  );
}
