import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import countriesData from "../data/countries_full.json";
import { trackEvent, EVENTS } from "../lib/analytics";

// ─── Constants ────────────────────────────────────────────────────────────────
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
const MAX_HINTS  = 10;

// Score: hint index 0 = 10 pts, index 9 = 1 pt
function getScore(hintIndex) { return MAX_HINTS - hintIndex; }

// ─── Narrative messages (no data leaks) ──────────────────────────────────────
// Reglas estrictas:
//   - fail, fewHints, lastHint, almostFinal: NUNCA revelan continente,
//     hemisferio, costa, idioma compartido, distancia ni cercanía.
//   - Sólo dan personalidad.
const MESSAGES = {
  fail: [
    "El radar parpadea… pero ese no era el objetivo.",
    "Buena apuesta, pero el mapa acaba de levantar una ceja.",
    "Ese país queda registrado en el archivo de intentos fallidos.",
    "La brújula ha tosido. Probemos otra ruta.",
    "Casi se oye el suspense, pero no era ese.",
    "Tu intuición ha hecho una pirueta rara.",
    "No era ese. El mundo sigue guardando el secreto.",
  ],
  fewHints: [
    "Quedan pocas señales. La misión se está poniendo seria.",
    "Últimos compases del mapa. Afina el instinto.",
    "El panel de control está en modo tensión.",
    "El país secreto sigue escondido entre la niebla.",
    "Esto ya huele a última expedición.",
    "El reloj corre, agente.",
    "Pocas balas en la cartuchera. Cuidado con la siguiente.",
  ],
  almostFinal: [
    "Estás a punto de ver la última señal del mapa.",
    "Una pista más y se acaban las cartas.",
    "El secreto se resiste, pero no le queda mucho.",
    "La niebla está a un paso de levantarse del todo.",
    "El radar ya casi escupe la respuesta.",
  ],
  lastHint: [
    "Última señal del mapa. No hay vuelta atrás.",
    "Esto es todo lo que el radar puede ofrecerte.",
    "La pista definitiva está en pantalla. Lánzate.",
    "Ya no hay más capas que desbloquear.",
    "Aquí se decide la misión.",
  ],
  empty: [
    "Escribe un país antes de lanzar el radar.",
    "El mapa necesita una coordenada, aunque sea atrevida.",
    "No podemos adivinar el vacío… todavía.",
    "Introduce un país y empezamos la persecución.",
    "La misión espera una respuesta.",
  ],
  unknown: [
    "No encuentro ese país en la base de datos de MundoVS.",
    "Ese nombre no aparece en nuestro mapa operativo.",
    "El satélite no reconoce ese destino.",
    "Puede que haya una tilde, alias o nombre alternativo.",
    "Ese país no está en la lista actual del juego.",
  ],
  duplicate: [
    "Ese país ya pasó por el escáner.",
    "Ya lo intentaste. El mapa no cambia de opinión tan fácil.",
    "Intento duplicado detectado.",
    "Ese destino ya está marcado en rojo.",
    "No gastes munición dos veces en el mismo país.",
  ],
  hintUnlocked: [
    "Nueva señal recibida.",
    "El mapa acaba de revelar otra capa.",
    "Pista desbloqueada. El cerco se estrecha.",
    "Otra luz se enciende en el panel.",
    "Información nueva en la mesa.",
  ],
  win: [
    "Objetivo localizado. Misión completada.",
    "El radar canta victoria.",
    "País descubierto. Buen trabajo, agente.",
    "La bandera aparece en pantalla. Lo has encontrado.",
    "MundoVS confirma el impacto: respuesta correcta.",
    "Coordenadas correctas. El mapa se rinde.",
    "Brújula afinada. Intuición premiada.",
  ],
  lose: [
    "El país secreto escapó por una frontera invisible.",
    "Misión fallida, pero el mapa te debe una revancha.",
    "Hoy el atlas ganó esta ronda.",
    "El objetivo sigue oculto… hasta mañana.",
    "La niebla geográfica se cerró demasiado pronto.",
    "El radar te despide con un suspiro.",
    "Diez pistas y el secreto ha aguantado. Respeto.",
  ],
  streakKept: [
    "Racha mantenida. Mañana otra señal.",
    "La cadena sigue intacta. Vuelve a por más.",
    "Otro día, otra coordenada conquistada.",
    "Tu brújula sigue encendida. Ven mañana.",
    "Una pieza más en el atlas. La racha vive.",
  ],
  shareReady: [
    "Resultado listo para compartir.",
    "Coordenadas en el portapapeles.",
    "Lánzalo al mundo. Que vean quién manda el mapa.",
    "Listo para retar a alguien.",
    "Misión empaquetada y lista para presumir.",
  ],
};

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getMsg(event, hintsLeft, hintsUsed) {
  // Última pista usada → mensaje "lastHint"
  if (event === "fail" && hintsUsed === MAX_HINTS) return rnd(MESSAGES.lastHint);
  // Pistas 8-9 usadas → mensaje "almostFinal"
  if (event === "fail" && hintsUsed >= 8 && hintsUsed < MAX_HINTS) return rnd(MESSAGES.almostFinal);
  // ≤2 pistas restantes → mensaje "fewHints"
  if (event === "fail" && hintsLeft <= 2) return rnd(MESSAGES.fewHints);
  return rnd(MESSAGES[event] || MESSAGES.fail);
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function getDayNumber() {
  const now = new Date();
  const utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.floor((utc - START_DATE) / 86400000);
}
function getTodayString() {
  const n = new Date();
  return `${n.getUTCFullYear()}-${String(n.getUTCMonth()+1).padStart(2,"0")}-${String(n.getUTCDate()).padStart(2,"0")}`;
}

// ─── Country pool ─────────────────────────────────────────────────────────────
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
  const ps  = new Set(POPULAR_COUNTRIES);
  const pop  = POPULAR_COUNTRIES.filter(c => countriesData[c]);
  const rest = Object.keys(countriesData).filter(c => !ps.has(c));
  return [...shuffleWithSeed(pop,42), ...shuffleWithSeed(rest,1337)];
}
function getCountryOfTheDay(d) {
  const p = buildCountryPool();
  return countriesData[p[((d%p.length)+p.length)%p.length]];
}

