import StreakBadge from "./StreakBadge";

export default function StatsSidebar({
  currentStreak,
  bestStreak,
  currentRound,
  totalRounds,
  score,
  mode = "classic",
}) {
  const progress = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;

  return (
    <aside className="stats-sidebar">
      <div className="stats-sidebar-section">
        <h3 className="stats-sidebar-title">Racha</h3>
        {currentStreak > 0 ? (
          <StreakBadge count={currentStreak} size="large" />
        ) : (
          <div className="stats-empty">🎯 Empieza</div>
        )}
      </div>

      {bestStreak > 0 && (
        <div className="stats-sidebar-section">
          <h3 className="stats-sidebar-title">Récord</h3>
          <div className="stats-best">
            <span className="stats-best-icon">🏆</span>
            <span className="stats-best-num">{bestStreak}</span>
          </div>
        </div>
      )}

      {mode === "classic" && totalRounds > 0 && (
        <div className="stats-sidebar-section">
          <h3 className="stats-sidebar-title">Ronda</h3>
          <div className="stats-progress-ring">
            <svg viewBox="0 0 100 100" className="stats-circle">
              <circle cx="50" cy="50" r="45" className="stats-circle-bg" />
              <circle
                cx="50" cy="50" r="45"
                className="stats-circle-fill"
                style={{ strokeDasharray: `${progress * 2.827} 282.7` }}
              />
            </svg>
            <div className="stats-progress-text">
              <div className="stats-progress-num">{currentRound}</div>
              <div className="stats-progress-label">de {totalRounds}</div>
            </div>
          </div>
        </div>
      )}

      {score !== undefined && mode === "classic" && (
        <div className="stats-sidebar-section">
          <h3 className="stats-sidebar-title">Score</h3>
          <div className="stats-score">
            <span className="stats-score-num">{score}</span>
            <span className="stats-score-label">✓</span>
          </div>
        </div>
      )}
    </aside>
  );
}
