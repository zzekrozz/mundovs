export default function StreakBadge({ count, variant = "default", size = "medium" }) {
  if (!count || count <= 0) return null;

  const icons = {
    fire: "🔥",
    star: "⭐",
    trophy: "🏆",
    lightning: "⚡",
  };

  const getVariantStyle = () => {
    if (count >= 10) return { icon: icons.trophy, bg: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", pulse: true };
    if (count >= 5) return { icon: icons.fire, bg: "linear-gradient(135deg, #FF8C42 0%, #E24B4A 100%)", pulse: true };
    if (count >= 3) return { icon: icons.lightning, bg: "linear-gradient(135deg, #378ADD 0%, #2563EB 100%)", pulse: false };
    return { icon: icons.star, bg: "linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)", pulse: false };
  };

  const style = getVariantStyle();
  const sizeClass = size === "small" ? "streak-badge-small" : size === "large" ? "streak-badge-large" : "";

  return (
    <div className={`streak-badge ${sizeClass} ${style.pulse ? "streak-pulse" : ""}`} style={{ background: style.bg }}>
      <span className="streak-icon">{style.icon}</span>
      <span className="streak-count">{count}</span>
    </div>
  );
}
