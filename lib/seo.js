// ============================================================
// MundoVS — helpers de slugs SEO
// Funciones puras, sin dependencias de framework.
// Usadas por la home y por las rutas programáticas (Fase 8).
// ============================================================

/**
 * Normaliza un texto a un slug URL-safe:
 * "España"   -> "espana"
 * "Reino Unido" -> "reino-unido"
 * "Estados Unidos" -> "estados-unidos"
 */
export function slugify(input) {
  if (!input) return "";
  return String(input)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Construye el slug de comparación entre dos países:
 * compareSlug("España", "Francia") -> "espana-vs-francia"
 */
export function compareSlug(nameA, nameB) {
  return `${slugify(nameA)}-vs-${slugify(nameB)}`;
}

/**
 * Catálogo de rankings populares con el slug, etiqueta, icono e
 * indicador en countries.json. Esta lista es la fuente de verdad
 * para Home y para las páginas /rankings/[slug] (Fase 8).
 */
export const POPULAR_RANKINGS = [
  { slug: "poblacion",         label: "Países con más población",      key: "population",        icon: "👥", direction: "desc" },
  { slug: "superficie",        label: "Países más grandes",            key: "area",              icon: "🗺️", direction: "desc" },
  { slug: "esperanza-de-vida", label: "Países con mayor esperanza de vida", key: "life_expectancy", icon: "❤️", direction: "desc" },
  { slug: "mcdonalds",         label: "Países con más McDonald's",      key: "mcdonalds_count",   icon: "🍔", direction: "desc" },
  { slug: "pib",               label: "Países con mayor PIB",           key: "gdp_total",         icon: "💰", direction: "desc" },
  { slug: "rascacielos",       label: "Países con más rascacielos",     key: "skyscrapers_150m",  icon: "🏙️", direction: "desc" },
];

/**
 * Comparaciones destacadas para la home. Usan códigos ISO-2 que existen
 * en countries.json (47 países). Si añades alguna comprueba que ambos
 * códigos están en la base de datos.
 */
export const POPULAR_COMPARISONS = [
  { a: "ES", b: "FR" },
  { a: "US", b: "CN" },
  { a: "DE", b: "FR" },
  { a: "ES", b: "AR" },
  { a: "BR", b: "MX" },
  { a: "JP", b: "KR" },
];

/**
 * Preguntas populares enlazadas a /preguntas/[slug] (Fase 8).
 * Cada una tiene su key del dataset y respuesta directa precomputada.
 */
export const POPULAR_QUESTIONS = [
  { slug: "que-pais-tiene-mas-poblacion",  q: "¿Qué país tiene más población?",      key: "population",        direction: "desc" },
  { slug: "que-pais-es-mas-grande",        q: "¿Qué país es más grande?",            key: "area",              direction: "desc" },
  { slug: "que-pais-tiene-mas-mcdonalds",  q: "¿Qué país tiene más McDonald's?",     key: "mcdonalds_count",   direction: "desc" },
  { slug: "que-pais-vive-mas-anos",        q: "¿Qué país vive más años?",            key: "life_expectancy",   direction: "desc" },
  { slug: "que-pais-tiene-mas-rascacielos", q: "¿Qué país tiene más rascacielos?",   key: "skyscrapers_150m",  direction: "desc" },
];

// ─── Helpers de formato para plantillas SEO ──────────────────────────────────

/**
 * Formatea un valor numérico según la key de la categoría.
 * Se usa en rankings, comparaciones y fichas de país.
 */
export function formatValue(key, value) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  const n = Number(value);
  switch (key) {
    case "population":
      return n >= 1e9 ? (n / 1e9).toFixed(2) + " B hab."
           : n >= 1e6 ? (n / 1e6).toFixed(1) + " M hab."
           : n.toLocaleString("es-ES") + " hab.";
    case "area":
      return n.toLocaleString("es-ES") + " km²";
    case "gdp_total":
      return n >= 1e12 ? "$" + (n / 1e12).toFixed(2) + " B"
           : n >= 1e9  ? "$" + (n / 1e9).toFixed(0) + " M"
           : "$" + n.toLocaleString("es-ES");
    case "gdp_per_capita":
    case "average_salary":
      return "$" + n.toLocaleString("es-ES");
    case "life_expectancy":
      return n.toFixed(1) + " años";
    case "median_age":
      return n.toFixed(1) + " años";
    case "cost_of_living_index":
      return n.toFixed(1) + " pts";
    case "education_index":
      return n.toFixed(3);
    case "internet_users_percent":
    case "forest_area_percent":
    case "obesity_rate":
      return n.toFixed(1) + "%";
    case "military_spending":
      return n >= 1e9 ? "$" + (n / 1e9).toFixed(1) + " B"
           : "$" + n.toLocaleString("es-ES");
    case "army_size":
    case "mcdonalds_count":
    case "skyscrapers_150m":
    case "billionaires_count":
    case "millonarios_total":
    case "olympic_medals":
    case "world_cups":
    case "land_borders_count":
      return n.toLocaleString("es-ES");
    case "turistas_anuales":
      return n >= 1e6 ? (n / 1e6).toFixed(1) + " M/año"
           : n.toLocaleString("es-ES") + "/año";
    case "rainfall_mm":
      return n.toLocaleString("es-ES") + " mm/año";
    case "capital_elevation_m":
      return n.toLocaleString("es-ES") + " m";
    case "homicide_rate_per_100k":
      return n.toFixed(1) + " /100k hab.";
    case "corruption_cpi":
      return n.toFixed(1) + " / 100";
    case "alcohol_consumption":
    case "coffee_consumption":
    case "cafe_per_capita":
    case "cerveza_per_capita":
    case "vino_per_capita":
    case "meat_consumption_kg":
      return n.toFixed(1) + " kg/hab.";
    case "average_height_male":
      return n.toFixed(1) + " cm";
    case "coches_per_capita":
      return n.toFixed(2) + " coches/hab.";
    default:
      return n.toLocaleString("es-ES");
  }
}

