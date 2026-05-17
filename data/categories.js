// Definición de las 20 categorías de comparación
// Cada categoría tiene:
// - key: nombre del campo en countries.json
// - label: nombre corto para mostrar
// - question: pregunta al usuario
// - format: formato de valor
// - phrase: frase viral
// - dir: "higher" gana el más alto, "lower" gana el más bajo
// - group: grupo visual
// - gradient: gradiente de fondo
// - backgrounds: array de URLs SVG de fondo

export const CATEGORIES = [
  {
    key: "population", label: "Población", group: "basicos",
    question: "¿Quién tiene más habitantes?",
    gradient: "linear-gradient(135deg, #FFE5C2 0%, #FFD89B 100%)",
    backgrounds: ["/illustrations/population-density.svg"],
    format: (v) => v >= 1e9 ? (v/1e9).toFixed(2) + "B" : v >= 1e6 ? (v/1e6).toFixed(1) + "M" : (v/1e3).toFixed(0) + "k",
    phrase: (a, b) => {
      const r = Math.max(a,b) / Math.min(a,b);
      if (r >= 2) return r.toFixed(1) + "x más habitantes";
      const diff = Math.abs(a-b) / 1e6;
      return diff.toFixed(1) + "M más habitantes";
    },
    dir: "higher",
  },
  {
    key: "area", label: "Superficie", group: "basicos",
    question: "¿Quién es más grande en superficie?",
    gradient: "linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)",
    backgrounds: ["/illustrations/forest.svg"],
    format: (v) => v >= 1e6 ? (v/1e6).toFixed(2) + "M km²" : (v/1e3).toFixed(0) + "k km²",
    phrase: (a, b) => (Math.max(a,b) / Math.min(a,b)).toFixed(1) + "x más grande en superficie",
    dir: "higher",
  },
  {
    key: "density", label: "Densidad", group: "basicos",
    question: "¿Quién tiene más densidad de población?",
    gradient: "linear-gradient(135deg, #FFCCBC 0%, #FFAB91 100%)",
    backgrounds: ["/illustrations/population-density.svg"],
    format: (v) => v + " hab/km²",
    phrase: (a, b) => (Math.max(a,b) / Math.min(a,b)).toFixed(1) + "x más densamente poblado",
    dir: "higher",
  },
  {
    key: "gdp_total", label: "PIB total", group: "economia",
    question: "¿Quién tiene mayor PIB total?",
    gradient: "linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%)",
    backgrounds: ["/illustrations/gdp.svg"],
    format: (v) => v >= 1e12 ? "$" + (v/1e12).toFixed(2) + "T" : "$" + (v/1e9).toFixed(0) + "B",
    phrase: (a, b) => (Math.max(a,b) / Math.min(a,b)).toFixed(1) + "x más PIB total",
    dir: "higher",
  },
  {
    key: "gdp_per_capita", label: "PIB per cápita", group: "economia",
    question: "¿Quién es más rico (PIB per cápita)?",
    gradient: "linear-gradient(135deg, #FFF9C4 0%, #FFEE58 100%)",
    backgrounds: ["/illustrations/gdp.svg"],
    format: (v) => "$" + v.toLocaleString(),
    phrase: (a, b) => (Math.max(a,b) / Math.min(a,b)).toFixed(1) + "x más rico por habitante",
    dir: "higher",
  },
  {
    key: "average_salary", label: "Salario medio", group: "economia",
    question: "¿Dónde se cobra más de salario medio?",
    gradient: "linear-gradient(135deg, #DCEDC8 0%, #C5E1A5 100%)",
    backgrounds: ["/illustrations/gdp.svg"],
    format: (v) => "$" + v.toLocaleString(),
    phrase: (a, b) => "$" + Math.abs(a-b).toLocaleString() + " más de salario medio",
    dir: "higher",
  },
  {
    key: "cost_of_living_index", label: "Coste de vida", group: "economia",
    question: "¿Dónde es más caro vivir?",
    gradient: "linear-gradient(135deg, #FFCDD2 0%, #EF9A9A 100%)",
    backgrounds: ["/illustrations/gdp.svg"],
    format: (v) => v.toFixed(1) + " pts",
    phrase: (a, b) => (Math.max(a,b) / Math.min(a,b)).toFixed(1) + "x más caro vivir",
    dir: "higher",
  },
//   {
//     key: "life_expectancy", label: "Esperanza de vida", group: "humanos",
//     question: "¿Quién vive más años?",
//     gradient: "linear-gradient(135deg, #B2DFDB 0%, #80CBC4 100%)",
//     backgrounds: ["/illustrations/life-expectancy.svg"],
//     format: (v) => v.toFixed(1) + " años",
//     phrase: (a, b) => Math.abs(a-b).toFixed(1) + " años más de esperanza de vida",
//     dir: "higher",
//   },
  {
    key: "median_age", label: "Edad media", group: "humanos",
    question: "¿Dónde la población es más vieja?",
    gradient: "linear-gradient(135deg, #D7CCC8 0%, #BCAAA4 100%)",
    backgrounds: ["/illustrations/life-expectancy.svg"],
    format: (v) => v.toFixed(1) + " años",
    phrase: (a, b) => Math.abs(a-b).toFixed(1) + " años más de edad mediana",
    dir: "higher",
  },
  {
    key: "average_height_male", label: "Altura media (h)", group: "humanos",
    question: "¿Dónde son más altos los hombres?",
    gradient: "linear-gradient(135deg, #C5CAE9 0%, #9FA8DA 100%)",
    backgrounds: ["/illustrations/life-expectancy.svg"],
    format: (v) => v.toFixed(1) + " cm",
    phrase: (a, b) => Math.abs(a-b).toFixed(1) + " cm más altos de media",
    dir: "higher",
  },
  {
    key: "obesity_rate", label: "Obesidad", group: "humanos",
    question: "¿Quién tiene más tasa de obesidad?",
    gradient: "linear-gradient(135deg, #F8BBD0 0%, #F48FB1 100%)",
    backgrounds: ["/illustrations/life-expectancy.svg"],
    format: (v) => v.toFixed(1) + "%",
    phrase: (a, b) => Math.abs(a-b).toFixed(1) + " puntos más de obesidad",
    dir: "higher",
  },
  {
    key: "internet_users_percent", label: "Internet", group: "sociedad",
    question: "¿Dónde hay más usuarios de internet (%)?",
    gradient: "linear-gradient(135deg, #B3E5FC 0%, #81D4FA 100%)",
    backgrounds: ["/illustrations/internet-speed.svg"],
    format: (v) => v.toFixed(1) + "%",
    phrase: (a, b) => Math.abs(a-b).toFixed(1) + " puntos más de penetración de internet",
    dir: "higher",
  },
  {
    key: "education_index", label: "Educación", group: "sociedad",
    question: "¿Quién tiene mejor índice de educación?",
    gradient: "linear-gradient(135deg, #BBDEFB 0%, #90CAF9 100%)",
    backgrounds: ["/illustrations/education.svg"],
    format: (v) => v.toFixed(3),
    phrase: (a, b) => "mejor índice de educación (PNUD)",
    dir: "higher",
  },
  {
    key: "military_spending", label: "Gasto militar", group: "poder",
    question: "¿Quién gasta más en defensa militar?",
    gradient: "linear-gradient(135deg, #CFD8DC 0%, #B0BEC5 100%)",
    backgrounds: ["/illustrations/military.svg"],
    format: (v) => v >= 1e9 ? "$" + (v/1e9).toFixed(1) + "B" : "$" + (v/1e6).toFixed(0) + "M",
    phrase: (a, b) => (Math.max(a,b) / Math.min(a,b)).toFixed(1) + "x más gasto militar",
    dir: "higher",
  },
  {
    key: "army_size", label: "Tamaño ejército", group: "poder",
    question: "¿Quién tiene un ejército más grande?",
    gradient: "linear-gradient(135deg, #B0BEC5 0%, #90A4AE 100%)",
    backgrounds: ["/illustrations/military.svg"],
    format: (v) => v.toLocaleString() + " soldados",
    phrase: (a, b) => (Math.max(a,b) / Math.min(a,b)).toFixed(1) + "x más soldados activos",
    dir: "higher",
  },
  {
    key: "world_cups", label: "Mundiales", group: "cultura",
    question: "¿Quién ha ganado más Mundiales de fútbol?",
    gradient: "linear-gradient(135deg, #C8E6C9 0%, #81C784 100%)",
    backgrounds: ["/illustrations/olympics.svg"],
    format: (v) => v + (v === 1 ? " copa" : " copas"),
    phrase: (a, b) => Math.abs(a-b) + " Mundial" + (Math.abs(a-b) === 1 ? "" : "es") + " más",
    dir: "higher",
  },
  {
    key: "olympic_medals", label: "Medallas olímpicas", group: "cultura",
    question: "¿Quién tiene más medallas olímpicas históricas?",
    gradient: "linear-gradient(135deg, #FFF59D 0%, #FFD54F 100%)",
    backgrounds: ["/illustrations/olympics.svg"],
    format: (v) => v + " medallas",
    phrase: (a, b) => {
      const r = Math.max(a,b) / Math.min(a,b);
      if (r >= 2) return r.toFixed(1) + "x más medallas olímpicas";
      return Math.abs(a-b) + " medallas más";
    },
    dir: "higher",
  },
  {
    key: "alcohol_consumption", label: "Alcohol", group: "cultura",
    question: "¿Quién consume más alcohol per cápita?",
    gradient: "linear-gradient(135deg, #F8BBD0 0%, #F06292 100%)",
    backgrounds: ["/illustrations/coffee.svg"],
    format: (v) => v.toFixed(1) + " L/año",
    phrase: (a, b) => Math.abs(a-b).toFixed(1) + " litros más de alcohol por persona/año",
    dir: "higher",
  },
  {
    key: "coffee_consumption", label: "Café", group: "cultura",
    question: "¿Quién bebe más café per cápita?",
    gradient: "linear-gradient(135deg, #D7CCC8 0%, #A1887F 100%)",
    backgrounds: ["/illustrations/coffee.svg"],
    format: (v) => v.toFixed(1) + " kg/año",
    phrase: (a, b) => (Math.max(a,b) / Math.min(a,b)).toFixed(1) + "x más café per cápita",
    dir: "higher",
  },
  {
    key: "mcdonalds_count", label: "McDonald's", group: "cultura",
    question: "¿Quién tiene más McDonald's?",
    gradient: "linear-gradient(135deg, #FFE082 0%, #FFB300 100%)",
    backgrounds: ["/illustrations/tourism.svg"],
    format: (v) => v.toLocaleString() + " locales",
    phrase: (a, b) => {
      const r = Math.max(a,b) / (Math.min(a,b) || 1);
      if (Math.min(a,b) === 0) return "uno tiene 0 McDonald's";
      return r.toFixed(1) + "x más McDonald's";
    },
    dir: "higher",
  },
];

