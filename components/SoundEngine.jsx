import { useState } from "react";

// Sound effects usando Web Audio API (sin archivos externos)
class SoundEngine {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    
    // Cargar preferencia
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mundovs_sound");
      this.enabled = saved === "true";
    }
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("mundovs_sound", String(this.enabled));
    }
    return this.enabled;
  }

  playTone(frequency, duration, type = "sine", gain = 0.1) {
    if (!this.enabled) return;
    this.init();
    
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
    // Do-Mi-Sol ascendente (tríada mayor alegre)
    this.playTone(523.25, 0.1, "sine", 0.08);
    setTimeout(() => this.playTone(659.25, 0.1, "sine", 0.08), 80);
    setTimeout(() => this.playTone(783.99, 0.15, "sine", 0.1), 160);
  }

  wrong() {
    // Dos tonos graves descendentes
    this.playTone(220, 0.15, "triangle", 0.06);
    setTimeout(() => this.playTone(185, 0.2, "triangle", 0.06), 100);
  }

  achievement() {
    // Arpeggio triunfal
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, "sine", 0.08), i * 80);
    });
  }

  click() {
    // Click sutil
    this.playTone(800, 0.03, "square", 0.03);
  }

  whoosh() {
    // Transición suave
    if (!this.enabled) return;
    this.init();
    
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
  const [enabled, setEnabled] = useState(sound.enabled);

  const toggle = () => {
    const newState = sound.toggle();
    setEnabled(newState);
    if (newState) sound.click();
  };

  return (
    <button className="sound-toggle" onClick={toggle} title={enabled ? "Desactivar sonido" : "Activar sonido"}>
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
