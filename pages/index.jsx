import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import InteractiveHero from "../components/InteractiveHero";

function EmblemPais() {
  return (
    <svg width="60" height="68" viewBox="0 0 60 68" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="8" width="48" height="54" rx="5" fill="none" stroke="#1a4f63" strokeWidth="1.2"/>
      <line x1="6" y1="20" x2="54" y2="20" stroke="#1a4f63" strokeWidth=".8"/>
      <line x1="20" y1="8" x2="20" y2="62" stroke="#1a4f63" strokeWidth=".8"/>
      <path d="M 13 34 Q 24 28 30 38 Q 36 48 47 42" fill="none" stroke="#1d9e75" strokeWidth="1.2" opacity=".55"/>
      <circle cx="30" cy="38" r="3.5" fill="none" stroke="#1d9e75" strokeWidth="1.5"/>
      <circle cx="30" cy="38" r="1.5" fill="#1d9e75"/>
      <line x1="30" y1="34.5" x2="30" y2="18" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 23 18 Q 26.5 14 30 18 Q 33.5 22 39 16 Q 33.5 10 30 16 Q 26.5 14 23 18 Z" fill="#1d9e75" opacity=".85"/>
    </svg>
  );
}

function EmblemChallenger() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="28" cy="28" r="24" fill="none" stroke="#1a4f63" strokeWidth="1"/>
      <circle cx="28" cy="28" r="17" fill="none" stroke="#1d9e75" strokeWidth="1" opacity=".4" strokeDasharray="3 2.5"/>
      <circle cx="28" cy="28" r="10" fill="none" stroke="#1d9e75" strokeWidth="1.5" opacity=".7"/>
      <circle cx="28" cy="28" r="4.5" fill="none" stroke="#1d9e75" strokeWidth="1.8"/>
      <circle cx="28" cy="28" r="2" fill="#1d9e75"/>
      <line x1="28" y1="4" x2="28" y2="10" stroke="#1d9e75" strokeWidth="1.2" opacity=".5"/>
      <line x1="28" y1="46" x2="28" y2="52" stroke="#1d9e75" strokeWidth="1.2" opacity=".5"/>
      <line x1="4" y1="28" x2="10" y2="28" stroke="#1d9e75" strokeWidth="1.2" opacity=".5"/>
      <line x1="46" y1="28" x2="52" y2="28" stroke="#1d9e75" strokeWidth="1.2" opacity=".5"/>
    </svg>
  );
}

function EmblemVS() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="16" cy="28" r="11" fill="none" stroke="#1d9e75" strokeWidth="1.5"/>
      <circle cx="16" cy="28" r="5" fill="none" stroke="#1d9e75" strokeWidth="1" opacity=".5"/>
      <circle cx="40" cy="28" r="11" fill="none" stroke="#1a6080" strokeWidth="1.5"/>
      <circle cx="40" cy="28" r="5" fill="none" stroke="#1a6080" strokeWidth="1" opacity=".5"/>
      <line x1="24" y1="28" x2="32" y2="28" stroke="#7fa8b8" strokeWidth="1.2" opacity=".7"/>
      <polygon points="28,23.5 32,28 28,32.5" fill="#7fa8b8" opacity=".5"/>
      <polygon points="28,23.5 24,28 28,32.5" fill="#7fa8b8" opacity=".5"/>
    </svg>
  );
}

