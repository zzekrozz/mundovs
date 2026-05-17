export default function CuriosityBox({ text, icon = "💡", category, variant = "info" }) {
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
  };
  
  const displayIcon = icons[icon] || icon;
  
  return (
    <div className={`curiosity-box curiosity-${variant}`}>
      <div className="curiosity-icon">{displayIcon}</div>
      <div className="curiosity-content">
        <p className="curiosity-text">{text}</p>
        {category && <span className="curiosity-badge">{category}</span>}
      </div>
    </div>
  );
}
