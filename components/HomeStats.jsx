import { useEffect, useState, useRef } from "react";

function AnimatedStat({ target, label, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <div className="home-stats-item" ref={ref}>
      <div className="home-stats-number">
        {count === target && suffix === "∞" ? suffix : count}
      </div>
      <div className="home-stats-label">{label}</div>
    </div>
  );
}

export default function HomeStats() {
  return (
    <div className="home-stats">
      <AnimatedStat target={195} label="Países" />
      <AnimatedStat target={8} label="Pistas diarias" />
      <AnimatedStat target={1} label="Diversión" suffix="∞" />
    </div>
  );
}
