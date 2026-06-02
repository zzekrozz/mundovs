import { useState, useEffect } from "react";
import Link from "next/link";
import countries from "../data/countries.json";
import { CATEGORIES, getAvailableCategories, pickRandom, getWinner, buildViralPhrase, streakMessage, getRandomBackground } from "../data/categories";
import ConfettiLight from "./ConfettiLight";
import CuriosityBox from "./CuriosityBox";
import StreakBadge from "./StreakBadge";
import StatsSidebar from "./StatsSidebar";
import FloatingFlags from "./FloatingFlags";
import AchievementSystem from "./AchievementSystem";
import { sound, SoundToggle } from "./SoundEngine";
import { getCuriosityByContext } from "../data/curiosities";
import { trackEvent, EVENTS } from "../lib/analytics";

// ─── Helper local: amplía streakMessage de categories.js sin tocarlo ────────
// Añade frases intermedias (4, 6, 8, 12) y rota frases en rachas muy largas.
function enrichedStreakMessage(streak) {
  if (streak >= 25) {
    const rotation = [
      "🌍 LEYENDA MUNDIAL",
      "🛰️ FUERA DE ESCALA",
      "🧭 BRÚJULA INMORTAL",
      "🏛️ HALL OF FAME GEOGRÁFICO",
    ];
    return rotation[Math.floor((streak - 25) / 5) % rotation.length];
  }
  if (streak >= 12 && streak < 15) return "⚡ Racha eléctrica";
  if (streak >= 8  && streak < 10) return "🌐 El atlas se rinde";
  if (streak >= 4  && streak < 5)  return "✨ ¡Cuatro al hilo!";
  // Si no encaja en los tramos extra, delegamos al original
  return streakMessage(streak);
}

const TOTAL_ROUNDS = 5;

const POPULAR_MATCHES = [
  { codeA: "ES", codeB: "AR", label: "España vs Argentina" },
  { codeA: "MX", codeB: "CO", label: "México vs Colombia" },
  { codeA: "BR", codeB: "AR", label: "Brasil vs Argentina" },
  { codeA: "US", codeB: "CN", label: "EEUU vs China" },
];

const CATEGORY_GROUP_DEFS = [
  { id: "basicos",   icon: "🌍", name: "Básicos"   },
  { id: "economia",  icon: "💰", name: "Economía"  },
  { id: "humanos",   icon: "🧠", name: "Humanos"   },
  { id: "sociedad",  icon: "🌐", name: "Sociedad"  },
  { id: "poder",     icon: "⚔️", name: "Poder"     },
  { id: "cultura",   icon: "🍔", name: "Cultura"   },
  { id: "geografia", icon: "🗺️", name: "Geografía" },
];
const CATEGORY_GROUPS = CATEGORY_GROUP_DEFS
  .map(group => ({
    ...group,
    count: CATEGORIES.filter(cat => cat.group === group.id).length,
  }))
  .filter(group => group.count > 0);

