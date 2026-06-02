import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { WebSiteSchema, WebApplicationSchema, FaqSchema } from "../components/JsonLd";
import countries from "../data/countries.json";
import {
  POPULAR_RANKINGS,
  POPULAR_COMPARISONS,
  POPULAR_QUESTIONS,
  compareSlug,
} from "../lib/seo";

const SITE_URL = "https://mundovs.com";

// ── FAQ data (también alimenta el JSON-LD) ──────────────────────────────
const FAQ = [
  {
    q: "¿Qué es MundoVs?",
    a: "MundoVs es un juego de geografía online y gratuito. Compara países, adivina el país del día, juega en racha o consulta rankings y datos curiosos del mundo.",
  },
  {
    q: "¿Es gratis?",
    a: "Sí, totalmente. Se sostiene con publicidad muy ligera y no requiere registro para jugar.",
  },
  {
    q: "¿De dónde salen los datos?",
    a: "Los datos provienen de fuentes oficiales: Banco Mundial, OCDE, OMS, FAOSTAT, UNODC, CTBUH, FIFA y COI. Cada categoría tiene su año y fuente documentados.",
  },
  {
    q: "¿Sirve para aprender geografía?",
    a: "Sí. MundoVs está pensado como herramienta educativa: cada ronda incluye datos reales, contexto y curiosidades para que aprendas mientras juegas.",
  },
  {
    q: "¿Puedo jugar en móvil?",
    a: "Sí. Todos los modos están optimizados para móvil, con interfaz responsive y botones grandes pensados para usarse con una sola mano.",
  },
  {
    q: "¿Cada cuánto se actualizan los datos?",
    a: "Los indicadores se revisan al menos una vez al año, con prioridad para los más sensibles a cambio (PIB, población, esperanza de vida).",
  },
];

// ── Iconos SVG inline (radar) ───────────────────────────────────────────
function RadarIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <radialGradient id="rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--mv-green)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--mv-green)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#rg)" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="var(--mv-blue)" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="var(--mv-green)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="60" cy="60" r="22" fill="none" stroke="var(--mv-green)" strokeOpacity="0.55" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="3"  fill="var(--mv-green)" />
      <line x1="60" y1="60" x2="60" y2="6" stroke="var(--mv-green)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="60" cy="6" r="3" fill="var(--mv-gold)" />
      <line x1="60" y1="60" x2="100" y2="40" stroke="var(--mv-blue)" strokeOpacity="0.7" strokeWidth="1.2" />
      <circle cx="100" cy="40" r="2.5" fill="var(--mv-blue)" />
    </svg>
  );
}

