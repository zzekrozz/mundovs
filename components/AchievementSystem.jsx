import { useEffect, useState } from "react";

const ACHIEVEMENTS = [
  { id: "first_win", icon: "🎯", name: "Primer acierto", desc: "Acertaste tu primera pregunta", req: (stats) => stats.totalCorrect >= 1 },
  { id: "streak_5", icon: "🔥", name: "En racha", desc: "5 aciertos seguidos", req: (stats) => stats.bestStreak >= 5 },
  { id: "streak_10", icon: "⚡", name: "Imparable", desc: "10 aciertos seguidos", req: (stats) => stats.bestStreak >= 10 },
  { id: "streak_20", icon: "🏆", name: "Leyenda", desc: "20 aciertos seguidos", req: (stats) => stats.bestStreak >= 20 },
  { id: "games_10", icon: "🎮", name: "Veterano", desc: "Completaste 10 partidas", req: (stats) => stats.gamesPlayed >= 10 },
  { id: "games_50", icon: "🌟", name: "Adicto", desc: "Completaste 50 partidas", req: (stats) => stats.gamesPlayed >= 50 },
  { id: "perfect_game", icon: "💯", name: "Perfecto", desc: "5/5 en una partida clásica", req: (stats) => stats.perfectGames >= 1 },
  { id: "explorer", icon: "🗺️", name: "Explorador", desc: "Jugaste con 20 países diferentes", req: (stats) => stats.countriesPlayed >= 20 },
  { id: "scholar", icon: "📚", name: "Erudito", desc: "Acertaste 100 preguntas", req: (stats) => stats.totalCorrect >= 100 },
];

export default function AchievementSystem({ currentStats, onNewAchievement }) {
  const [mounted, setMounted] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Cargar logros desbloqueados
    try {
      const saved = localStorage.getItem("mundovs_achievements");
      if (saved) setAchievements(JSON.parse(saved));
    } catch(e) {}
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !currentStats) return;

    // Verificar logros nuevos
    const unlocked = achievements.map(a => a.id);
    const newOnes = ACHIEVEMENTS.filter(ach => 
      !unlocked.includes(ach.id) && ach.req(currentStats)
    );

    if (newOnes.length > 0) {
      const updated = [...achievements, ...newOnes];
      setAchievements(updated);
      
      try {
        localStorage.setItem("mundovs_achievements", JSON.stringify(updated));
      } catch(e) {}
      
      // Mostrar badge nuevo
      setNewBadge(newOnes[0]);
      if (onNewAchievement) onNewAchievement(newOnes[0]);
      
      setTimeout(() => setNewBadge(null), 4000);
    }
  }, [currentStats, achievements, onNewAchievement, mounted]);

  if (!mounted || !newBadge) return null;

  return (
    <div className="achievement-popup">
      <div className="achievement-badge">
        <div className="achievement-icon">{newBadge.icon}</div>
        <div className="achievement-content">
          <div className="achievement-title">¡Logro desbloqueado!</div>
          <div className="achievement-name">{newBadge.name}</div>
          <div className="achievement-desc">{newBadge.desc}</div>
        </div>
      </div>
    </div>
  );
}

export function AchievementsList() {
  const [mounted, setMounted] = useState(false);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    try {
      const saved = localStorage.getItem("mundovs_achievements");
      if (saved) setAchievements(JSON.parse(saved));
    } catch(e) {}
  }, [mounted]);

  if (!mounted) return null;

  const unlocked = achievements.map(a => a.id);

  return (
    <div className="achievements-grid">
      {ACHIEVEMENTS.map(ach => {
        const isUnlocked = unlocked.includes(ach.id);
        return (
          <div 
            key={ach.id} 
            className={`achievement-item ${isUnlocked ? "achievement-unlocked" : "achievement-locked"}`}
          >
            <div className="achievement-item-icon">{isUnlocked ? ach.icon : "🔒"}</div>
            <div className="achievement-item-name">{isUnlocked ? ach.name : "???"}</div>
            {isUnlocked && <div className="achievement-item-desc">{ach.desc}</div>}
          </div>
        );
      })}
    </div>
  );
}