export default function MundoVs({ initialMode }) {
  const [phase, setPhase] = useState("home"); // home | question | reveal | summary | challenger | challenger-end
  const [mode, setMode] = useState("classic"); // classic | challenger
  const [countryA, setCountryA] = useState(null);
  const [countryB, setCountryB] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPick, setUserPick] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [countryWins, setCountryWins] = useState({ A: 0, B: 0, TIE: 0 });
  const [stepResults, setStepResults] = useState([]);
  const [showPickerFor, setShowPickerFor] = useState(null);

  // Challenger mode
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  
  // Stats for achievements
  const [userStats, setUserStats] = useState({
    totalCorrect: 0,
    bestStreak: 0,
    gamesPlayed: 0,
    perfectGames: 0,
    countriesPlayed: 0,
  });

  // Cargar récord de challenger del navegador
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("mundovs_best_streak");
      if (saved) setBestStreak(parseInt(saved, 10));
      
      // Cargar stats globales
      const stats = window.localStorage.getItem("mundovs_stats");
      if (stats) {
        try {
          setUserStats(JSON.parse(stats));
        } catch(e) {}
      }
    }
  }, []);

  // Auto-arrancar Challenger si viene por prop (desde /challenger)
  useEffect(() => {
    if (initialMode === "challenger" && phase === "home") {
      startChallenger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMode]);

  function startGame(cAcode, cBcode) {
    // Guards defensivos
    if (!cAcode || !cBcode || cAcode === cBcode || !countries[cAcode] || !countries[cBcode]) {
      console.warn("[MundoVs] startGame: códigos inválidos", cAcode, cBcode);
      return;
    }
    const cA = { code: cAcode, ...countries[cAcode] };
    const cB = { code: cBcode, ...countries[cBcode] };
    const available = getAvailableCategories(cA, cB);
    if (!available || available.length === 0) {
      console.warn("[MundoVs] startGame: no hay categorías válidas para este par");
      // Fallback: usar todas las categorías (caso muy raro)
      const fallback = CATEGORIES.slice(0, TOTAL_ROUNDS);
      setMode("classic");
      setCountryA(cA); setCountryB(cB); setSteps(fallback);
      setCurrentStep(0); setUserPick(null); setUserScore(0);
      setCountryWins({ A: 0, B: 0, TIE: 0 }); setStepResults([]);
      setPhase("question");
      return;
    }
    const selected = pickRandom(available, TOTAL_ROUNDS);
    setMode("classic");
    setCountryA(cA); setCountryB(cB); setSteps(selected);
    setCurrentStep(0); setUserPick(null); setUserScore(0);
    setCountryWins({ A: 0, B: 0, TIE: 0 }); setStepResults([]);
    setPhase("question");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
    trackEvent(EVENTS.GAME_START, { mode: "classic", country_a: cAcode, country_b: cBcode });
  }

  function startChallenger() {
    setMode("challenger");
    setStreak(0);
    nextChallenge();
    setPhase("challenger");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
    trackEvent(EVENTS.CHALLENGER_START, {});
  }

  function nextChallenge() {
    const codes = Object.keys(countries);
    let cAcode, cBcode, available, category;
    let attempts = 0;
    do {
      cAcode = codes[Math.floor(Math.random() * codes.length)];
      cBcode = codes[Math.floor(Math.random() * codes.length)];
      while (cBcode === cAcode) cBcode = codes[Math.floor(Math.random() * codes.length)];
      const cA = { code: cAcode, ...countries[cAcode] };
      const cB = { code: cBcode, ...countries[cBcode] };
      available = getAvailableCategories(cA, cB);
      attempts++;
    } while (available.length === 0 && attempts < 10);

    const cA = { code: cAcode, ...countries[cAcode] };
    const cB = { code: cBcode, ...countries[cBcode] };
    category = available[Math.floor(Math.random() * available.length)];
    setCurrentChallenge({ cA, cB, category, userPick: null, revealed: false });
  }

  function handleChallengerPick(pick) {
    if (!currentChallenge || currentChallenge.revealed) return;
    const { cA, cB, category } = currentChallenge;
    const winner = getWinner(cA, cB, category);
    const correct = winner === "TIE" ? true : pick === winner;
    setCurrentChallenge({ ...currentChallenge, userPick: pick, revealed: true, correct, winner });

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("mundovs_best_streak", String(newStreak));
        }
      }
    } else {
      trackEvent(EVENTS.CHALLENGER_FAIL, { streak });
      setTimeout(() => setPhase("challenger-end"), 1500);
    }
  }

  function handlePick(pick) {
    if (phase !== "question") return;
    const step = steps[currentStep];
    // Guard: si por alguna razón no hay step válido en este índice, no procesamos
    if (!step || !countryA || !countryB) {
      console.warn("[MundoVs] handlePick: estado inconsistente, ignorando pick");
      return;
    }
    const winner = getWinner(countryA, countryB, step);
    const correct = winner === "TIE" ? true : pick === winner;
    setUserPick(pick);
    setStepResults(prev => [...prev, { step, winner, userPick: pick, correct }]);
    setCountryWins(prev => ({ ...prev, [winner]: (prev[winner] || 0) + 1 }));
    if (correct) setUserScore(s => s + 1);
    setPhase("reveal");
  }

  function nextStep() {
    // FIX BUG "pantalla en blanco al pulsar Ver Resultados":
    // Antes solo se hacía setPhase("summary"). Ahora, en la última ronda,
    // disparamos el evento de fin de partida ANTES de cambiar de phase, para
    // que el state interno de analytics y stats quede sincronizado. Además
    // dejamos un guard si steps está vacío.
    if (!steps || steps.length === 0) {
      console.warn("[MundoVs] nextStep llamado sin steps. Volviendo al menú.");
      newGame();
      return;
    }
    if (currentStep >= steps.length - 1) {
      // Calculamos el score final que se acaba de actualizar en handlePick.
      // userScore puede aún no incluir la última ronda (batching), por eso
      // miramos también stepResults para tener cuenta exacta.
      const finalCorrect = stepResults.filter(r => r && r.correct).length;
      trackEvent(EVENTS.GAME_COMPLETE, {
        mode: "classic",
        score: finalCorrect,
        total: steps.length,
        country_a: countryA?.code,
        country_b: countryB?.code,
      });
      setPhase("summary");
    } else {
      setCurrentStep(s => s + 1);
      setUserPick(null);
      setPhase("question");
    }
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  function newGame() {
    setPhase("home"); setCountryA(null); setCountryB(null);
    setMode("classic"); setStreak(0); setCurrentChallenge(null);
  }

  function randomMatch() {
    const codes = Object.keys(countries);
    const a = codes[Math.floor(Math.random() * codes.length)];
    let b = codes[Math.floor(Math.random() * codes.length)];
    while (b === a) b = codes[Math.floor(Math.random() * codes.length)];
    startGame(a, b);
  }

  return (
    <div className="app mv-game-dark">
      <AchievementSystem currentStats={userStats} onNewAchievement={(ach) => sound.achievement()} />
      <SoundToggle />
      
      {(phase === "question" || phase === "reveal") && mode === "classic" && (
        <StatsSidebar
          currentStreak={0}
          bestStreak={bestStreak}
          currentRound={currentStep + 1}
          totalRounds={steps.length}
          score={userScore}
          mode="classic"
        />
      )}
      
      {phase === "challenger" && currentChallenge && (
        <StatsSidebar
          currentStreak={streak}
          bestStreak={bestStreak}
          mode="challenger"
        />
      )}
      
      {/* app-nav eliminado — el Layout global ya provee la navegación.
          Mantenemos solo el botón "Volver al inicio del juego" como acción
          contextual si el usuario está dentro de una partida. */}
      {phase !== "home" && (
        <div className="mv-game-back">
          <button
            type="button"
            className="mv-game-back-btn"
            onClick={() => newGame()}
            aria-label="Volver al menú del juego"
          >
            ← Menú del juego
          </button>
        </div>
      )}

      {phase === "home" && (
        <Home
          countryA={countryA}
          countryB={countryB}
          onPickCountry={setShowPickerFor}
          onStart={() => countryA && countryB && startGame(countryA.code, countryB.code)}
          onRandom={randomMatch}
          onPopular={(a, b) => startGame(a, b)}
          onChallenger={startChallenger}
          bestStreak={bestStreak}
        />
      )}

      {(phase === "question" || phase === "reveal" || phase === "summary") && countryA && countryB && (
        <Game
          countryA={countryA}
          countryB={countryB}
          steps={steps}
          currentStep={currentStep}
          phase={phase}
          userPick={userPick}
          userScore={userScore}
          countryWins={countryWins}
          stepResults={stepResults}
          onPick={handlePick}
          onNext={nextStep}
          onNewGame={newGame}
          onReplay={() => startGame(countryA.code, countryB.code)}
        />
      )}

      {phase === "challenger" && currentChallenge && (
        <Challenger
          challenge={currentChallenge}
          streak={streak}
          bestStreak={bestStreak}
          onPick={handleChallengerPick}
          onNext={nextChallenge}
        />
      )}

      {phase === "challenger-end" && (
        <ChallengerEnd
          streak={streak}
          bestStreak={bestStreak}
          onRestart={startChallenger}
          onHome={newGame}
        />
      )}

      {showPickerFor && (
        <CountryPicker
          onSelect={(code) => {
            if (showPickerFor === "A") setCountryA({ code, ...countries[code] });
            else setCountryB({ code, ...countries[code] });
            setShowPickerFor(null);
            trackEvent(EVENTS.COUNTRY_SELECTED, { country: code, slot: showPickerFor });
          }}
          onClose={() => setShowPickerFor(null)}
          excludeCode={showPickerFor === "A" ? countryB?.code : countryA?.code}
        />
      )}

      {/* app-footer eliminado — el Layout global ya provee el footer
          con todos los enlaces legales y de proyecto. */}
    </div>
  );
}