export default function Home() {
  const [streakInfo, setStreakInfo] = useState({ current: 0, best: 0 });
  const [bestVsStreak, setBestVsStreak] = useState(0);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  useEffect(() => {
    try {
      const pddStreak = JSON.parse(
        localStorage.getItem("mundovs_pais_del_dia_streak") || '{"current":0,"best":0}'
      );
      setStreakInfo(pddStreak);

      const today = new Date();
      const todayStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
      const pddState = JSON.parse(localStorage.getItem("mundovs_pais_del_dia") || "{}");
      if (pddState.date === todayStr && (pddState.gameStatus === "won" || pddState.gameStatus === "lost")) {
        setHasPlayedToday(true);
      }

      const vsStreak = parseInt(localStorage.getItem("mundovs_best_streak") || "0", 10);
      setBestVsStreak(vsStreak);
    } catch (e) {}
  }, []);

  return (
    <Layout>
      <Head>
        <title>MundoVs — El reto diario de geografía</title>
        <meta name="description" content="Cada día un país secreto. Compara naciones. Bate récords de aciertos. Tres modos de juego para descubrir el mundo." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="MundoVs — ¿Conoces el mundo?" />
        <meta property="og:description" content="Cada día un país secreto. Tres modos de juego. Reta a tus amigos." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <InteractiveHero />

      <div className="mv-modes">

        {/* País del Día - featured */}
        <Link href="/pais-del-dia" className="mv-card mv-card-featured">
          <div className="mv-card-topline" />
          <div className="mv-card-inner">
            <div className="mv-card-emblem">
              <EmblemPais />
            </div>
            <div className="mv-card-body">
              <div className="mv-mission-tag">
                <span className="mv-dot" />
                DAILY_MISSION_001
              </div>
              <h2 className="mv-card-title">País del Día</h2>
              <p className="mv-card-desc">
                Un país secreto cada día. Pistas con cada intento.
              </p>
              {streakInfo.current > 0 && (
                <div className="mv-card-stat">
                  RACHA: {streakInfo.current} {streakInfo.current === 1 ? "día" : "días"}
                </div>
              )}
              {hasPlayedToday && (
                <div className="mv-card-stat mv-stat-done">YA JUGASTE HOY</div>
              )}
              <div className="mv-card-cta">
                {hasPlayedToday ? "Ver resultado" : "Iniciar misión"} ›
              </div>
            </div>
          </div>
        </Link>

        {/* Fila secundaria */}
        <div className="mv-secondary-row">

          <Link href="/challenger" className="mv-card mv-card-sm mv-card-challenger">
            <div className="mv-card-topline mv-topline-challenger" />
            <div className="mv-card-emblem mv-emblem-top">
              <EmblemChallenger />
            </div>
            <div className="mv-card-body">
              <div className="mv-mission-tag" style={{fontSize:"7px"}}>ENDLESS_MODE</div>
              <h2 className="mv-card-title mv-title-sm">Challenger</h2>
              <p className="mv-card-desc mv-desc-sm">Racha infinita. Sin red de seguridad.</p>
              {bestVsStreak > 0 && (
                <div className="mv-card-stat" style={{fontSize:"10px"}}>RÉCORD: {bestVsStreak}</div>
              )}
            </div>
          </Link>

          <Link href="/clasico" className="mv-card mv-card-sm mv-card-vs">
            <div className="mv-card-topline mv-topline-vs" />
            <div className="mv-card-emblem mv-emblem-top">
              <EmblemVS />
            </div>
            <div className="mv-card-body">
              <div className="mv-mission-tag" style={{fontSize:"7px"}}>VERSUS_MODE</div>
              <h2 className="mv-card-title mv-title-sm">Mundo VS</h2>
              <p className="mv-card-desc mv-desc-sm">Compara dos naciones. 5 rondas.</p>
            </div>
          </Link>

        </div>
      </div>

      <div className="mv-stats-row">
        <div className="mv-stat-box">
          <div className="mv-stat-num">2M+</div>
          <div className="mv-stat-label">Exploradores</div>
        </div>
        <div className="mv-stat-box">
          <div className="mv-stat-num">195</div>
          <div className="mv-stat-label">Territorios</div>
        </div>
        <div className="mv-stat-box">
          <div className="mv-stat-num">50+</div>
          <div className="mv-stat-label">Categorías</div>
        </div>
      </div>

      <div className="home-about">
        <h2 className="home-about-title">¿Qué es MundoVs?</h2>
        <p className="home-about-text">
          MundoVs es una herramienta educativa gratuita para descubrir el mundo a través de juegos de geografía.
          Datos verificados de fuentes oficiales (Banco Mundial, ONU, OMS) presentados de forma divertida y compartible.
        </p>
        <div className="home-about-links">
          <Link href="/sobre" className="home-about-link">Sobre el proyecto</Link>
          <Link href="/metodologia" className="home-about-link">Metodología</Link>
          <Link href="/blog" className="home-about-link">Blog educativo</Link>
        </div>
      </div>
    </Layout>
  );
}