// ─── Normalize & aliases ──────────────────────────────────────────────────────
function normalize(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9\s]/g,"")
    .replace(/\s+/g," ")
    .trim();
}

const ALIASES = {
  "US": ["usa","estados unidos","united states","eeuu","ee uu","estados unidos de america","norteamerica"],
  "GB": ["reino unido","uk","gran bretana","great britain","united kingdom","inglaterra"],
  "NL": ["paises bajos","holanda","netherlands","holland"],
  "RU": ["rusia","russia","federacion rusa"],
  "KR": ["corea del sur","south korea","corea"],
  "KP": ["corea del norte","north korea"],
  "CN": ["china","republica popular china"],
  "IR": ["iran","persia"],
  "VN": ["vietnam","viet nam"],
  "TW": ["taiwan","formosa"],
  "PS": ["palestina","palestine","estado de palestina"],
  "CZ": ["republica checa","chequia","czech republic","czechia"],
  "MK": ["macedonia","macedonia del norte","north macedonia"],
  "CI": ["costa de marfil","ivory coast","cote d ivoire"],
  "CD": ["congo","republica democratica del congo","rdc"],
  "BO": ["bolivia","estado plurinacional de bolivia"],
  "VE": ["venezuela","republica bolivariana de venezuela"],
};

function matchesCountry(input, country) {
  const inp = normalize(input);
  if (!inp) return false;
  if (normalize(country.name).includes(inp) || inp.includes(normalize(country.name))) return true;
  const extra = ALIASES[country.code] || [];
  return extra.some(a => a.includes(inp) || inp.includes(a));
}

function findCountryByAlias(input) {
  const inp = normalize(input);
  if (!inp) return null;
  return Object.values(countriesData).find(c => matchesCountry(input, c)) || null;
}

