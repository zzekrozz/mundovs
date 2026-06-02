import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import countries from "../data/countries.json";
import { CATEGORIES } from "../data/categories";
import { trackEvent, EVENTS } from "../lib/analytics";

const MIN_COUNTRIES = 10;
const RECORD_GLOBAL_KEY   = "mundovs_higherlower_best_global";
const RECORD_CATEGORY_KEY = "mundovs_higherlower_best_by_category";
const LAST_RESULT_KEY     = "mundovs_higherlower_last_result";

// ── Microcopy (más variedad) ────────────────────────────────────────────────
const MSG = {
  correct: [
    "La cadena sigue viva.",
    "Radar confirmado. Siguiente duelo.",
    "Buena lectura del mapa.",
    "El dato te da la razón.",
    "Comparación superada.",
    "Coordenadas correctas.",
    "Tu instinto no falla.",
  ],
  wrong: [
    "La cadena se ha roto.",
    "El mapa acaba de girar la trampa.",
    "Ese dato venía con colmillo.",
    "Respuesta incorrecta. Misión terminada.",
    "El mundo no perdona una mala comparación.",
    "El radar te ha engañado.",
    "Casi, pero la realidad va por otro lado.",
  ],
  hotStreak: [
    "Esto ya parece una expedición seria.",
    "La cadena empieza a brillar.",
    "El panel de control está impresionado.",
    "Racha peligrosa. Sigue.",
    "Geógrafo certificado.",
  ],
  tie: [
    "Empate técnico — ese par no cuenta.",
    "Datos idénticos. Pasamos al siguiente.",
    "Saltamos: el mapa repite valores.",
  ],
};
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];

// ── Iconos por grupo de categoría ───────────────────────────────────────────
const GROUP_ICONS = {
  basicos:   "🌍",
  economia:  "💰",
  humanos:   "🧠",
  sociedad:  "🌐",
  poder:     "⚔️",
  cultura:   "🍔",
  geografia: "🗺️",
};
const GROUP_LABELS = {
  basicos:   "Básicos",
  economia:  "Economía",
  humanos:   "Humanos",
  sociedad:  "Sociedad",
  poder:     "Poder",
  cultura:   "Cultura",
  geografia: "Geografía",
};
const GROUP_ORDER = ["basicos", "geografia", "economia", "humanos", "sociedad", "cultura", "poder"];

// ── Data adapters ───────────────────────────────────────────────────────────
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

// Par inicial: dos países distintos y con valores distintos
function pickInitialPair(category) {
  const pool = getValidCountriesForCategory(category.key);
  if (pool.length < 2) return null;
  for (let i = 0; i < 60; i++) {
    const a = pool[Math.floor(Math.random() * pool.length)];
    const b = pool[Math.floor(Math.random() * pool.length)];
    if (a.code !== b.code && a[category.key] !== b[category.key]) return [a, b];
  }
  return null;
}

// Siguiente país: distinto del actual y con valor distinto (mejor sin repetir)
function getNextCountry(previousCountry, category, usedCodes) {
  const pool = getValidCountriesForCategory(category.key)
    .filter(c => c.code !== previousCountry.code && c[category.key] !== previousCountry[category.key]);
  if (pool.length === 0) return null;
  const fresh = pool.filter(c => !usedCodes.includes(c.code));
  const source = fresh.length > 0 ? fresh : pool;
  return source[Math.floor(Math.random() * source.length)];
}

// ── Récords ─────────────────────────────────────────────────────────────────
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