/**
 * Metadatos (label, fuente, unidad, descripción) para cada key.
 * Se usa en tablas de fichas de país y páginas de ranking.
 */
export const KEY_META = {
  population:             { label: "Población",            unit: "hab.",    source: "Banco Mundial" },
  area:                   { label: "Superficie",           unit: "km²",     source: "CIA World Factbook" },
  density:                { label: "Densidad",             unit: "hab./km²", source: "Banco Mundial" },
  gdp_total:              { label: "PIB total",            unit: "USD",     source: "Banco Mundial" },
  gdp_per_capita:         { label: "PIB per cápita",       unit: "USD",     source: "Banco Mundial" },
  average_salary:         { label: "Salario medio",        unit: "USD/año", source: "OCDE / OIT" },
  cost_of_living_index:   { label: "Índice coste de vida", unit: "pts",     source: "Numbeo" },
  life_expectancy:        { label: "Esperanza de vida",    unit: "años",    source: "OMS" },
  median_age:             { label: "Edad media",           unit: "años",    source: "Banco Mundial" },
  average_height_male:    { label: "Altura media (hombre)", unit: "cm",     source: "NCD Risk Factor" },
  obesity_rate:           { label: "Tasa de obesidad",     unit: "%",       source: "OMS" },
  internet_users_percent: { label: "Usuarios de internet", unit: "%",       source: "UIT / Banco Mundial" },
  education_index:        { label: "Índice de educación",  unit: "0-1",     source: "PNUD" },
  military_spending:      { label: "Gasto militar",        unit: "USD",     source: "SIPRI" },
  army_size:              { label: "Tamaño del ejército",  unit: "efectivos", source: "Global Firepower" },
  world_cups:             { label: "Mundiales de fútbol",  unit: "títulos", source: "FIFA" },
  olympic_medals:         { label: "Medallas olímpicas",   unit: "medallas", source: "COI" },
  alcohol_consumption:    { label: "Consumo de alcohol",   unit: "litros/hab.", source: "OMS" },
  coffee_consumption:     { label: "Consumo de café",      unit: "kg/hab.", source: "OIC / FAOSTAT" },
  mcdonalds_count:        { label: "Restaurantes McDonald's", unit: "locales", source: "McDonald's Corporation" },
  corruption_cpi:         { label: "Índice anticorrupción", unit: "/ 100",  source: "Transparency International" },
  rainfall_mm:            { label: "Precipitación anual",  unit: "mm/año", source: "Banco Mundial" },
  forest_area_percent:    { label: "Superficie forestal",  unit: "%",       source: "FAO / Banco Mundial" },
  land_borders_count:     { label: "Países fronterizos",   unit: "países",  source: "CIA World Factbook" },
  capital_elevation_m:    { label: "Altitud de la capital", unit: "m",      source: "USGS" },
  skyscrapers_150m:       { label: "Rascacielos (>150 m)", unit: "edificios", source: "CTBUH" },
  billionaires_count:     { label: "Multimillonarios",     unit: "personas", source: "Forbes" },
  meat_consumption_kg:    { label: "Consumo de carne",     unit: "kg/hab.", source: "FAOSTAT" },
  homicide_rate_per_100k: { label: "Tasa de homicidios",   unit: "/100k hab.", source: "UNODC" },
  turistas_anuales:       { label: "Turistas anuales",     unit: "/año",    source: "OMT / UNWTO" },
  cafe_per_capita:        { label: "Café per cápita",      unit: "kg/hab.", source: "OIC" },
  cerveza_per_capita:     { label: "Cerveza per cápita",   unit: "litros/hab.", source: "Kirin Institute" },
  vino_per_capita:        { label: "Vino per cápita",      unit: "litros/hab.", source: "OIV" },
  millonarios_total:      { label: "Millonarios",          unit: "personas", source: "Credit Suisse" },
  coches_per_capita:      { label: "Coches per cápita",    unit: "coches/hab.", source: "OICA" },
};
