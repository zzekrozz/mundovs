import { useEffect, useState } from "react";

export default function ConfettiLight({ show, duration = 2000 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!isVisible) return null;

  const pieces = 8; // Ligero: solo 8 piezas
  const colors = ["#1D9E75", "#FF8C42", "#378ADD", "#FFD700"];

  return (
    <div className="confetti-light" aria-hidden="true">
      {Array.from({ length: pieces }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${20 + (i * 10)}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${1.5 + (i % 3) * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}