// ─── Hint generation — 10 progressive hints ──────────────────────────────────
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function generateHints(country) {
  const all   = Object.values(countriesData);
  const sorted = [...all].sort((a,b) => a.population - b.population);
  const medPop = sorted[Math.floor(sorted.length/2)].population;
  const medArea = [...all].sort((a,b) => a.area_km2 - b.area_km2)[Math.floor(all.length/2)].area_km2;
  const avgLE  = all.reduce((s,c) => s + (c.life_expectancy||70), 0) / all.length;

  const nameLen   = country.name.length;
  const firstLetter = country.name.charAt(0).toUpperCase();
  const capLetter  = country.capital.charAt(0).toUpperCase();
  const capLen     = country.capital.length;
  const borderCount = country.borders.length;
  const langs      = country.official_languages.map(cap).join(", ");
  const colors     = country.flag_colors.map(cap).join(", ");

  // Pista 1 — very ambiguous
  const p1parts = [
    country.has_coast ? "Tiene salida al mar" : "No tiene salida al mar",
    `Hemisferio ${country.hemisphere_NS}`,
    country.drives_on === "left" ? "Se conduce por la izquierda" : "Se conduce por la derecha",
  ];
  const hint1 = p1parts.join(" · ");

  // Pista 2 — visual clue (flag colors, name length)
  const namePart = nameLen > 8 ? `Su nombre tiene más de 8 letras (${nameLen})` : `Su nombre tiene ${nameLen} letras`;
  const hint2 = `Bandera con: ${colors} · ${namePart}`;

  // Pista 3 — soft geography
  let geo;
  if (country.is_island)        geo = "Es un país insular";
  else if (country.landlocked)  geo = "No tiene acceso al mar (sin costa)";
  else {
    const oceans = country.oceans.length ? country.oceans.join(" y ") : "un océano";
    geo = `Tiene costas al ${oceans}`;
  }
  const hint3 = `${geo} · Hemisferio ${country.hemisphere_EW}`;

  // Pista 4 — size / population
  const popCompare = country.population > medPop ? "más poblado que la media" : "menos poblado que la media";
  const areaCompare = country.area_km2 > medArea ? "más grande que la media en superficie" : "más pequeño que la media en superficie";
  const hint4 = `Población: ${popCompare} · Superficie: ${areaCompare}`;

  // Pista 5 — comparative stat
  const popM = (country.population / 1e6).toFixed(1);
  const popBracket =
    country.population < 5e6   ? "menos de 5 millones de habitantes" :
    country.population < 20e6  ? "entre 5 y 20 millones de habitantes" :
    country.population < 60e6  ? "entre 20 y 60 millones de habitantes" :
    country.population < 150e6 ? "entre 60 y 150 millones de habitantes" :
    "más de 150 millones de habitantes";
  const hint5 = `Tiene ${popBracket} · Su área supera ${Math.round(country.area_km2/1000)*1000} km²`;

  // Pista 6 — continent (not before hint 6)
  const hint6 = `Continente: ${country.continent} · Subregión: ${country.subregion}`;

  // Pista 7 — culture / economy
  const eu    = country.in_EU   ? "Sí" : "No";
  const nato  = country.in_NATO ? "Sí" : "No";
  const hint7 = `Moneda: ${country.currency} · En la UE: ${eu} · En la OTAN: ${nato}`;

  // Pista 8 — capital partial
  const hint8 = `Su capital empieza por "${capLetter}" y tiene ${capLen} letras · Idioma oficial: ${langs}`;

  // Pista 9 — strong clue
  let neighborClue = "";
  if (borderCount === 0) {
    neighborClue = "No tiene fronteras terrestres";
  } else if (borderCount === 1) {
    const nb = countriesData[country.borders[0]];
    neighborClue = `Frontera con: ${nb ? nb.name : country.borders[0]}`;
  } else {
    const nb1 = countriesData[country.borders[0]];
    const nb2 = countriesData[country.borders[1]];
    const n1  = nb1 ? nb1.name : country.borders[0];
    const n2  = nb2 ? nb2.name : country.borders[1];
    neighborClue = `Dos de sus vecinos: ${n1} y ${n2}`;
  }
  const hint9 = `Su nombre empieza por "${firstLetter}" · ${neighborClue}`;

  // Pista 10 — almost definitive
  const hint10 = `Capital: ${country.capital} · Bandera: ${country.flag} · Nombre completo: empieza por "${firstLetter}", ${nameLen} letras`;

  return [
    { id:1,  score:10, icon:"📡", label:"Señal inicial",      text: hint1  },
    { id:2,  score:9,  icon:"🎨", label:"Rastro visual",       text: hint2  },
    { id:3,  score:8,  icon:"🧭", label:"Coordenadas",         text: hint3  },
    { id:4,  score:7,  icon:"📊", label:"Tamaño",              text: hint4  },
    { id:5,  score:6,  icon:"💠", label:"Sistema",             text: hint5  },
    { id:6,  score:5,  icon:"🌍", label:"Continente",          text: hint6  },
    { id:7,  score:4,  icon:"🗺️", label:"Fronteras",           text: hint7  },
    { id:8,  score:3,  icon:"🏛️", label:"Capital parcial",     text: hint8  },
    { id:9,  score:2,  icon:"🔎", label:"Pista fuerte",        text: hint9  },
    { id:10, score:1,  icon:"🚩", label:"Última señal",        text: hint10 },
  ];
}

