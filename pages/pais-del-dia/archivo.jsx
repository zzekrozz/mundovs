import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import countriesData from "../../data/countries_full.json";

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

function getDayNumber() {
  const now = new Date();
  const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.floor((utcNow.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
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

function getCountryOfDay(d) { 
  const p = buildCountryPool(); 
  return countriesData[p[((d%p.length)+p.length)%p.length]]; 
}

export default function PaisDelDiaArchivo() {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState(0);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    setMounted(true);
    const t = getDayNumber();
    setToday(t);
    
    // Cargar progreso de todos los días
    const allProgress = {};
    for (let d = 0; d <= t; d++) {
      try {
        const key = d === t ? "mundovs_pais_del_dia" : `mundovs_pais_del_dia_archive_${d}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const data = JSON.parse(saved);
          allProgress[d] = data.gameStatus || "playing";
        }
      } catch(e) {}
    }
    setProgress(allProgress);
  }, []);

  if (!mounted) {
    return (
      <Layout>
        <div className="pdd-loading"><div className="pdd-loading-globe">🌍</div>Cargando...</div>
      </Layout>
    );
  }

  // Generar lista de días (del más reciente al más antiguo)
  const days = [];
  for (let d = today; d >= 0; d--) {
    const country = getCountryOfDay(d);
    const date = new Date(START_DATE);
    date.setUTCDate(date.getUTCDate() + d);
    const formatted = date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    const status = progress[d] || "not_played";
    days.push({ day: d, country, date: formatted, status, isToday: d === today });
  }

  return (
    <Layout>
      <Head>
        <title>Archivo de retos · País del Día · MundoVs</title>
        <meta name="description" content="Juega los retos anteriores de País del Día. Todos los países secretos desde el inicio." />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="pdd-archive-page">
        <div className="pdd-archive-header">
          <Link href="/pais-del-dia" className="pdd-archive-back">← Reto de hoy</Link>
          <h1 className="pdd-archive-title">Archivo de retos</h1>
          <p className="pdd-archive-subtitle">
            Juega cualquier día anterior. Los aciertos en archivo no cuentan para la racha.
          </p>
        </div>

        <div className="pdd-archive-grid">
          {days.map(d => (
            <Link 
              key={d.day} 
              href={d.isToday ? "/pais-del-dia" : `/pais-del-dia/dia/${d.day}`}
              className={`pdd-archive-card pdd-archive-${d.status} ${d.isToday ? "pdd-archive-today" : ""}`}
            >
              <div className="pdd-archive-card-day">DÍA #{d.day}</div>
              <div className="pdd-archive-card-date">{d.date}</div>
              {d.isToday && <div className="pdd-archive-card-badge">HOY</div>}
              <div className="pdd-archive-card-status">
                {d.status === "won" && "✅ Acertado"}
                {d.status === "lost" && "❌ Fallado"}
                {d.status === "playing" && "🎯 En curso"}
                {d.status === "not_played" && "Sin jugar"}
              </div>
              <div className="pdd-archive-card-cta">Jugar →</div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
