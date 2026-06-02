export default function StreakBadge({ count, variant = "default", size = "medium" }) {
  if (!count || count <= 0) return null;

  const icons = {
    fire: "🔥",
    star: "⭐",
    trophy: "🏆",
    lightning: "⚡",
  };

  const getVariantStyle = () => {
    if (count >= 10) return { icon: icons.trophy, bg: "var(--mv-grad-gold)", pulse: true };
    if (count >= 5) return { icon: icons.fire, bg: "linear-gradient(135deg, #FF8C42 0%, var(--mv-red) 100%)", pulse: true };
    if (count >= 3) return { icon: icons.lightning, bg: "var(--mv-grad-blue)", pulse: false };
    return { icon: icons.star, bg: "var(--mv-grad-green)", pulse: false };
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
