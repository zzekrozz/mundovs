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
