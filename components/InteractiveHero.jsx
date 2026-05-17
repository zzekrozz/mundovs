import { useEffect, useRef, useState } from "react";

// Capitales importantes para puntos de luz (subset representativo)
const CAPITAL_LIGHTS = [
  { name: "Madrid", x: 48, y: 42 },
  { name: "París", x: 49, y: 40 },
  { name: "Londres", x: 48, y: 38 },
  { name: "Berlín", x: 51, y: 39 },
  { name: "Roma", x: 51, y: 44 },
  { name: "Moscú", x: 60, y: 35 },
  { name: "El Cairo", x: 55, y: 48 },
  { name: "Lagos", x: 49, y: 54 },
  { name: "Ciudad del Cabo", x: 52, y: 68 },
  { name: "Nueva York", x: 25, y: 42 },
  { name: "Ciudad de México", x: 18, y: 48 },
  { name: "São Paulo", x: 32, y: 63 },
  { name: "Buenos Aires", x: 31, y: 68 },
  { name: "Tokio", x: 82, y: 44 },
  { name: "Pekín", x: 75, y: 42 },
  { name: "Delhi", x: 68, y: 48 },
  { name: "Bangkok", x: 72, y: 52 },
  { name: "Sídney", x: 85, y: 68 },
];

export default function InteractiveHero() {
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    const handleTouchMove = (e) => {
      if (!heroRef.current || !e.touches[0]) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      hero.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    return () => {
      if (hero) {
        hero.removeEventListener("mousemove", handleMouseMove);
        hero.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, []);

  // Parallax transform
  const parallaxX = (mousePos.x - 50) * 0.015; // Muy sutil
  const parallaxY = (mousePos.y - 50) * 0.015;

  return (
    <div className="hero-interactive" ref={heroRef}>
      {/* Fondo con mapamundi parallax */}
      <div 
        className="hero-world-layer"
        style={{
          transform: mounted ? `translate(${parallaxX}%, ${parallaxY}%)` : 'translate(0, 0)',
        }}
      >
        {/* Mapamundi base (muy sutil) */}
        <div className="hero-world-map" />
        
        {/* Puntos de luz en capitales */}
        {CAPITAL_LIGHTS.map((city, i) => (
          <div
            key={city.name}
            className="hero-light-point"
            style={{
              left: `${city.x}%`,
              top: `${city.y}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="hero-content">
        <h1 className="hero-title">
          ¿Conoces<br />
          el <span className="hero-title-highlight">mundo</span>?
        </h1>
        <p className="hero-subtitle">
          Tres formas de descubrirlo. Elige tu reto.
        </p>
      </div>

      {/* Partículas flotantes en laterales (solo desktop) */}
      <div className="hero-particles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              left: i % 2 === 0 ? `${5 + i * 3}%` : `${85 + (i % 3) * 4}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${20 + i * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
