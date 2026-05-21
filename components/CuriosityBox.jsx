export default function CuriosityBox({ text, icon = "💡", category, variant = "info", size = "default" }) {
  if (!text) return null;
  
  const icons = {
    tech: "💻",
    culture: "🎭",
    economy: "💰",
    people: "👥",
    power: "⚔️",
    geography: "🌍",
    surprise: "🔥",
    fact: "💡",
    trophy: "🏆",
    star: "⭐",
    lightbulb: "💡",
    fire: "🔥",
    chart: "📊",
    globe: "🌎",
  };
  
  const displayIcon = icons[icon] || icon;
  const sizeClass = size === "small" ? "curiosity-small" : size === "large" ? "curiosity-large" : "";
  
  return (
    <div className={`curiosity-box curiosity-${variant} ${sizeClass}`}>
      <div className="curiosity-icon">{displayIcon}</div>
      <div className="curiosity-content">
        <p className="curiosity-text">{text}</p>
        {category && <span className="curiosity-badge">{category}</span>}
      </div>
    </div>
  );
}