// ── Share text ──────────────────────────────────────────────────────────────
function buildShareText(streak, category, isRecord) {
  return [
    "🌍 MundoVS — Modo Infinito",
    isRecord ? `🏆 Nuevo récord: ${streak}` : `Racha: ${streak}`,
    `Categoría: ${category.label}`,
    "¿Puedes superarme?",
    "mundovs.com/infinito",
  ].join("\n");
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════
export default function HigherLowerVs() {
  const [mounted,     setMounted]     = useState(false);
  const [gameStatus,  setGameStatus]  = useState("setup"); // setup | playing | reveal | lost
  const [category,    setCategory]    = useState(null);
  const [countryA,    setCountryA]    = useState(null); // país de referencia (su valor está revelado)
  const [countryB,    setCountryB]    = useState(null); // país a comparar
  const [userChoice,  setUserChoice]  = useState(null); // "more" | "less"
  const [lastResult,  setLastResult]  = useState(null);
  const [streak,      setStreak]      = useState(0);
  const [usedCodes,   setUsedCodes]   = useState([]);
  const [records,     setRecords]     = useState({ best: 0, byCat: {} });
  const [shareCopied, setShareCopied] = useState(false);
  const [feedback,    setFeedback]    = useState("");
  const [setupError,  setSetupError]  = useState("");

  const validCategories = useMemo(() => getValidCategories(), []);

  useEffect(() => {
    setMounted(true);
    setRecords(readRecords());
  }, []);

  // Agrupar por familia (basicos, geografia, ...) — orden fijo
  const grouped = useMemo(() => {
    const g = {};
    validCategories.forEach(c => {
      const k = c.group || "otros";
      g[k] = g[k] || [];
      g[k].push(c);
    });
    // ordenamos alfabéticamente dentro de cada grupo
    Object.values(g).forEach(arr => arr.sort((a, b) => a.label.localeCompare(b.label, "es")));
    return g;
  }, [validCategories]);

  // ── Inicio de partida ─────────────────────────────────────────────────────
  function startGame(cat) {
    const pair = pickInitialPair(cat);
    if (!pair) {
      setSetupError("No hay suficientes datos para esta categoría. Prueba con otra.");
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
    setSetupError("");
    trackEvent(EVENTS.INFINITE_MODE_START, { category: cat.key });
    trackEvent(EVENTS.CATEGORY_SELECTED, { category: cat.key, mode: "infinite" });
  }

  function startRandom() {
    const cat = getRandomValidCategory();
    if (cat) startGame(cat);
  }

  // ── Pick MORE/LESS ────────────────────────────────────────────────────────
  function handleChoice(choice) {
    if (gameStatus !== "playing" || !category) return;
    const valueA = getCountryValue(countryA, category.key);
    const valueB = getCountryValue(countryB, category.key);

    // Salvaguarda: empate. No debería pasar por filtrado previo, pero
    // si pasa, no penalizamos: saltamos al siguiente duelo.
    if (valueA === valueB) {
      setFeedback(rnd(MSG.tie));
      // Avanzamos sin sumar racha y sin perder.
      setTimeout(() => skipTieAndAdvance(), 600);
      return;
    }

    // En el juego, A es el de referencia (valor ya revelado).
    // El usuario decide si B tiene MÁS o MENOS que A.
    const correctChoice = valueB > valueA ? "more" : "less";
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
      trackEvent(EVENTS.INFINITE_MODE_CORRECT, { category: category.key, streak: nextStreak });
    } else {
      setFeedback(rnd(MSG.wrong));
      try { if (navigator.vibrate) navigator.vibrate([20, 60, 20]); } catch(e) {}
      setGameStatus("lost");
      trackEvent(EVENTS.INFINITE_MODE_FAIL, { category: category.key, streak });
      try {
        localStorage.setItem(LAST_RESULT_KEY, JSON.stringify({
          streak, category: category.key, date: Date.now(),
        }));
      } catch(e) {}
    }
  }

  // Salto silencioso por empate técnico
  function skipTieAndAdvance() {
    if (!category || !countryB) return;
    // Mantenemos B como referencia y buscamos un nuevo rival
    const newA = countryB;
    const newB = getNextCountry(newA, category, usedCodes);
    if (!newB) {
      setGameStatus("lost");
      return;
    }
    setUsedCodes([...usedCodes, newB.code]);
    setCountryA(newA);
    setCountryB(newB);
    setUserChoice(null);
    setLastResult(null);
    setFeedback("");
    setGameStatus("playing");
  }

  // Siguiente ronda tras acertar
  function nextRound() {
    if (!category || !countryB) return;
    const newA = countryB; // el B pasa a ser referencia
    const newB = getNextCountry(newA, category, usedCodes);
    if (!newB) {
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
    setSetupError("");
  }

  async function handleShare() {
    if (!category) return;
    const isRecord = streak > 0 && streak === records.best;
    const text = buildShareText(streak, category, isRecord);
    trackEvent(EVENTS.SHARE_RESULT, { mode: "infinite", category: category.key, streak });
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch (e) { /* no-op */ }
  }

  if (!mounted) return null;

  // ════════════════════════════════════════════════════════════════════════
  // PANTALLA 1 — SETUP: selector de categoría
  // ════════════════════════════════════════════════════════════════════════
  if (gameStatus === "setup") {
    return (
      <div className="hlv2-wrap">
        <HlvBgPattern />

        <header className="hlv2-setup-header">
          <div className="hlv2-tag">INFINITE_VS</div>
          <h1 className="hlv2-setup-title">Modo Infinito</h1>
          <p className="hlv2-setup-sub">
            Encadena comparaciones sin fin. Elige una categoría y descubre si el
            siguiente país tiene <strong>más</strong> o <strong>menos</strong> que
            el anterior. Un fallo y se acaba la cadena.
          </p>

          <div className="hlv2-records-strip">
            <div className="hlv2-record">
              <span className="hlv2-record-label">Récord global</span>
              <strong className="hlv2-record-num">{records.best || 0}</strong>
            </div>
            <div className="hlv2-record">
              <span className="hlv2-record-label">Categorías</span>
              <strong className="hlv2-record-num">{validCategories.length}</strong>
            </div>
            <div className="hlv2-record">
              <span className="hlv2-record-label">Países</span>
              <strong className="hlv2-record-num">{Object.keys(countries).length}</strong>
            </div>
          </div>

          <button type="button" className="mv-btn mv-btn-gold mv-btn-lg" onClick={startRandom}>
            🎲 Categoría aleatoria
          </button>
        </header>

        <section className="hlv2-cat-section">
          <h2 className="hlv2-cat-section-title">Elige tu categoría</h2>

          {GROUP_ORDER.map(groupId => {
            const cats = grouped[groupId];
            if (!cats || cats.length === 0) return null;
            return (
              <div key={groupId} className="hlv2-group">
                <div className="hlv2-group-head">
                  <span className="hlv2-group-icon">{GROUP_ICONS[groupId] || "•"}</span>
                  <h3 className="hlv2-group-name">{GROUP_LABELS[groupId] || groupId}</h3>
                </div>
                <div className="hlv2-cat-grid">
                  {cats.map(c => {
                    const best = records.byCat[c.key] || 0;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        className="hlv2-cat"
                        onClick={() => startGame(c)}
                      >
                        <span className="hlv2-cat-label">{c.label}</span>
                        <span className="hlv2-cat-meta">
                          <span className="hlv2-cat-count">{c.validCount} países</span>
                          {best > 0 && <span className="hlv2-cat-rec">Récord: {best}</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {setupError && <div className="hlv2-error">{setupError}</div>}
        </section>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // PANTALLA 2 — PLAYING / REVEAL
  // ════════════════════════════════════════════════════════════════════════
  if (gameStatus === "playing" || gameStatus === "reveal") {
    const isReveal = gameStatus === "reveal";
    const recordThisCategory = records.byCat[category.key] || 0;
    const valueALabel = formatCategoryValue(getCountryValue(countryA, category.key), category);
    const valueBLabel = isReveal && lastResult
      ? formatCategoryValue(lastResult.valueB, category)
      : "?";

    return (
      <div className="hlv2-wrap">
        <HlvBgPattern />

        {/* Header partida */}
        <div className="hlv2-game-head">
          <div className="hlv2-tag">INFINITE_VS · {category.label.toUpperCase()}</div>
          <button type="button" className="hlv2-change-btn" onClick={changeCategory}>
            Cambiar categoría
          </button>
        </div>

        {/* Stats row */}
        <div className="hlv2-stats">
          <div className="hlv2-stat">
            <div className="hlv2-stat-num hlv2-stat-streak">{streak}</div>
            <div className="hlv2-stat-label">Racha actual</div>
          </div>
          <div className="hlv2-stat">
            <div className="hlv2-stat-num">{records.best}</div>
            <div className="hlv2-stat-label">Récord global</div>
          </div>
          <div className="hlv2-stat">
            <div className="hlv2-stat-num">{recordThisCategory}</div>
            <div className="hlv2-stat-label">En esta categoría</div>
          </div>
        </div>

        {/* Pregunta principal */}
        <div className="hlv2-question">
          <span className="hlv2-question-pre">¿Crees que</span>
          <strong className="hlv2-question-country">
            <span className="hlv2-question-flag">{countryB.flag}</span> {countryB.name}
          </strong>
          <span className="hlv2-question-pre">tiene más o menos</span>
          <strong className="hlv2-question-cat">{category.label.toLowerCase()}</strong>
          <span className="hlv2-question-pre">que</span>
          <strong className="hlv2-question-country">
            <span className="hlv2-question-flag">{countryA.flag}</span> {countryA.name}
          </strong>
          <span className="hlv2-question-pre">?</span>
        </div>

        {/* Duelo */}
        <div className="hlv2-duel">
          {/* País A — referencia, valor SIEMPRE visible */}
          <div className="hlv2-card hlv2-card-ref">
            <div className="hlv2-card-tag">Referencia</div>
            <div className="hlv2-card-flag">{countryA.flag}</div>
            <div className="hlv2-card-name">{countryA.name}</div>
            <div className="hlv2-card-value">{valueALabel}</div>
            <div className="hlv2-card-cat">{category.label}</div>
          </div>

          {/* Conector VS */}
          <div className="hlv2-vs">
            <span>VS</span>
          </div>

          {/* País B — el desconocido */}
          <div className={
            "hlv2-card hlv2-card-mystery" +
            (isReveal && lastResult ? (lastResult.correct ? " hlv2-card-correct" : " hlv2-card-wrong") : "")
          }>
            <div className="hlv2-card-tag">{isReveal ? "Resultado" : "Por descubrir"}</div>
            <div className="hlv2-card-flag">{countryB.flag}</div>
            <div className="hlv2-card-name">{countryB.name}</div>
            <div className={"hlv2-card-value" + (isReveal ? "" : " hlv2-card-value-hidden")}>
              {valueBLabel}
            </div>
            <div className="hlv2-card-cat">{category.label}</div>
          </div>
        </div>

        {/* Botones MÁS/MENOS */}
        {!isReveal && (
          <div className="hlv2-choices">
            <button
              type="button"
              className="hlv2-choice hlv2-choice-more"
              onClick={() => handleChoice("more")}
              aria-label="Más"
            >
              <span className="hlv2-choice-icon">▲</span>
              <span className="hlv2-choice-text">MÁS</span>
              <span className="hlv2-choice-sub">que {countryA.name}</span>
            </button>
            <button
              type="button"
              className="hlv2-choice hlv2-choice-less"
              onClick={() => handleChoice("less")}
              aria-label="Menos"
            >
              <span className="hlv2-choice-icon">▼</span>
              <span className="hlv2-choice-text">MENOS</span>
              <span className="hlv2-choice-sub">que {countryA.name}</span>
            </button>
          </div>
        )}

        {/* Empate (estado transitorio) */}
        {feedback && !isReveal && (
          <div className="hlv2-feedback hlv2-feedback-tie">{feedback}</div>
        )}

        {/* Reveal */}
        {isReveal && lastResult && (
          <>
            <div className="hlv2-feedback hlv2-feedback-correct">
              ✓ {feedback}
            </div>
            <button type="button" className="mv-btn mv-btn-primary mv-btn-block mv-btn-lg" onClick={nextRound}>
              Siguiente duelo →
            </button>
          </>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // PANTALLA 3 — LOST: final
  // ════════════════════════════════════════════════════════════════════════
  if (gameStatus === "lost") {
    const isNewRecord = streak > 0 && streak === records.best && streak > 0;
    const recordCat = records.byCat[category?.key] || 0;

    return (
      <div className="hlv2-wrap">
        <HlvBgPattern />

        <div className="hlv2-game-head">
          <div className="hlv2-tag hlv2-tag-red">CADENA_ROTA</div>
          {category && <div className="hlv2-end-cat-label">{category.label}</div>}
        </div>

        <div className="hlv2-end-card">
          {isNewRecord && (
            <div className="hlv2-end-record-badge">🏆 NUEVO RÉCORD</div>
          )}
          <div className="hlv2-end-title">{isNewRecord ? "¡Récord superado!" : "Cadena rota"}</div>
          <div className="hlv2-end-streak">{streak}</div>
          <div className="hlv2-end-streak-label">comparaciones encadenadas</div>

          {feedback && <div className="hlv2-end-msg">{feedback}</div>}

          {lastResult && countryA && countryB && (
            <div className="hlv2-end-compare">
              <div className="hlv2-end-compare-title">La comparación que rompió la cadena</div>
              <div className="hlv2-end-compare-row">
                <span className="hlv2-end-compare-flag">{countryA.flag}</span>
                <span className="hlv2-end-compare-name">{countryA.name}</span>
                <strong className="hlv2-end-compare-val">
                  {formatCategoryValue(lastResult.valueA, category)}
                </strong>
              </div>
              <div className="hlv2-end-compare-row">
                <span className="hlv2-end-compare-flag">{countryB.flag}</span>
                <span className="hlv2-end-compare-name">{countryB.name}</span>
                <strong className="hlv2-end-compare-val">
                  {formatCategoryValue(lastResult.valueB, category)}
                </strong>
              </div>
            </div>
          )}

          <div className="hlv2-end-records">
            <div className="hlv2-end-rec">
              <span>Récord global</span>
              <strong>{records.best}</strong>
            </div>
            {category && (
              <div className="hlv2-end-rec">
                <span>Récord en {category.label}</span>
                <strong>{recordCat}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="hlv2-end-actions">
          <button type="button" className="mv-btn mv-btn-primary mv-btn-block mv-btn-lg" onClick={restartSameCategory}>
            ⚡ Volver a intentarlo
          </button>
          <button type="button" className="mv-btn mv-btn-secondary mv-btn-block" onClick={handleShare}>
            {shareCopied ? "✅ Copiado al portapapeles" : "📤 Compartir resultado"}
          </button>
          <button type="button" className="mv-btn mv-btn-secondary mv-btn-block" onClick={changeCategory}>
            🔄 Cambiar categoría
          </button>
          <Link href="/" className="mv-btn mv-btn-ghost mv-btn-block">
            Volver al menú principal
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

// ════════════════════════════════════════════════════════════════════════════
// FONDO DECORATIVO
// ════════════════════════════════════════════════════════════════════════════
function HlvBgPattern() {
  return (
    <div className="hlv2-bg" aria-hidden="true">
      <svg width="100%" height="100%" viewBox="0 0 360 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100" x2="360" y2="100" stroke="var(--mv-green)" strokeWidth=".4" opacity=".06" />
        <line x1="0" y1="280" x2="360" y2="280" stroke="var(--mv-green)" strokeWidth=".4" opacity=".05" />
        <line x1="0" y1="460" x2="360" y2="460" stroke="var(--mv-green)" strokeWidth=".4" opacity=".04" />
        <line x1="90"  y1="0" x2="90"  y2="700" stroke="var(--mv-green)" strokeWidth=".4" opacity=".05" />
        <line x1="270" y1="0" x2="270" y2="700" stroke="var(--mv-green)" strokeWidth=".4" opacity=".05" />
        <path d="M 20 180 Q 120 140 220 200 Q 300 250 350 220" fill="none" stroke="var(--mv-green)" strokeWidth=".9" opacity=".09" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}
