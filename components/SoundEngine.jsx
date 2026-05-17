import { useState, useEffect } from "react";

// Sound effects usando Web Audio API (sin archivos externos)
class SoundEngine {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.mounted = false;
  }

  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!this.mounted) {
      this.mounted = true;
      // Cargar preferencia
      try {
        const saved = localStorage.getItem("mundovs_sound");
        this.enabled = saved === "true";
      } catch(e) {}
    }
  }

  toggle() {
    if (typeof window === "undefined") return false;
    this.enabled = !this.enabled;
    try {
      localStorage.setItem("mundovs_sound", String(this.enabled));
    } catch(e) {}
    return this.enabled;
  }

  playTone(frequency, duration, type = "sine", gain = 0.1) {
    if (!this.enabled || typeof window === "undefined") return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    g.gain.setValueAtTime(gain, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(g);
    g.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  correct() {
    this.playTone(523.25, 0.1, "sine", 0.08);
    setTimeout(() => this.playTone(659.25, 0.1, "sine", 0.08), 80);
    setTimeout(() => this.playTone(783.99, 0.15, "sine", 0.1), 160);
  }

  wrong() {
    this.playTone(220, 0.15, "triangle", 0.06);
    setTimeout(() => this.playTone(185, 0.2, "triangle", 0.06), 100);
  }

  achievement() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, "sine", 0.08), i * 80);
    });
  }

  click() {
    this.playTone(800, 0.03, "square", 0.03);
  }

  whoosh() {
    if (!this.enabled || typeof window === "undefined") return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);
    
    g.gain.setValueAtTime(0.02, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(g);
    g.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}

export const sound = new SoundEngine();

export function SoundToggle() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    sound.init();
    setEnabled(sound.enabled);
  }, []);

  const toggle = () => {
    const newState = sound.toggle();
    setEnabled(newState);
    if (newState) sound.click();
  };

  if (!mounted) return null;

  return (
    <button className="sound-toggle" onClick={toggle} title={enabled ? "Desactivar sonido" : "Activar sonido"}>
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
