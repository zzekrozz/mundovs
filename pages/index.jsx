import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import InteractiveHero from "../components/InteractiveHero";
import HomeStats from "../components/HomeStats";

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
      
      <div className="modes-selector">
        <Link href="/pais-del-dia" className="mode-card mode-card-featured">
          <div className="mode-card-badge">⭐ NUEVO</div>
          <div className="mode-card-icon">🌍</div>
          <h2 className="mode-card-title">País del Día</h2>
          <p className="mode-card-description">
            Un país secreto al día. Cada fallo revela una pista.
          </p>
          
          {streakInfo.current > 0 && (
            <div className="mode-card-stat">
              🔥 Racha: <strong>{streakInfo.current} {streakInfo.current === 1 ? "día" : "días"}</strong>
            </div>
          )}
          {hasPlayedToday && (
            <div className="mode-card-stat mode-card-stat-success">
              ✅ Ya jugaste hoy
            </div>
          )}
          
          <div className="mode-card-cta">
            {hasPlayedToday ? "Ver resultado →" : "Jugar →"}
          </div>
        </Link>
        
        <Link href="/challenger" className="mode-card mode-card-challenger">
          <div className="mode-card-icon">⚡</div>
          <h2 className="mode-card-title">Challenger</h2>
          <p className="mode-card-description">
            Aciertos infinitos hasta el primer fallo. Bate tu récord.
          </p>
          
          {bestVsStreak > 0 && (
            <div className="mode-card-stat">
              🏆 Récord: <strong>{bestVsStreak}</strong>
            </div>
          )}
          
          <div className="mode-card-cta">
            Empezar →
          </div>
        </Link>
        
        <Link href="/clasico" className="mode-card mode-card-classic">
          <div className="mode-card-icon">⚔️</div>
          <h2 className="mode-card-title">Mundo VS</h2>
          <p className="mode-card-description">
            Compara dos países en 5 rondas rápidas.
          </p>
          <div className="mode-card-cta">
            Jugar →
          </div>
        </Link>
      </div>
      
      <HomeStats />
      
      <div className="home-about">
        <h2 className="home-about-title">¿Qué es MundoVs?</h2>
        <p className="home-about-text">
          MundoVs es una herramienta educativa gratuita para descubrir el mundo a través de juegos de geografía.
          Datos verificados de fuentes oficiales (Banco Mundial, ONU, OMS) presentados de forma divertida y compartible.
        </p>
        <div className="home-about-links">
          <Link href="/sobre" className="home-about-link">📖 Sobre el proyecto</Link>
          <Link href="/metodologia" className="home-about-link">📊 Metodología</Link>
          <Link href="/blog" className="home-about-link">✍️ Blog educativo</Link>
        </div>
      </div>
    </Layout>
  );
}
