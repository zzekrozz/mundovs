import { useState, useEffect } from "react";
import Link from "next/link";
import countries from "../data/countries.json";
import { CATEGORIES, getAvailableCategories, pickRandom, getWinner, buildViralPhrase, streakMessage } from "../data/categories";

const TOTAL_ROUNDS = 5;

const POPULAR_MATCHES = [
  { codeA: "ES", codeB: "AR", label: "España vs Argentina" },
  { codeA: "MX", codeB: "CO", label: "México vs Colombia" },
  { codeA: "BR", codeB: "AR", label: "Brasil vs Argentina" },
  { codeA: "US", codeB: "CN", label: "EEUU vs China" },
];

const CATEGORY_GROUPS = [
  { id: "basicos", icon: "🌍", name: "Básicos", count: 3 },
  { id: "economia", icon: "💰", name: "Economía", count: 4 },
  { id: "humanos", icon: "🧠", name: "Humanos", count: 4 },
  { id: "sociedad", icon: "🌐", name: "Sociedad", count: 2 },
  { id: "poder", icon: "⚔️", name: "Poder", count: 2 },
  { id: "cultura", icon: "🍔", name: "Cultura", count: 5 },
];

export default function MundoVs() {
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

  // Cargar récord de challenger del navegador
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("mundovs_best_streak");
      if (saved) setBestStreak(parseInt(saved, 10));
    }
  }, []);

  function startGame(cAcode, cBcode) {
    const cA = { code: cAcode, ...countries[cAcode] };
    const cB = { code: cBcode, ...countries[cBcode] };
    const available = getAvailableCategories(cA, cB);
    const selected = pickRandom(available, TOTAL_ROUNDS);
    setMode("classic");
    setCountryA(cA); setCountryB(cB); setSteps(selected);
    setCurrentStep(0); setUserPick(null); setUserScore(0);
    setCountryWins({ A: 0, B: 0, TIE: 0 }); setStepResults([]);
    setPhase("question");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  function startChallenger() {
    setMode("challenger");
    setStreak(0);
    nextChallenge();
    setPhase("challenger");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
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
      setTimeout(() => setPhase("challenger-end"), 1500);
    }
  }

  function handlePick(pick) {
    if (phase !== "question") return;
    const step = steps[currentStep];
    const winner = getWinner(countryA, countryB, step);
    const correct = winner === "TIE" ? true : pick === winner;
    setUserPick(pick);
    setStepResults(prev => [...prev, { step, winner, userPick: pick, correct }]);
    setCountryWins(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
    if (correct) setUserScore(s => s + 1);
    setPhase("reveal");
  }

  function nextStep() {
    if (currentStep >= steps.length - 1) { setPhase("summary"); }
    else { setCurrentStep(s => s + 1); setUserPick(null); setPhase("question"); }
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
    <div className="app">
      <div className="app-nav">
        <Link href="/" onClick={(e) => { if (phase !== "home") { e.preventDefault(); newGame(); } }} className="app-nav-logo">
          Mundo<span>Vs</span>
        </Link>
        <div className="app-nav-links">
          <Link href="/blog">Blog</Link>
          <Link href="/sobre">Sobre</Link>
        </div>
      </div>

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
          onSelect={(code) => { if (showPickerFor === "A") setCountryA({ code, ...countries[code] }); else setCountryB({ code, ...countries[code] }); setShowPickerFor(null); }}
          onClose={() => setShowPickerFor(null)}
          excludeCode={showPickerFor === "A" ? countryB?.code : countryA?.code}
        />
      )}

      <div className="app-footer">
        <Link href="/legal/privacidad">Privacidad</Link> · <Link href="/legal/terminos">Términos</Link> · <Link href="/legal/cookies">Cookies</Link> · <Link href="/contacto">Contacto</Link>
        <div style={{ marginTop: 8 }}>Datos del Banco Mundial, OCDE, FIFA, COI · mundovs.com</div>
      </div>
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

  <h1 className="hero-title">
    ¿Crees que conoces el mundo?<br />
    <em>Demuéstralo.</em>
  </h1>

  <p className="hero-sub">
    Compara dos países en 5 categorías sorpresa.
    Adivina quién gana en cada una.
  </p>

  <div className="alpha-badge">
    <span>ALPHA v1.0.1</span>
    <span className="dot">•</span>
    <span>Nuevas preguntas y modos cada semana ⚡</span>
  </div>
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
  const list = Object.entries(countries)
    .filter(([code]) => code !== excludeCode)
    .filter(([_, c]) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort(([_, a], [__, b]) => a.name.localeCompare(b.name));
  return (
    <div className="picker-back" onClick={onClose}>
      <div className="picker" onClick={e => e.stopPropagation()}>
        <div className="picker-head">
          <span className="picker-title">Elige un país</span>
          <button className="picker-close" onClick={onClose}>×</button>
        </div>
        <input type="text" className="picker-search" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
        <div className="picker-list">
          {list.map(([code, c]) => (
            <button key={code} className="picker-item" onClick={() => onSelect(code)}>
              <span className="iflag">{c.flag}</span><span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Game({ countryA, countryB, steps, currentStep, phase, userPick, userScore, countryWins, stepResults, onPick, onNext, onNewGame, onReplay }) {
  if (phase === "summary") return <Summary cA={countryA} cB={countryB} userScore={userScore} totalSteps={steps.length} countryWins={countryWins} stepResults={stepResults} onNewGame={onNewGame} onReplay={onReplay} />;
  const step = steps[currentStep];
  const va = countryA[step.key];
  const vb = countryB[step.key];
  const result = stepResults[currentStep];

  function getBtnState(slot) {
    if (phase !== "reveal" || !result) return "";
    if (userPick === slot) return result.correct ? " selected-correct" : " selected-wrong";
    if (result.winner === slot) return " is-winner";
    return "";
  }

  return (
    <div className="game-wrap">
      <div className="match-title">{countryA.flag} {countryA.name} <span style={{color:"#999"}}>vs</span> {countryB.flag} {countryB.name}</div>

      <div className="progress-wrap">
        <span className="progress-label">Ronda {currentStep + 1}/{steps.length}</span>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${(currentStep / steps.length) * 100}%` }} /></div>
        <div className="score-dots">
          {steps.map((_, i) => { const r = stepResults[i]; return <div key={i} className={`dot${r ? r.correct ? " correct" : " wrong" : ""}`} />; })}
        </div>
      </div>

      <div className="vs-hero" style={{ background: step.gradient }}>
        <div className="vs-hero-flag">{countryA.flag}</div>
        <div className="vs-hero-vs">VS</div>
        <div className="vs-hero-flag">{countryB.flag}</div>
      </div>

      <div className="question-label">{step.question}</div>

      <div className="pick-btns">
        <button className={`pick-btn${getBtnState("A")}`} onClick={() => onPick("A")} disabled={phase === "reveal"}>
          <span className="flag">{countryA.flag}</span>
          <span className="pname">{countryA.name}</span>
          {phase === "reveal" && <span className="val">{step.format(va)}</span>}
        </button>
        <button className={`pick-btn${getBtnState("B")}`} onClick={() => onPick("B")} disabled={phase === "reveal"}>
          <span className="flag">{countryB.flag}</span>
          <span className="pname">{countryB.name}</span>
          {phase === "reveal" && <span className="val">{step.format(vb)}</span>}
        </button>
      </div>

      {phase === "reveal" && <Reveal cA={countryA} cB={countryB} step={step} va={va} vb={vb} result={result} countryWins={countryWins} currentStep={currentStep} totalSteps={steps.length} onNext={onNext} />}
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
      <div className="viral">{buildViralPhrase(cA, cB, step)}</div>
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
  const overall = countryWins.A > countryWins.B ? "A" : countryWins.B > countryWins.A ? "B" : "TIE";
  const winC = overall === "A" ? cA : overall === "B" ? cB : null;
  const urClass = userScore >= 4 ? "ur-good" : userScore >= 2 ? "ur-ok" : "ur-bad";
  const urMsg = userScore >= 4 ? `🧠 ¡Experto en geografía! ${userScore}/${totalSteps}` : userScore >= 2 ? `Nada mal — ${userScore}/${totalSteps} acertadas` : `A estudiar geografía... ${userScore}/${totalSteps}`;

  function shareResult() {
    const winnerText = winC ? `${winC.flag} ${winC.name} ganó` : "Hubo empate";
    const txt = `🌍 Acerté ${userScore}/${totalSteps} en ${cA.flag} ${cA.name} vs ${cB.flag} ${cB.name}\n${winnerText} la comparación.\n\n¿Puedes superarme? 👉 mundovs.com`;
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else navigator.clipboard.writeText(txt).then(() => alert("¡Copiado!\n\n" + txt));
  }

  return (
    <div className="game-wrap">
      <div className="match-title">{cA.flag} {cA.name} <span style={{color:"#999"}}>vs</span> {cB.flag} {cB.name}</div>
      <div className="summary-card">
        <div className="summary-head">Resultado final</div>
        <div className="big-score">
          <div className={`big-cell${overall === "A" ? " winner" : ""}`}><span className="big-flag">{cA.flag}</span><div className="big-name">{cA.name}</div><div className="big-pts">{countryWins.A}</div></div>
          <div className="vs-divider">categorías<br />ganadas</div>
          <div className={`big-cell${overall === "B" ? " winner" : ""}`}><span className="big-flag">{cB.flag}</span><div className="big-name">{cB.name}</div><div className="big-pts">{countryWins.B}</div></div>
        </div>
        {winC ? <div style={{ textAlign: "center", fontSize: 14, fontWeight: 500, marginBottom: "0.75rem" }}>{winC.flag} {winC.name} gana la comparación</div> : <div style={{ textAlign: "center", fontSize: 14, fontWeight: 500, marginBottom: "0.75rem" }}>¡Empate entre los dos países!</div>}
        <div className="recap">
          {stepResults.map((r, i) => {
            const wname = r.winner === "A" ? `${cA.flag} ${cA.name}` : r.winner === "B" ? `${cB.flag} ${cB.name}` : "Empate";
            return (
              <div key={i} className="recap-row">
                <span className="recap-cat">{r.step.label}</span>
                <div className="recap-right"><div className="dot-s" style={{ background: r.correct ? "#1D9E75" : "#E24B4A" }} /><span className="recap-win">{wname}</span></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`user-result ${urClass}`}>{urMsg}</div>
      <AdSlot />
      <button className="btn-next" onClick={shareResult}>📤 Compartir resultado</button>
      <button className="btn-next" style={{ background: "#FFF", color: "#1A1A1A", border: "0.5px solid rgba(0,0,0,0.15)" }} onClick={onReplay}>🔄 Repetir con otros datos</button>
      <button className="btn-next" style={{ background: "transparent", color: "#666", border: "none" }} onClick={onNewGame}>Nueva comparación</button>
    </div>
  );
}

function Challenger({ challenge, streak, bestStreak, onPick, onNext }) {
  const { cA, cB, category, userPick, revealed, correct, winner } = challenge;
  const va = cA[category.key];
  const vb = cB[category.key];
  const streakMsg = streakMessage(streak);

  function getBtnState(slot) {
    if (!revealed) return "";
    if (userPick === slot) return correct ? " selected-correct" : " selected-wrong";
    if (winner === slot) return " is-winner";
    return "";
  }

  return (
    <div className="game-wrap">
      <div className="challenger-bar">
        <div className="challenger-streak">
          <div className="challenger-streak-num">{streak}</div>
          <div className="challenger-streak-label">Racha actual</div>
        </div>
        {streakMsg && <div className="challenger-msg">{streakMsg}</div>}
        <div className="challenger-streak">
          <div className="challenger-streak-num">{bestStreak}</div>
          <div className="challenger-streak-label">Récord</div>
        </div>
      </div>

      <div className="match-title">{cA.flag} {cA.name} <span style={{color:"#999"}}>vs</span> {cB.flag} {cB.name}</div>

      <div className="vs-hero" style={{ background: category.gradient }}>
        <div className="vs-hero-flag">{cA.flag}</div>
        <div className="vs-hero-vs">VS</div>
        <div className="vs-hero-flag">{cB.flag}</div>
      </div>

      <div className="question-label">{category.question}</div>

      <div className="pick-btns">
        <button className={`pick-btn${getBtnState("A")}`} onClick={() => onPick("A")} disabled={revealed}>
          <span className="flag">{cA.flag}</span>
          <span className="pname">{cA.name}</span>
          {revealed && <span className="val">{category.format(va)}</span>}
        </button>
        <button className={`pick-btn${getBtnState("B")}`} onClick={() => onPick("B")} disabled={revealed}>
          <span className="flag">{cB.flag}</span>
          <span className="pname">{cB.name}</span>
          {revealed && <span className="val">{category.format(vb)}</span>}
        </button>
      </div>

      {revealed && (
        <>
          <div className={`feedback ${correct ? "fb-correct" : "fb-wrong"}`}>
            {correct ? `✓ ¡Correcto! Racha: ${streak}` : "✗ Fallaste — Fin de la partida"}
          </div>
          <div className="viral">{buildViralPhrase(cA, cB, category)}</div>
          {correct && <button className="btn-next" onClick={onNext}>Siguiente →</button>}
        </>
      )}
    </div>
  );
}

function ChallengerEnd({ streak, bestStreak, onRestart, onHome }) {
  const isNewRecord = streak === bestStreak && streak > 0;
  function shareStreak() {
    const txt = `⚡ Conseguí ${streak} preguntas seguidas en MundoVs Challenger Mode${isNewRecord ? " 🏆 ¡NUEVO RÉCORD!" : ""}\n\n¿Puedes superarme? 👉 mundovs.com`;
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else navigator.clipboard.writeText(txt).then(() => alert("¡Copiado!\n\n" + txt));
  }

  return (
    <div className="game-wrap">
      <div className="challenger-end">
        <div className="challenger-end-icon">{isNewRecord ? "🏆" : streak >= 5 ? "🔥" : "🌍"}</div>
        <div className="challenger-end-title">{isNewRecord ? "¡NUEVO RÉCORD!" : "Fin de la partida"}</div>
        <div className="challenger-end-streak">{streak}</div>
        <div className="challenger-end-label">aciertos seguidos</div>
        {!isNewRecord && bestStreak > streak && (
          <div className="challenger-end-best">Tu récord: {bestStreak}</div>
        )}
        {streakMessage(streak) && <div className="challenger-end-msg">{streakMessage(streak)}</div>}
      </div>
      <AdSlot />
      <button className="btn-next" onClick={shareStreak}>📤 Compartir mi récord</button>
      <button className="btn-next" onClick={onRestart}>⚡ Volver a intentarlo</button>
      <button className="btn-next" style={{ background: "transparent", color: "#666", border: "none" }} onClick={onHome}>Volver al inicio</button>
    </div>
  );
}

function AdSlot() {
  return (
    <div className="ad-slot">
      <div className="ad-label">Publicidad</div>
      <div style={{ fontSize: 12, color: "#bbb" }}>— Google AdSense aquí —</div>
    </div>
  );
}