function ModeIcon({ kind }) {
  // SVG plana, sutil, sin emoji. Solo trazo.
  const stroke = "currentColor";
  switch (kind) {
    case "daily":
      return (
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="22" cy="22" r="18" fill="none" stroke={stroke} strokeWidth="1.5" />
          <path d="M22 6 v8 M22 30 v8 M6 22 h8 M30 22 h8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="22" cy="22" r="3" fill={stroke} />
        </svg>
      );
    case "vs":
      return (
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="14" cy="22" r="9"  fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx="30" cy="22" r="9"  fill="none" stroke={stroke} strokeWidth="1.5" />
          <text x="22" y="26" textAnchor="middle" fontSize="9" fontWeight="700" fill={stroke}>VS</text>
        </svg>
      );
    case "challenger":
      return (
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
          <path d="M10 30 L22 8 L34 30 L28 30 L22 18 L16 30 Z" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="22" cy="34" r="2" fill={stroke} />
        </svg>
      );
    case "infinite":
      return (
        <svg width="48" height="44" viewBox="0 0 48 44" aria-hidden="true">
          <path d="M14 22 C 14 14, 22 14, 24 22 C 26 30, 34 30, 34 22 C 34 14, 26 14, 24 22 C 22 30, 14 30, 14 22 Z"
                fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────
function formatRankingValue(key, value) {
  if (value === null || value === undefined) return "—";
  if (key === "population")        return value >= 1e9 ? (value/1e9).toFixed(2)+"B" : (value/1e6).toFixed(0)+"M";
  if (key === "area")              return (value/1e3).toFixed(0)+"k km²";
  if (key === "life_expectancy")   return value.toFixed(1)+" años";
  if (key === "gdp_total")         return value >= 1e12 ? "$"+(value/1e12).toFixed(2)+"T" : "$"+(value/1e9).toFixed(0)+"B";
  if (key === "mcdonalds_count")   return value.toLocaleString("es-ES");
  if (key === "skyscrapers_150m")  return value.toLocaleString("es-ES");
  return String(value);
}

function getTopForRanking(key, direction = "desc", n = 3) {
  const arr = Object.entries(countries)
    .filter(([, c]) => c[key] !== null && c[key] !== undefined && !isNaN(c[key]))
    .map(([code, c]) => ({ code, name: c.name, flag: c.flag, value: c[key] }));
  arr.sort((a, b) => direction === "desc" ? b.value - a.value : a.value - b.value);
  return arr.slice(0, n);
}

// ── Página ──────────────────────────────────────────────────────────────
export default function Home() {
  const [streakInfo, setStreakInfo] = useState({ current: 0, best: 0 });
  const [bestVsStreak, setBestVsStreak] = useState(0);
  const [bestInfinite, setBestInfinite] = useState(0);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  useEffect(() => {
    try {
      const pdd = JSON.parse(localStorage.getItem("mundovs_pais_del_dia_streak") || '{"current":0,"best":0}');
      setStreakInfo(pdd);
      const today = new Date();
      const todayStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
      const pddState = JSON.parse(localStorage.getItem("mundovs_pais_del_dia") || "{}");
      if (pddState.date === todayStr && (pddState.gameStatus === "won" || pddState.gameStatus === "lost")) {
        setHasPlayedToday(true);
      }
      setBestVsStreak(parseInt(localStorage.getItem("mundovs_best_streak") || "0", 10) || 0);
      setBestInfinite(parseInt(localStorage.getItem("mundovs_higherlower_best_global") || "0", 10) || 0);
    } catch (e) { /* no-op */ }
  }, []);

  // Datos para sección de rankings con top 3 cada uno
  const rankingsWithData = POPULAR_RANKINGS.map(r => ({
    ...r,
    top: getTopForRanking(r.key, r.direction, 3),
  }));

  return (
    <Layout>
      <Head>
        <title>MundoVs — Aprende geografía jugando a comparar países</title>
        <meta
          name="description"
          content="Juego gratis de geografía. Compara países, adivina el país del día, encadena rachas y consulta rankings con datos reales del mundo."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={SITE_URL + "/"} />
        <meta property="og:title" content="MundoVs — Aprende geografía jugando" />
        <meta
          property="og:description"
          content="Compara países, adivina el país secreto del día y reta tu intuición con datos reales."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL + "/"} />
        <meta property="og:image" content={SITE_URL + "/favicon-512.png"} />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MundoVs — El juego de geografía" />
        <meta name="twitter:description" content="Compara países, datos reales, rachas infinitas." />
        <meta name="twitter:image" content={SITE_URL + "/favicon-512.png"} />
        <WebSiteSchema />
        <WebApplicationSchema />
        <FaqSchema items={FAQ} />
      </Head>

      {/* ─────────────────────── HERO ─────────────────────── */}
      <section className="mv2-hero">
        <div className="mv2-hero-grid">
          <div className="mv2-hero-text">
            <div className="mv2-hero-badges">
              <span className="mv2-badge mv2-badge-green">Juego gratis de geografía</span>
              <span className="mv2-badge mv2-badge-blue">Datos de fuentes oficiales</span>
            </div>
            <h1 className="mv2-hero-title">
              Aprende geografía<br />
              <span className="mv2-hero-accent">jugando a comparar países</span>
            </h1>
            <p className="mv2-hero-sub">
              Reta tu intuición con datos reales: población, superficie, economía,
              cultura, comida, turismo y mucho más. Aprende geografía sin
              darte cuenta.
            </p>
            <div className="mv2-hero-ctas">
              <Link href="/pais-del-dia" className="mv-btn mv-btn-primary mv-btn-lg">
                📡 Iniciar misión
              </Link>
              <Link href="/rankings" className="mv-btn mv-btn-secondary mv-btn-lg">
                Ver rankings
              </Link>
            </div>
            <div className="mv2-hero-meta">
              <span><strong>{Object.keys(countries).length}</strong> países</span>
              <span><strong>29</strong> categorías</span>
              <span><strong>∞</strong> combinaciones</span>
            </div>
          </div>
          <div className="mv2-hero-visual" aria-hidden="true">
            <RadarIcon />
            <div className="mv2-hero-orbit" />
          </div>
        </div>
      </section>

      {/* ─────────────────────── MODOS DE JUEGO ─────────────────────── */}
      <section className="mv2-section" id="modos">
        <header className="mv2-section-head">
          <h2 className="mv2-section-title">Cuatro modos para descubrir el mundo</h2>
          <p className="mv2-section-sub">Elige cómo quieres jugar hoy.</p>
        </header>

        <div className="mv2-modes-grid">
          <Link href="/pais-del-dia" className="mv2-mode mv2-mode-featured">
            <div className="mv2-mode-tag">DAILY_MISSION_001</div>
            <div className="mv2-mode-icon"><ModeIcon kind="daily" /></div>
            <h3 className="mv2-mode-title">País del Día</h3>
            <p className="mv2-mode-desc">
              Un país secreto distinto cada día. Diez pistas progresivas.
              Cuanto antes lo adivines, más puntos. Nadie en el mundo sabe
              más que tú todavía.
            </p>
            <div className="mv2-mode-stats">
              {streakInfo.current > 0 && (
                <span className="mv2-stat-pill mv2-stat-gold">
                  🔥 Racha: {streakInfo.current} {streakInfo.current === 1 ? "día" : "días"}
                </span>
              )}
              {hasPlayedToday && (
                <span className="mv2-stat-pill mv2-stat-done">✓ Ya jugaste hoy</span>
              )}
            </div>
            <div className="mv2-mode-cta">
              {hasPlayedToday ? "Ver tu resultado" : "Iniciar misión"} →
            </div>
          </Link>

          <Link href="/clasico" className="mv2-mode">
            <div className="mv2-mode-tag">VERSUS_MODE</div>
            <div className="mv2-mode-icon"><ModeIcon kind="vs" /></div>
            <h3 className="mv2-mode-title">MundoVs clásico</h3>
            <p className="mv2-mode-desc">
              Elige dos países y compáralos en 5 categorías sorpresa. ¿Acertarás
              quién gana en cada una?
            </p>
            <div className="mv2-mode-cta">Comparar países →</div>
          </Link>

          <Link href="/challenger" className="mv2-mode">
            <div className="mv2-mode-tag">ENDLESS_MODE</div>
            <div className="mv2-mode-icon"><ModeIcon kind="challenger" /></div>
            <h3 className="mv2-mode-title">Challenger</h3>
            <p className="mv2-mode-desc">
              Racha infinita de comparaciones. Un solo fallo y se acaba la
              partida. El mapa no tiene piedad.
            </p>
            <div className="mv2-mode-stats">
              {bestVsStreak > 0 && (
                <span className="mv2-stat-pill">Récord: {bestVsStreak}</span>
              )}
            </div>
            <div className="mv2-mode-cta">Probar racha →</div>
          </Link>

          <Link href="/infinito" className="mv2-mode">
            <div className="mv2-mode-tag">INFINITE_VS</div>
            <div className="mv2-mode-icon"><ModeIcon kind="infinite" /></div>
            <h3 className="mv2-mode-title">Modo Infinito</h3>
            <p className="mv2-mode-desc">
              Más o menos. Cadena de comparaciones sin fin con una sola
              categoría. Tu intuición contra el atlas entero.
            </p>
            <div className="mv2-mode-stats">
              {bestInfinite > 0 && (
                <span className="mv2-stat-pill">Récord: {bestInfinite}</span>
              )}
            </div>
            <div className="mv2-mode-cta">Encadenar duelos →</div>
          </Link>
        </div>
      </section>

      {/* ─────────────────────── RANKINGS POPULARES ─────────────────────── */}
      <section className="mv2-section" id="rankings">
        <header className="mv2-section-head">
          <h2 className="mv2-section-title">Rankings populares</h2>
          <p className="mv2-section-sub">Los datos del mundo, ordenados.</p>
        </header>
        <div className="mv2-rankings-grid">
          {rankingsWithData.map(r => (
            <Link key={r.slug} href={`/rankings/${r.slug}`} className="mv2-rank">
              <div className="mv2-rank-head">
                <span className="mv2-rank-icon">{r.icon}</span>
                <h3 className="mv2-rank-title">{r.label}</h3>
              </div>
              <ol className="mv2-rank-list">
                {r.top.map((it, i) => (
                  <li key={it.code} className="mv2-rank-row">
                    <span className="mv2-rank-pos">{i + 1}</span>
                    <span className="mv2-rank-flag">{it.flag}</span>
                    <span className="mv2-rank-name">{it.name}</span>
                    <span className="mv2-rank-val">{formatRankingValue(r.key, it.value)}</span>
                  </li>
                ))}
              </ol>
              <span className="mv2-rank-cta">Ver ranking completo →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────────── COMPARACIONES POPULARES ─────────────────────── */}
      <section className="mv2-section" id="comparaciones">
        <header className="mv2-section-head">
          <h2 className="mv2-section-title">Comparaciones populares</h2>
          <p className="mv2-section-sub">Los duelos que la gente más busca.</p>
        </header>
        <div className="mv2-compare-grid">
          {POPULAR_COMPARISONS.map(({ a, b }) => {
            const A = countries[a]; const B = countries[b];
            if (!A || !B) return null;
            const slug = compareSlug(A.name, B.name);
            return (
              <Link key={slug} href={`/comparar/${slug}`} className="mv2-compare">
                <div className="mv2-compare-flags">
                  <span>{A.flag}</span>
                  <span className="mv2-compare-vs">vs</span>
                  <span>{B.flag}</span>
                </div>
                <div className="mv2-compare-name">{A.name} vs {B.name}</div>
                <span className="mv2-compare-cta">Ver comparación →</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────── PREGUNTAS POPULARES ─────────────────────── */}
      <section className="mv2-section" id="preguntas">
        <header className="mv2-section-head">
          <h2 className="mv2-section-title">Preguntas frecuentes sobre países</h2>
          <p className="mv2-section-sub">Las dudas geográficas que más se buscan en Google.</p>
        </header>
        <div className="mv2-questions-grid">
          {POPULAR_QUESTIONS.map(q => (
            <Link key={q.slug} href={`/preguntas/${q.slug}`} className="mv2-question">
              <span className="mv2-question-mark">?</span>
              <span className="mv2-question-text">{q.q}</span>
              <span className="mv2-question-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────────── BLOQUE EDUCATIVO ─────────────────────── */}
      <section className="mv2-section mv2-about" id="que-es">
        <div className="mv2-about-inner">
          <h2 className="mv2-section-title">¿Qué es MundoVs?</h2>
          <p>
            <strong>MundoVs</strong> es un juego online y gratuito para aprender
            geografía a base de comparar países. La idea es simple: en lugar
            de memorizar listas, descubres el mundo viendo cómo se comparan
            naciones reales con datos reales — población, economía, cultura,
            comida, turismo, costas, idiomas, rascacielos o medallas olímpicas.
          </p>
          <p>
            Cada partida combina datos de fuentes oficiales con preguntas que
            pinchan la curiosidad. ¿Hay más McDonald's en Francia o en China?
            ¿En qué país se vive más años? ¿Quién tiene más fronteras en el
            mundo? El objetivo no es ganar, es <em>quedarte con el dato</em>.
          </p>
          <p>
            El proyecto está pensado para móvil, sin registro, sin pagar nada y
            con sesiones cortas. Funciona como un &quot;Wordle de geografía&quot;
            si te apetece algo diario, como un duelo si vienes con un amigo o
            como una racha sin fin si tienes 20 minutos sueltos.
          </p>
          <div className="mv2-about-links">
            <Link href="/sobre" className="mv-btn mv-btn-secondary">Sobre el proyecto</Link>
            <Link href="/metodologia" className="mv-btn mv-btn-secondary">Metodología</Link>
            <Link href="/blog" className="mv-btn mv-btn-secondary">Blog educativo</Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────── FAQ ─────────────────────── */}
      <section className="mv2-section" id="faq">
        <header className="mv2-section-head">
          <h2 className="mv2-section-title">Preguntas frecuentes</h2>
          <p className="mv2-section-sub">Todo lo importante en seis respuestas.</p>
        </header>
        <div className="mv2-faq">
          {FAQ.map((item, i) => (
            <details key={i} className="mv2-faq-item">
              <summary>{item.q}</summary>
              <div className="mv2-faq-body">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ─────────────────────── CTA FINAL ─────────────────────── */}
      <section className="mv2-section mv2-cta-final">
        <h2 className="mv2-cta-title">¿Cuánto sabes realmente del mundo?</h2>
        <p className="mv2-cta-sub">
          El mapa no miente. Los datos tampoco. Descúbrelo en tres minutos.
        </p>
        <div className="mv2-cta-buttons">
          <Link href="/pais-del-dia" className="mv-btn mv-btn-primary mv-btn-lg">
            📡 País del Día — la misión de hoy
          </Link>
          <Link href="/clasico" className="mv-btn mv-btn-secondary mv-btn-lg">
            🆚 Comparar dos países ahora
          </Link>
        </div>
      </section>
    </Layout>
  );
}
