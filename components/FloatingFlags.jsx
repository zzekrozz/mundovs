import { useMemo } from "react";

const FLAG_EMOJIS = [
  "🇪🇸", "🇫🇷", "🇮🇹", "🇩🇪", "🇬🇧", "🇵🇹",
  "🇧🇷", "🇦🇷", "🇲🇽", "🇨🇴", "🇺🇸", "🇨🇦",
  "🇯🇵", "🇨🇳", "🇮🇳", "🇰🇷", "🇦🇺", "🇷🇺",
];

export default function FloatingFlags({ count = 12, speed = "slow" }) {
  const flags = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      emoji: FLAG_EMOJIS[i % FLAG_EMOJIS.length],
      left: `${(i * 8) % 100}%`,
      delay: `${i * 1.5}s`,
      duration: speed === "slow" ? `${40 + (i % 4) * 10}s` : `${25 + (i % 3) * 8}s`,
    }));
  }, [count, speed]);

  return (
    <div className="floating-flags" aria-hidden="true">
      {flags.map((flag, i) => (
        <div
          key={i}
          className="floating-flag"
          style={{
            left: flag.left,
            animationDelay: flag.delay,
            animationDuration: flag.duration,
          }}
        >
          {flag.emoji}
        </div>
      ))}
    </div>
  );
}