// Filtrar categorías disponibles para un par de países (sin nulls)
export function getAvailableCategories(cA, cB) {
  return CATEGORIES.filter(cat =>
    cA[cat.key] !== null && cA[cat.key] !== undefined &&
    cB[cat.key] !== null && cB[cat.key] !== undefined
  );
}

// Mezclar array (Fisher-Yates) y devolver primeros n
export function pickRandom(array, n) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

// Determinar ganador de una categoría
export function getWinner(cA, cB, category) {
  const va = cA[category.key];
  const vb = cB[category.key];
  if (va === vb) return "TIE";
  if (category.dir === "higher") return va > vb ? "A" : "B";
  return va < vb ? "A" : "B";
}

// Construir frase viral
export function buildViralPhrase(cA, cB, category) {
  const va = cA[category.key];
  const vb = cB[category.key];
  if (va === vb) return "🔥 Ambos países tienen prácticamente el mismo valor";
  const winner = getWinner(cA, cB, category);
  const winnerCountry = winner === "A" ? cA : cB;
  const loserCountry = winner === "A" ? cB : cA;
  const phrase = category.phrase(va, vb);
  return `${winnerCountry.flag} ${winnerCountry.name} tiene ${phrase} que ${loserCountry.flag} ${loserCountry.name}`;
}

// Mensaje de racha para Challenger Mode
export function streakMessage(streak) {
  if (streak >= 20) return "🌍 LEYENDA MUNDIAL";
  if (streak >= 15) return "🧠 Máquina geográfica";
  if (streak >= 10) return "🏆 Maestro del mundo";
  if (streak >= 7) return "🔥 En racha imparable";
  if (streak >= 5) return "⚡ ¡5 seguidas!";
  if (streak >= 3) return "✨ ¡Combo x3!";
  return null;
}

// Helper: obtener un background aleatorio de una categoría
export function getRandomBackground(category) {
  if (!category.backgrounds || category.backgrounds.length === 0) return null;
  return category.backgrounds[Math.floor(Math.random() * category.backgrounds.length)];
}