// ─── Share text ───────────────────────────────────────────────────────────────
function buildShareText(dayNumber, attempts, gameStatus, finalScore) {
  const used = attempts.length;
  const bar = Array.from({ length: MAX_HINTS }, (_, i) => {
    if (gameStatus === "won"  && i === used - 1) return "🟨"; // pista en que acertó
    if (gameStatus === "won"  && i < used - 1)  return "🟩"; // pistas anteriores usadas
    if (gameStatus === "lost")                  return "🟥"; // perdió, todo rojo
    if (i < used)                               return "🟩"; // intentos fallidos
    return "⬛";                                              // pistas no usadas
  });
  const score = gameStatus === "won" ? finalScore : 0;
  return [
    `🌍 MundoVS — País del Día #${dayNumber}`,
    gameStatus === "won"
      ? `✅ Descubierto en ${used}/${MAX_HINTS} pistas`
      : `❌ No lo conseguí (${MAX_HINTS}/${MAX_HINTS})`,
    `Puntuación: ${score}/10`,
    bar.join(""),
    "mundovs.com/pais-del-dia",
  ].join("\n");
}

// ─── Google Maps URL ──────────────────────────────────────────────────────────
function getGoogleMapsUrl(country) {
  // Si nos pasan un país, hacemos un search específico (útil en pantalla final)
  if (country && country.name) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.name)}`;
  }
  // Si no, el genérico para "investigar" durante la partida.
  return "https://www.google.com/maps";
}

// ─── State persistence ────────────────────────────────────────────────────────
function getStorageKey(dayNumber, isArchive) {
  return isArchive ? `mundovs_pais_del_dia_archive_${dayNumber}` : "mundovs_pais_del_dia";
}
function getDayKey(dayNumber, isArchive) {
  return isArchive ? `archive-${dayNumber}` : getTodayString();
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PaisDelDia({ dayOffset = 0 }) {
  const [mounted,       setMounted]       = useState(false);
  const [dayNumber,     setDayNumber]     = useState(0);
  const [todayCountry,  setTodayCountry]  = useState(null);
  const [hints,         setHints]         = useState([]);
  const [revealedHints, setRevealedHints] = useState(1);
  const [attempts,      setAttempts]      = useState([]);
  const [search,        setSearch]        = useState("");
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [gameStatus,    setGameStatus]    = useState("playing");
  const [finalScore,    setFinalScore]    = useState(0);
  const [statusMsg,     setStatusMsg]     = useState("");
  const [shareCopied,   setShareCopied]   = useState(false);
  const [wrongShake,    setWrongShake]    = useState(false);
  const [newHintIdx,    setNewHintIdx]    = useState(-1);
  const [showConfetti,  setShowConfetti]  = useState(false);
  const [isArchive,     setIsArchive]     = useState(false);
  const [inputError,    setInputError]    = useState("");

  const searchRef = useRef(null);
  const answerRef = useRef(null);
  const hintsSectionRef = useRef(null);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const today     = getDayNumber();
    const targetDay = dayOffset !== 0 ? today + dayOffset : today;
    const country   = getCountryOfTheDay(targetDay);
    const archive   = dayOffset !== 0;
    setDayNumber(targetDay);
    setTodayCountry(country);
    setHints(generateHints(country));
    setIsArchive(archive);

    let initialStatus = "playing";
    try {
      const saved = JSON.parse(localStorage.getItem(getStorageKey(targetDay, archive)) || "{}");
      if (saved.date === getDayKey(targetDay, archive)) {
        setRevealedHints(saved.revealedHints || 1);
        setAttempts(saved.attempts || []);
        setGameStatus(saved.gameStatus || "playing");
        setFinalScore(saved.finalScore || 0);
        initialStatus = saved.gameStatus || "playing";
      }
    } catch(e) {}

    // Trackear inicio solo si la partida está en juego (no si ya está
    // completada porque revisitar la página no es "empezar a jugar").
    if (initialStatus === "playing" && !archive) {
      trackEvent(EVENTS.DAILY_COUNTRY_START, { day: targetDay });
    }
  }, [dayOffset]);

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    function h(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Persist state ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || !todayCountry) return;
    const key    = getStorageKey(dayNumber, isArchive);
    const dayKey = getDayKey(dayNumber, isArchive);
    try {
      localStorage.setItem(key, JSON.stringify({
        date: dayKey, dayNumber, revealedHints, attempts, gameStatus, finalScore,
      }));
      if (!isArchive && (gameStatus === "won" || gameStatus === "lost")) {
        const sk = "mundovs_pais_del_dia_streak";
        const sd = JSON.parse(localStorage.getItem(sk) || '{"current":0,"best":0,"lastWonDate":null}');
        if (gameStatus === "won") {
          const y = new Date(); y.setUTCDate(y.getUTCDate()-1);
          const ys = `${y.getUTCFullYear()}-${String(y.getUTCMonth()+1).padStart(2,"0")}-${String(y.getUTCDate()).padStart(2,"0")}`;
          if (sd.lastWonDate === dayKey) { /* already saved */ }
          else if (sd.lastWonDate === ys) { sd.current += 1; }
          else { sd.current = 1; }
          if (sd.current > sd.best) sd.best = sd.current;
          sd.lastWonDate = dayKey;
        } else { sd.current = 0; }
        localStorage.setItem(sk, JSON.stringify(sd));
      }
    } catch(e) {}
  }, [mounted, todayCountry, revealedHints, attempts, gameStatus, finalScore, dayNumber, isArchive]);

  // ── Autocomplete list ─────────────────────────────────────────────────────
  const allCountriesArray = useMemo(() =>
    Object.values(countriesData).sort((a,b) => a.name.localeCompare(b.name,"es")), []);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return [];
    return allCountriesArray.filter(c => matchesCountry(search, c)).slice(0, 8);
  }, [search, allCountriesArray]);

  // ── Handle guess ──────────────────────────────────────────────────────────
  function handleGuess(country) {
    if (gameStatus !== "playing") return;
    setInputError("");

    // Duplicate
    if (attempts.some(a => a.code === country.code)) {
      setInputError(rnd(MESSAGES.duplicate));
      setSearch(""); setShowDropdown(false);
      return;
    }

    const correct = country.code === todayCountry.code;
    const hintsUsed = revealedHints; // pistas reveladas hasta ahora
    const msg = correct ? rnd(MESSAGES.win) : getMsg("fail", MAX_HINTS - revealedHints, hintsUsed);

    const newAttempts = [
      ...attempts,
      { code: country.code, name: country.name, flag: country.flag, correct, msg },
    ];
    setAttempts(newAttempts);
    setSearch(""); setShowDropdown(false);

    if (correct) {
      const score = getScore(revealedHints - 1);
      setFinalScore(score);
      setGameStatus("won");
      setStatusMsg(rnd(MESSAGES.win));
      setShowConfetti(true);
      try { if (navigator.vibrate) navigator.vibrate([30, 50, 80]); } catch(e) {}
      setTimeout(() => setShowConfetti(false), 3500);
      if (!isArchive) {
        trackEvent(EVENTS.DAILY_COUNTRY_SUCCESS, {
          day: dayNumber,
          hints_used: hintsUsed,
          score,
        });
      }
    } else {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
      try { if (navigator.vibrate) navigator.vibrate([15, 40, 15]); } catch(e) {}

      // Game over: ya estábamos en la última pista
      if (revealedHints >= MAX_HINTS) {
        setGameStatus("lost");
        setStatusMsg(rnd(MESSAGES.lose));
        if (!isArchive) {
          trackEvent(EVENTS.DAILY_COUNTRY_FAIL, { day: dayNumber, attempts: newAttempts.length });
        }
        return;
      }

      // Desbloquear siguiente pista
      const nextRevealed = revealedHints + 1;
      setRevealedHints(nextRevealed);
      setNewHintIdx(nextRevealed - 1);
      setTimeout(() => setNewHintIdx(-1), 900);
      // Scroll a la sección de pistas para que el usuario vea la nueva pista
      setTimeout(() => {
        hintsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    }
  }

  function handleSearchSubmit() {
    if (!search.trim()) {
      setInputError(rnd(MESSAGES.empty));
      return;
    }
    const found = findCountryByAlias(search);
    if (!found) {
      setInputError(rnd(MESSAGES.unknown));
      return;
    }
    handleGuess(found);
  }

  async function handleShare() {
    const text = buildShareText(dayNumber, attempts, gameStatus, finalScore);
    trackEvent(EVENTS.SHARE_RESULT, { mode: "daily_country", day: dayNumber, status: gameStatus });
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
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--mv-green)" strokeWidth="1.5" opacity=".3"/>
            <circle cx="24" cy="24" r="14" fill="none" stroke="var(--mv-green)" strokeWidth="1.2" opacity=".6" className="pdd-mv-spin-ring"/>
            <circle cx="24" cy="24" r="3" fill="var(--mv-green)"/>
          </svg>
          <span>Cargando misión...</span>
        </div>
      </div>
    );
  }

  const realDate = new Date(START_DATE);
  realDate.setUTCDate(realDate.getUTCDate() + dayNumber);
  const formattedDate = realDate.toLocaleDateString("es-ES", { day:"numeric", month:"long", year:"numeric" });
  const possibleScore = getScore(revealedHints - 1);

  return (
    <div className="pdd-mv-wrap">

      {/* Confetti */}
      {showConfetti && (
        <div className="pdd-mv-confetti" aria-hidden="true">
          {Array.from({length:28}).map((_,i) => (
            <span key={i} className="pdd-mv-confetti-piece" style={{
              left:`${(i*37)%100}%`,
              animationDelay:`${(i*0.07)%0.6}s`,
              // Colores del Design System v4 (no hardcoded)
              backgroundColor:["var(--mv-green)","var(--mv-blue)","var(--mv-red)","var(--mv-gold)","#9b59b6","#ff8c42"][i%6],
            }}/>
          ))}
        </div>
      )}

      {/* Geo background */}
      <div className="pdd-mv-geo-bg" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 360 600" preserveAspectRatio="xMidYMid slice">
          <line x1="0" y1="100" x2="360" y2="100" stroke="var(--mv-green)" strokeWidth=".4" opacity=".06"/>
          <line x1="0" y1="250" x2="360" y2="250" stroke="var(--mv-green)" strokeWidth=".4" opacity=".05"/>
          <line x1="0" y1="400" x2="360" y2="400" stroke="var(--mv-green)" strokeWidth=".4" opacity=".04"/>
          <line x1="0" y1="550" x2="360" y2="550" stroke="var(--mv-green)" strokeWidth=".4" opacity=".03"/>
          <line x1="90"  y1="0" x2="90"  y2="600" stroke="var(--mv-green)" strokeWidth=".4" opacity=".06"/>
          <line x1="180" y1="0" x2="180" y2="600" stroke="var(--mv-green)" strokeWidth=".4" opacity=".06"/>
          <line x1="270" y1="0" x2="270" y2="600" stroke="var(--mv-green)" strokeWidth=".4" opacity=".04"/>
          <path d="M 20 160 Q 120 130 220 180 Q 300 220 350 200" fill="none"
            stroke="var(--mv-green)" strokeWidth=".9" opacity=".09" strokeDasharray="4 4" className="pdd-mv-route"/>
          <circle cx="220" cy="180" r="2"   fill="var(--mv-green)" opacity=".2"  className="pdd-mv-node-a"/>
          <circle cx="20"  cy="160" r="1.5" fill="var(--mv-green)" opacity=".15" className="pdd-mv-node-b"/>
          <circle cx="350" cy="200" r="1.5" fill="var(--mv-green)" opacity=".15" className="pdd-mv-node-c"/>
        </svg>
      </div>

      {/* Header */}
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

        <div className="pdd-mv-status-row">
          <span className="pdd-mv-chip">
            {gameStatus === "playing" ? "🔴 EN PROGRESO" : gameStatus === "won" ? "🟢 DESCUBIERTO" : "💀 FALLIDO"}
          </span>
          <span className="pdd-mv-chip">Pistas: {revealedHints}/{MAX_HINTS}</span>
          <span className="pdd-mv-chip">
            {gameStatus === "playing"
              ? `⭐ Puntos posibles: ${possibleScore}`
              : gameStatus === "won"
              ? `⭐ +${finalScore} pts`
              : "⭐ 0 pts"}
          </span>
        </div>

        {!isArchive && <Link href="/pais-del-dia/archivo" className="pdd-mv-archive-link">📅 Retos anteriores</Link>}
        {isArchive  && <Link href="/pais-del-dia"         className="pdd-mv-archive-link">← Reto de hoy</Link>}
      </div>

      {/* Hints grid 2×5 */}
      <div className="pdd-mv-hints-section" ref={hintsSectionRef}>
        <div className="pdd-mv-section-header">
          <span className="pdd-mv-section-label">PISTAS DESBLOQUEADAS</span>
          <button
            className="pdd-mv-nav-btn"
            onClick={() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            aria-label="Ir al área de respuesta"
          >
            ↓ Responder
          </button>
        </div>
        <div className="pdd-mv-hints-grid">
          {hints.map((hint, idx) => {
            const unlocked = idx < revealedHints;
            const isActive = unlocked && idx === revealedHints - 1;
            const isNew    = idx === newHintIdx;
            const pts      = getScore(idx);
            return (
              <div key={hint.id} className={[
                "pdd-mv-hint-card",
                unlocked ? "pdd-mv-hint-unlocked" : "pdd-mv-hint-locked",
                isActive ? "pdd-mv-hint-active" : "",
                isNew    ? "pdd-mv-hint-new"    : "",
              ].join(" ")}>
                <div className="pdd-mv-hint-top">
                  <span className="pdd-mv-hint-icon">{unlocked ? hint.icon : "🔒"}</span>
                  <span className="pdd-mv-hint-num">PISTA {hint.id}</span>
                  <span className={`pdd-mv-hint-pts ${isActive ? "pdd-mv-pts-active" : ""}`}>+{hint.score ?? pts}</span>
                </div>
                <div className="pdd-mv-hint-label">{hint.label}</div>
                {unlocked
                  ? <div className="pdd-mv-hint-text">{hint.text}</div>
                  : <div className="pdd-mv-hint-locked-text">Falla para desbloquear</div>
                }
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer area */}
      {gameStatus === "playing" && (
        <div className="pdd-mv-answer-area" ref={answerRef}>
          <div className="pdd-mv-answer-header">
            <button
              className="pdd-mv-nav-btn"
              onClick={() => hintsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              aria-label="Ver pistas"
            >
              ↑ Ver pistas
            </button>
            <div className="pdd-mv-answer-cta">↓ Responder · +{possibleScore} pts</div>
          </div>

          <div className="pdd-mv-search-wrap" ref={searchRef}>
            <div className="pdd-mv-search-row">
              <input
                type="text"
                className={`pdd-mv-search-input ${wrongShake ? "pdd-mv-shake" : ""}`}
                placeholder="Escribe el nombre de un país..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowDropdown(true); setInputError(""); }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={e => e.key === "Enter" && handleSearchSubmit()}
                autoComplete="off"
              />
              <button className="pdd-mv-submit-btn" onClick={handleSearchSubmit}>›</button>
            </div>

            {inputError && (
              <div className="pdd-mv-input-error">{inputError}</div>
            )}

            {showDropdown && filteredCountries.length > 0 && (
              <div className="pdd-mv-dropdown">
                {filteredCountries.map(c => {
                  const tried = attempts.some(a => a.code === c.code);
                  return (
                    <button key={c.code}
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

          {/* Google Maps link — copy exacto del briefing */}
          <div className="pdd-mv-maps-hint">
            <span>¿Te has perdido en el mapa? Puedes abrir Google Maps un momento, aquí se permite investigar.</span>
            <a href={getGoogleMapsUrl()} target="_blank" rel="noopener noreferrer" className="pdd-mv-maps-link">
              🗺️ Abrir Google Maps
            </a>
          </div>

          {/* Attempt history */}
          {attempts.length > 0 && (
            <div className="pdd-mv-attempts">
              <div className="pdd-mv-section-label" style={{marginBottom:"8px"}}>REGISTRO DE INTENTOS</div>
              {attempts.map((a, i) => (
                <div key={i} className={`pdd-mv-attempt ${a.correct ? "pdd-mv-attempt-correct" : "pdd-mv-attempt-wrong"}`}>
                  <span className="pdd-mv-att-num">#{i+1}</span>
                  <span className="pdd-mv-att-flag">{a.flag}</span>
                  <div className="pdd-mv-att-right">
                    <span className="pdd-mv-att-name">{a.name}</span>
                    <span className="pdd-mv-att-msg">{a.correct ? "✅" : "❌"} {a.msg}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Result: won */}
      {gameStatus === "won" && (
        <div className="pdd-mv-result pdd-mv-result-won">
          <div className="pdd-mv-result-badge">🟢 MISIÓN COMPLETADA</div>
          <div className="pdd-mv-result-flag">{todayCountry.flag}</div>
          <h2 className="pdd-mv-result-country">{todayCountry.name}</h2>
          <p className="pdd-mv-result-stat">
            Descubierto en <strong>{attempts.length}/10</strong> pistas ·
            Puntuación: <strong>+{finalScore}/10</strong>
          </p>
          <p className="pdd-mv-result-quote">{statusMsg}</p>
          <FactSheet country={todayCountry} />
          <ShareBlock text={buildShareText(dayNumber, attempts, gameStatus, finalScore)} shareCopied={shareCopied} onShare={handleShare}/>
          <ResultActions country={todayCountry} />
          {!isArchive && (
            <p className="pdd-mv-next-game">{rnd(MESSAGES.streakKept)}</p>
          )}
        </div>
      )}

      {/* Result: lost */}
      {gameStatus === "lost" && (
        <div className="pdd-mv-result pdd-mv-result-lost">
          <div className="pdd-mv-result-badge">💀 MISIÓN FALLIDA</div>
          <p className="pdd-mv-result-stat">Puntuación: <strong>0/10</strong></p>
          <p className="pdd-mv-result-quote">{statusMsg}</p>
          <p className="pdd-mv-result-reveal-label">El país secreto era:</p>
          <div className="pdd-mv-result-flag">{todayCountry.flag}</div>
          <h2 className="pdd-mv-result-country">{todayCountry.name}</h2>
          <FactSheet country={todayCountry} />
          <ShareBlock text={buildShareText(dayNumber, attempts, gameStatus, 0)} shareCopied={shareCopied} onShare={handleShare}/>
          <ResultActions country={todayCountry} />
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
    { label:"Capital",    value: country.capital },
    { label:"Continente", value: `${country.continent} · ${country.subregion}` },
    { label:"Población",  value: fmt(country.population) + " hab." },
    { label:"Superficie", value: fmt(country.area_km2) + " km²" },
    { label:"Idioma",     value: country.official_languages.map(cap).join(", ") },
    { label:"Moneda",     value: country.currency },
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

// Acciones secundarias: Maps + cross-mode (Challenger / Infinito)
function ResultActions({ country }) {
  const mapsUrl = getGoogleMapsUrl(country);
  return (
    <div className="pdd-mv-result-actions">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mv-btn mv-btn-secondary mv-btn-block"
      >
        🗺️ Ver {country.name} en Google Maps
      </a>
      <div className="pdd-mv-cross-modes">
        <Link href="/challenger" className="mv-btn mv-btn-secondary">
          ⚡ Probar Challenger
        </Link>
        <Link href="/infinito" className="mv-btn mv-btn-secondary">
          ♾️ Probar Infinito
        </Link>
      </div>
      <Link href="/" className="mv-btn mv-btn-ghost mv-btn-block">
        Volver al menú principal
      </Link>
    </div>
  );
}