function Home({ countryA, countryB, onPickCountry, onStart, onRandom, onPopular, onChallenger, bestStreak }) {
  const cA = countryA || { flag: "🌍", name: "Selecciona país" };
  const cB = countryB || { flag: "🌍", name: "Selecciona país" };
  return (
    <>
      <div className="hero">
        <span className="hero-tag">Juego de geografía</span>
        <h1 className="hero-title">¿Crees que conoces el mundo?<br /><em>Demuéstralo.</em></h1>
        <p className="hero-sub">Compara dos países en 5 categorías sorpresa. Adivina quién gana en cada una.</p>
      </div>

      {/* Modo Challenger destacado */}
      <div className="challenger-promo" onClick={onChallenger}>
        <div className="challenger-promo-content">
          <div className="challenger-promo-tag">⚡ MODO CHALLENGER</div>
          <div className="challenger-promo-title">Aciertos infinitos hasta el primer fallo</div>
          <div className="challenger-promo-sub">{bestStreak > 0 ? `Tu récord: ${bestStreak} seguidas` : "¿Cuántas conseguirás de seguidas?"}</div>
        </div>
        <div className="challenger-promo-arrow">→</div>
      </div>

      <div className="selector-card">
        <div className="selector-mode-label">Modo clásico — 5 rondas</div>
        <div className="selector-row">
          <div className="selector-block">
            <span className="selector-label">País A</span>
            <button className="country-pick" onClick={() => onPickCountry("A")}>
              <span className="pflag">{cA.flag}</span>
              <span className="pname">{cA.name}</span>
              <span className="pchev">▼</span>
            </button>
          </div>
          <span className="vs-badge">VS</span>
          <div className="selector-block">
            <span className="selector-label">País B</span>
            <button className="country-pick" onClick={() => onPickCountry("B")}>
              <span className="pflag">{cB.flag}</span>
              <span className="pname">{cB.name}</span>
              <span className="pchev">▼</span>
            </button>
          </div>
        </div>
        <div className="selector-actions">
          <button className="btn-primary" onClick={onStart} disabled={!countryA || !countryB}>▶ Empezar partida</button>
          <button className="btn-ghost" onClick={onRandom}>🎲 Aleatorio</button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-bar-cell"><div className="stat-bar-num">{Object.keys(countries).length}</div><div className="stat-bar-label">Países</div></div>
        <div className="stat-bar-cell"><div className="stat-bar-num"><em>{CATEGORIES.length}</em></div><div className="stat-bar-label">Datos</div></div>
        <div className="stat-bar-cell"><div className="stat-bar-num">∞</div><div className="stat-bar-label">Combinaciones</div></div>
      </div>

      <div className="section">
        <div className="section-head"><h2 className="section-title">🔥 Comparaciones populares</h2></div>
        <div className="popular-grid">
          {POPULAR_MATCHES.map((m) => {
            const a = countries[m.codeA];
            const b = countries[m.codeB];
            return (
              <button key={m.codeA + m.codeB} className="popular-card" onClick={() => onPopular(m.codeA, m.codeB)}>
                <div className="popular-flags">
                  <span>{a.flag}</span>
                  <span className="popular-vs">vs</span>
                  <span>{b.flag}</span>
                </div>
                <div className="popular-name">{m.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2 className="section-title">📊 Categorías de datos</h2></div>
        <div className="cats-grid">
          {CATEGORY_GROUPS.map((g) => (
            <div key={g.id} className="cat-card">
              <span className="cat-icon">{g.icon}</span>
              <div className="cat-name">{g.name}</div>
              <div className="cat-count">{g.count} datos</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2 className="section-title">¿Cómo funciona?</h2></div>
        <div className="how-grid">
          <div className="how-step">
            <div className="how-num">1</div>
            <div className="how-title">Elige países</div>
            <div className="how-desc">Selecciona dos países o juega con uno aleatorio</div>
          </div>
          <div className="how-step">
            <div className="how-num">2</div>
            <div className="how-title">Adivina y aprende</div>
            <div className="how-desc">5 rondas con datos sorpresa de la base</div>
          </div>
          <div className="how-step">
            <div className="how-num">3</div>
            <div className="how-title">Comparte tu score</div>
            <div className="how-desc">Reta a tus amigos a superarte</div>
          </div>
        </div>
      </div>
    </>
  );
}

function CountryPicker({ onSelect, onClose, excludeCode }) {
  const [search, setSearch] = useState("");

  // Bloquear scroll del body mientras el modal está abierto + cerrar con ESC
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.add("mv-no-scroll");
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("mv-no-scroll");
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const q = norm(search.trim());
  const list = Object.entries(countries)
    .filter(([code]) => code !== excludeCode)
    .filter(([_, c]) => !q || norm(c.name).includes(q))
    .sort(([_, a], [__, b]) => a.name.localeCompare(b.name, "es"));

  return (
    <div
      className="picker-back"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Selecciona un país"
    >
      <div className="picker" onClick={e => e.stopPropagation()}>
        <div className="picker-head">
          <span className="picker-title">Elige un país</span>
          <button className="picker-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <input
          type="text"
          className="picker-search"
          placeholder="Buscar país…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        <div className="picker-list">
          {list.length === 0 && (
            <div style={{ padding: "1rem", fontSize: 13, color: "var(--mv-text-dim)", textAlign: "center" }}>
              Ningún país coincide con esa búsqueda.
            </div>
          )}
          {list.map(([code, c]) => (
            <button
              key={code}
              type="button"
              className="picker-item"
              onClick={() => onSelect(code)}
            >
              <span className="iflag">{c.flag}</span><span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DuelCards({ cA, cB, step, phase, userPick, result, onPick, showValues }) {
  function cardClass(slot) {
    const base = "mv-duel-card";
    if (phase !== "reveal" || !result) return base;
    if (userPick === slot) return base + (result.correct ? " mv-duel-correct" : " mv-duel-wrong");
    if (result.winner === slot) return base + " mv-duel-winner";
    return base + " mv-duel-dim";
  }

  const va = cA[step.key];
  const vb = cB[step.key];

  return (
    <div className="mv-duel-arena">
      <button
        className={cardClass("A")}
        onClick={() => onPick("A")}
        disabled={phase === "reveal"}
        aria-label={`Elegir ${cA.name}`}
      >
        <span className="mv-duel-flag">{cA.flag}</span>
        <span className="mv-duel-name">{cA.name}</span>
        {showValues && <span className="mv-duel-val">{step.format(va)}</span>}
      </button>

      <div className="mv-duel-vs" aria-hidden="true">
        <div className="mv-duel-vs-line" />
        <span className="mv-duel-vs-text">VS</span>
        <div className="mv-duel-vs-line" />
      </div>

      <button
        className={cardClass("B")}
        onClick={() => onPick("B")}
        disabled={phase === "reveal"}
        aria-label={`Elegir ${cB.name}`}
      >
        <span className="mv-duel-flag">{cB.flag}</span>
        <span className="mv-duel-name">{cB.name}</span>
        {showValues && <span className="mv-duel-val">{step.format(vb)}</span>}
      </button>
    </div>
  );
}

function Game({ countryA, countryB, steps, currentStep, phase, userPick, userScore, countryWins, stepResults, onPick, onNext, onNewGame, onReplay }) {
  // ── Todos los hooks SIEMPRE antes de cualquier return condicional ──
  const [showConfetti, setShowConfetti] = useState(false);

  const isSummary = phase === "summary";
  const step   = !isSummary && steps[currentStep] ? steps[currentStep] : null;
  const result = !isSummary && stepResults ? stepResults[currentStep] : null;
  const va = step && countryA ? countryA[step.key] : 0;
  const vb = step && countryB ? countryB[step.key] : 0;

  useEffect(() => {
    if (isSummary || !result) return;
    if (result.correct) {
      setShowConfetti(true);
      sound.correct();
      try { if (navigator.vibrate) navigator.vibrate(30); } catch(e) {}
    } else {
      sound.wrong();
      try { if (navigator.vibrate) navigator.vibrate([15, 50, 15]); } catch(e) {}
    }
  }, [result, isSummary]);

  // Return condicional DESPUÉS de todos los hooks
  if (isSummary) return <Summary cA={countryA} cB={countryB} userScore={userScore} totalSteps={steps.length} countryWins={countryWins} stepResults={stepResults} onNewGame={onNewGame} onReplay={onReplay} />;
  if (!step) return null;

  return (
    <div className="game-wrap mv-game-dark">
      <ConfettiLight show={showConfetti} />

      {/* Barra superior: modo + progreso */}
      <div className="mv-game-topbar">
        <span className="mv-game-mode-label">VERSUS_MODE · DUELO GEOGRÁFICO</span>
        <span className="mv-game-score">✓ {userScore}/{currentStep + (phase === "reveal" ? 1 : 0)}</span>
      </div>

      <div className="progress-wrap mv-progress-dark">
        <span className="progress-label">Ronda {currentStep + 1}/{steps.length}</span>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${(currentStep / steps.length) * 100}%` }} /></div>
        <div className="score-dots">
          {steps.map((_, i) => { const r = stepResults[i]; return <div key={i} className={`dot${r ? r.correct ? " correct" : " wrong" : ""}`} />; })}
        </div>
      </div>

      {/* Pregunta ANTES de las cards */}
      <div className="mv-question-block">
        <div className="mv-question-label">OBJETIVO DE MISIÓN</div>
        <div className="mv-question-text">{step.question}</div>
      </div>

      {/* Cards clickables — un solo lugar con banderas */}
      <DuelCards
        cA={countryA}
        cB={countryB}
        step={step}
        phase={phase}
        userPick={userPick}
        result={result}
        onPick={onPick}
        showValues={phase === "reveal"}
      />

      {phase === "reveal" && (
        <Reveal
          cA={countryA} cB={countryB}
          step={step} va={va} vb={vb}
          result={result}
          countryWins={countryWins}
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={onNext}
        />
      )}
    </div>
  );
}

function Reveal({ cA, cB, step, va, vb, result, countryWins, currentStep, totalSteps, onNext }) {
  const [pctA, setPctA] = useState(0);
  const [pctB, setPctB] = useState(0);
  const mx = Math.max(va, vb) || 1;

  useEffect(() => {
    setPctA(0); setPctB(0);
    const t = setTimeout(() => { setPctA(Math.round((va / mx) * 100)); setPctB(Math.round((vb / mx) * 100)); }, 50);
    return () => clearTimeout(t);
  }, [va, vb, currentStep]);

  const winner = result.winner;
  const winnerName = winner === "TIE" ? "Empate técnico" : winner === "A" ? `${cA.flag} ${cA.name}` : `${cB.flag} ${cB.name}`;

  return (
    <>
      <div className="bars-card">
        <div className="bar-row"><span className="bar-flag">{cA.flag}</span><span className="bar-name">{cA.name}</span><div className="bar-track"><div className="bar-fill bar-a" style={{ width: `${pctA}%` }} /></div><span className="bar-val">{step.format(va)}</span></div>
        <div className="bar-row"><span className="bar-flag">{cB.flag}</span><span className="bar-name">{cB.name}</span><div className="bar-track"><div className="bar-fill bar-b" style={{ width: `${pctB}%` }} /></div><span className="bar-val">{step.format(vb)}</span></div>
      </div>
      <div className={`feedback ${result.correct ? "fb-correct" : "fb-wrong"}`}>{result.correct ? "✓ ¡Correcto!" : "✗ Fallaste"} — Gana: {winnerName}</div>
      <CuriosityBox 
        text={getCuriosityByContext(step, cA, cB)} 
        icon={result.correct ? "🔥" : "💡"} 
        category={step.group}
        variant={result.correct ? "surprise" : "info"}
      />
      <div className="scoreboard">
        <div className="score-box"><div className="score-box-label">{cA.flag} {cA.name}</div><div className="score-box-num green">{countryWins.A}</div></div>
        <div className="score-box"><div className="score-box-label">{cB.flag} {cB.name}</div><div className="score-box-num blue">{countryWins.B}</div></div>
      </div>
      {currentStep === 2 && <AdSlot />}
      <button className="btn-next" onClick={onNext}>{currentStep === totalSteps - 1 ? "Ver resultado final →" : "Siguiente →"}</button>
    </>
  );
}

function Summary({ cA, cB, userScore, totalSteps, countryWins, stepResults, onNewGame, onReplay }) {
  // ── Blindaje contra estados inconsistentes ────────────────────────
  const safeResults = Array.isArray(stepResults) ? stepResults.filter(r => r && r.step) : [];
  const safeWins = countryWins && typeof countryWins === "object"
    ? { A: countryWins.A || 0, B: countryWins.B || 0, TIE: countryWins.TIE || 0 }
    : { A: 0, B: 0, TIE: 0 };
  const [shareCopied, setShareCopied] = useState(false);

  if (!cA || !cB) {
    return (
      <div className="game-wrap mv-game-dark">
        <div className="mv-game-topbar">
          <span className="mv-game-mode-label">VERSUS_MODE · RESULTADO</span>
        </div>
        <div className="summary-card mv5-summary" style={{ textAlign: "center", padding: "2rem 1rem" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🛰️</div>
          <div style={{ marginBottom: 12, color: "var(--mv-text)" }}>
            Hemos perdido la señal de la partida.
          </div>
          <div style={{ fontSize: 13, color: "var(--mv-text-dim)", marginBottom: 16 }}>
            Vuelve al menú y arranca una nueva comparación.
          </div>
          <button className="mv-btn mv-btn-primary mv-btn-block" onClick={onNewGame}>Volver al menú</button>
        </div>
      </div>
    );
  }

  const overall = safeWins.A > safeWins.B ? "A" : safeWins.B > safeWins.A ? "B" : "TIE";
  const winC = overall === "A" ? cA : overall === "B" ? cB : null;
  const safeScore = Number.isFinite(userScore) ? userScore : 0;
  const safeTotal = Number.isFinite(totalSteps) && totalSteps > 0 ? totalSteps : (safeResults.length || 5);

  // Badge ganador: verde si has acertado ≥3, dorado si exactamente la mitad-1, rojo si todo fallo
  const isPerfect = safeScore === safeTotal;
  const badgeKind = safeScore >= Math.ceil(safeTotal * 0.6)
    ? "good"
    : safeScore >= Math.floor(safeTotal * 0.4)
      ? "ok"
      : "bad";
  const badgeTxt = isPerfect
    ? "🏆 PARTIDA PERFECTA"
    : badgeKind === "good"
      ? "🟢 BUEN OJO GEOGRÁFICO"
      : badgeKind === "ok"
        ? "🟡 INTUICIÓN A MEDIAS"
        : "🔴 EL MAPA TE GANA HOY";

  const urMsg = isPerfect
    ? `Pleno absoluto: ${safeScore}/${safeTotal}. El mapa se rinde.`
    : safeScore >= Math.ceil(safeTotal * 0.6)
      ? `Acertaste ${safeScore} de ${safeTotal}. Geografía sólida.`
      : safeScore >= Math.floor(safeTotal * 0.4)
        ? `${safeScore}/${safeTotal} acertadas. Cerca, pero el mundo se resiste.`
        : `Solo ${safeScore}/${safeTotal}. Toca volver al atlas.`;

  async function shareResult() {
    const winnerText = winC ? `${winC.flag} ${winC.name} ganó` : "Hubo empate";
    const txt = `🌍 Acerté ${safeScore}/${safeTotal} en ${cA.flag} ${cA.name} vs ${cB.flag} ${cB.name}\n${winnerText} la comparación.\n\n¿Puedes superarme? 👉 mundovs.com`;
    trackEvent(EVENTS.SHARE_RESULT, { mode: "classic", country_a: cA.code, country_b: cB.code, score: safeScore });
    try {
      if (navigator.share) {
        await navigator.share({ text: txt });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(txt);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch (e) { /* no-op */ }
  }

  return (
    <div className="game-wrap mv-game-dark">
      <div className="mv-game-topbar">
        <span className="mv-game-mode-label">VERSUS_MODE · RESULTADO FINAL</span>
        <span className="mv-game-score">{cA.flag} vs {cB.flag}</span>
      </div>

      <div className={`summary-card mv5-summary mv5-summary-${badgeKind}`}>
        <div className={`mv5-summary-badge mv5-summary-badge-${badgeKind}`}>{badgeTxt}</div>

        <div className="mv5-summary-head">Resultado final</div>

        <div className="big-score mv5-big-score">
          <div className={`big-cell mv5-big-cell${overall === "A" ? " winner" : ""}`}>
            <span className="big-flag">{cA.flag}</span>
            <div className="big-name">{cA.name}</div>
            <div className="big-pts">{safeWins.A}</div>
            <div className="mv5-big-label">categorías</div>
          </div>
          <div className="vs-divider mv5-vs">vs</div>
          <div className={`big-cell mv5-big-cell${overall === "B" ? " winner" : ""}`}>
            <span className="big-flag">{cB.flag}</span>
            <div className="big-name">{cB.name}</div>
            <div className="big-pts">{safeWins.B}</div>
            <div className="mv5-big-label">categorías</div>
          </div>
        </div>

        {winC ? (
          <div className="mv5-winner-line">
            <span className="mv5-winner-flag">{winC.flag}</span>
            <span><strong>{winC.name}</strong> gana la comparación general</span>
          </div>
        ) : (
          <div className="mv5-winner-line">¡Empate entre los dos países!</div>
        )}

        {safeResults.length > 0 && (
          <div className="mv5-recap">
            <div className="mv5-recap-title">Desglose por categoría</div>
            {safeResults.map((r, i) => {
              const wname = r.winner === "A" ? `${cA.flag} ${cA.name}`
                          : r.winner === "B" ? `${cB.flag} ${cB.name}`
                          : "Empate";
              const label = r.step && r.step.label ? r.step.label : `Ronda ${i + 1}`;
              return (
                <div key={i} className="mv5-recap-row">
                  <div className={`mv5-recap-dot ${r.correct ? "mv5-dot-ok" : "mv5-dot-fail"}`}>
                    {r.correct ? "✓" : "✗"}
                  </div>
                  <div className="mv5-recap-main">
                    <div className="mv5-recap-cat">{label}</div>
                    <div className="mv5-recap-win">Ganador: {wname}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mv5-user-result">{urMsg}</div>
      </div>

      <div className="mv5-actions">
        <button className="mv-btn mv-btn-primary mv-btn-block mv-btn-lg" onClick={shareResult}>
          {shareCopied ? "✅ Copiado al portapapeles" : "📤 Compartir resultado"}
        </button>
        <button className="mv-btn mv-btn-secondary mv-btn-block" onClick={onReplay}>
          🔄 Repetir con estos mismos países
        </button>
        <button className="mv-btn mv-btn-secondary mv-btn-block" onClick={onNewGame}>
          ⚡ Nueva comparación
        </button>
      </div>

      <div className="mv5-cross">
        <div className="mv5-cross-title">¿Quieres más?</div>
        <div className="mv5-cross-grid">
          <Link href="/pais-del-dia" className="mv5-cross-card">
            <span className="mv5-cross-icon">📡</span>
            <span className="mv5-cross-name">País del día</span>
            <span className="mv5-cross-sub">Reto diario</span>
          </Link>
          <Link href="/challenger" className="mv5-cross-card">
            <span className="mv5-cross-icon">⚡</span>
            <span className="mv5-cross-name">Challenger</span>
            <span className="mv5-cross-sub">Racha infinita</span>
          </Link>
          <Link href="/infinito" className="mv5-cross-card">
            <span className="mv5-cross-icon">♾️</span>
            <span className="mv5-cross-name">Infinito</span>
            <span className="mv5-cross-sub">Más o menos</span>
          </Link>
        </div>
      </div>

      <AdSlot />
    </div>
  );
}

function Challenger({ challenge, streak, bestStreak, onPick, onNext }) {
  const { cA, cB, category, userPick, revealed, correct, winner } = challenge;
  const streakMsg = enrichedStreakMessage(streak);

  const fakeResult = revealed ? { correct, winner, userPick } : null;
  const fakePhase = revealed ? "reveal" : "question";

  return (
    <div className="game-wrap mv-game-dark">

      {/* Modo label */}
      <div className="mv-game-topbar">
        <span className="mv-game-mode-label">ENDLESS_MODE · MISIÓN INFINITA</span>
        {streakMsg && <span className="mv6-streak-pill">{streakMsg}</span>}
      </div>

      {/* Barra de racha v6 — 3 stats coherentes con el resto del juego */}
      <div className="mv6-stats">
        <div className="mv6-stat">
          <div className="mv6-stat-num mv6-stat-streak">{streak}</div>
          <div className="mv6-stat-label">Racha actual</div>
        </div>
        <div className="mv6-stat">
          <div className="mv6-stat-num">{bestStreak}</div>
          <div className="mv6-stat-label">Tu récord</div>
        </div>
        <div className="mv6-stat">
          <div className="mv6-stat-num">{streak > 0 && streak === bestStreak ? "🔥" : "—"}</div>
          <div className="mv6-stat-label">{streak > 0 && streak === bestStreak ? "Récord vivo" : "Sigue"}</div>
        </div>
      </div>

      {/* Pregunta primero */}
      <div className="mv-question-block">
        <div className="mv-question-label">OBJETIVO DE MISIÓN</div>
        <div className="mv-question-text">{category.question}</div>
      </div>

      {/* Cards clickables — banderas una sola vez */}
      <DuelCards
        cA={cA}
        cB={cB}
        step={category}
        phase={fakePhase}
        userPick={userPick}
        result={fakeResult}
        onPick={onPick}
        showValues={revealed}
      />

      {revealed && (
        <>
          <div className={`feedback ${correct ? "fb-correct" : "fb-wrong"}`}>
            {correct ? `✓ ¡Correcto! Racha: ${streak}` : "✗ Fallaste — Fin de la partida"}
          </div>
          <div className="viral">{buildViralPhrase(cA, cB, category)}</div>
          {correct && (
            <button className="mv-btn mv-btn-primary mv-btn-block mv-btn-lg" onClick={onNext}>
              Siguiente duelo →
            </button>
          )}
        </>
      )}
    </div>
  );
}

function ChallengerEnd({ streak, bestStreak, onRestart, onHome }) {
  const [shareCopied, setShareCopied] = useState(false);
  const isNewRecord = streak === bestStreak && streak > 0;

  // Kind del resultado para badge + acento
  let kind = "fail";              // racha 0
  if (isNewRecord) kind = "record";
  else if (streak >= 5) kind = "hot";
  else if (streak >= 1) kind = "ok";

  const badge = kind === "record" ? { txt: "🏆 NUEVO RÉCORD",     cls: "mv6-end-badge-record" }
              : kind === "hot"    ? { txt: "🔥 EN RACHA",          cls: "mv6-end-badge-hot"    }
              : kind === "ok"     ? { txt: "🎯 RACHA TERMINADA",   cls: "mv6-end-badge-ok"     }
              :                     { txt: "💀 PRIMER FALLO",      cls: "mv6-end-badge-fail"   };

  const title = isNewRecord ? "¡Lo has conseguido!"
              : streak === 0 ? "Cadena cortada al primer intento"
              : "Fin de la partida";

  async function shareStreak() {
    const txt = `⚡ Conseguí ${streak} comparaciones seguidas en MundoVs Challenger${isNewRecord ? " 🏆 ¡NUEVO RÉCORD!" : ""}\n\n¿Puedes superarme? 👉 mundovs.com/challenger`;
    trackEvent(EVENTS.SHARE_RESULT, { mode: "challenger", streak });
    try {
      if (navigator.share) {
        await navigator.share({ text: txt });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(txt);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch (e) { /* no-op */ }
  }

  const streakMsg = enrichedStreakMessage(streak);

  return (
    <div className="game-wrap mv-game-dark">

      {/* Barra superior */}
      <div className="mv-game-topbar">
        <span className="mv-game-mode-label">CHALLENGER_MODE · MISIÓN FINALIZADA</span>
      </div>

      {/* Card resultado v6 */}
      <div className={`mv6-end mv6-end-${kind}`}>
        <div className={`mv6-end-badge ${badge.cls}`}>{badge.txt}</div>
        <div className="mv6-end-title">{title}</div>

        <div className="mv6-end-streak-wrap">
          <div className="mv6-end-streak">{streak}</div>
          <div className="mv6-end-streak-label">
            {streak === 1 ? "acierto encadenado" : "aciertos encadenados"}
          </div>
        </div>

        {streakMsg && <div className="mv6-end-msg">{streakMsg}</div>}

        {/* Mini-stats: récord personal */}
        <div className="mv6-end-stats">
          <div className="mv6-end-stat">
            <span className="mv6-end-stat-label">Tu récord</span>
            <strong className="mv6-end-stat-val">{bestStreak}</strong>
          </div>
          <div className="mv6-end-stat">
            <span className="mv6-end-stat-label">Esta partida</span>
            <strong className="mv6-end-stat-val">{streak}</strong>
          </div>
          <div className="mv6-end-stat">
            <span className="mv6-end-stat-label">Diferencia</span>
            <strong className="mv6-end-stat-val">
              {isNewRecord ? "+0" : `-${bestStreak - streak}`}
            </strong>
          </div>
        </div>
      </div>

      {/* Acciones primarias */}
      <div className="mv6-end-actions">
        <button className="mv-btn mv-btn-primary mv-btn-block mv-btn-lg" onClick={onRestart}>
          ⚡ Volver a intentarlo
        </button>
        <button className="mv-btn mv-btn-secondary mv-btn-block" onClick={shareStreak}>
          {shareCopied ? "✅ Copiado al portapapeles" : "📤 Compartir mi récord"}
        </button>
        <button className="mv-btn mv-btn-ghost mv-btn-block" onClick={onHome}>
          Volver al inicio
        </button>
      </div>

      {/* Cross-mode */}
      <div className="mv6-cross">
        <div className="mv6-cross-title">¿Otra forma de jugar?</div>
        <div className="mv6-cross-grid">
          <Link href="/pais-del-dia" className="mv6-cross-card">
            <span className="mv6-cross-icon">📡</span>
            <span className="mv6-cross-name">País del día</span>
            <span className="mv6-cross-sub">Reto diario</span>
          </Link>
          <Link href="/clasico" className="mv6-cross-card">
            <span className="mv6-cross-icon">🆚</span>
            <span className="mv6-cross-name">Clásico</span>
            <span className="mv6-cross-sub">5 rondas</span>
          </Link>
          <Link href="/infinito" className="mv6-cross-card">
            <span className="mv6-cross-icon">♾️</span>
            <span className="mv6-cross-name">Infinito</span>
            <span className="mv6-cross-sub">Más o menos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdSlot() {
  return (
    <div className="ad-slot">
      <div className="ad-label">Publicidad</div>
      <div style={{ fontSize: 12, color: "var(--mv-text-muted)" }}>— Espacio publicitario —</div>
    </div>
  );
}
