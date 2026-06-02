// ============================================================
// MundoVS — sitemap.xml (Pages Router)
// Incluye todas las rutas estáticas + las de Fase 8.
// ============================================================

const SITE_URL = "https://mundovs.com";
const BUILD_DATE = new Date().toISOString().split("T")[0];

// Importamos datos en tiempo de servidor (getServerSideProps)
const countries = require("../data/countries.json");
const { POPULAR_RANKINGS, POPULAR_COMPARISONS, POPULAR_QUESTIONS, slugify, compareSlug } = require("../lib/seo");

// ─── Rutas estáticas ────────────────────────────────────────────────────────
const STATIC_ROUTES = [
  // Home
  { path: "/",               priority: "1.0", changefreq: "daily",   lastmod: BUILD_DATE },

  // Modos de juego
  { path: "/pais-del-dia",   priority: "0.9", changefreq: "daily",   lastmod: BUILD_DATE },
  { path: "/clasico",        priority: "0.9", changefreq: "weekly",  lastmod: BUILD_DATE },
  { path: "/challenger",     priority: "0.8", changefreq: "weekly",  lastmod: BUILD_DATE },
  { path: "/infinito",       priority: "0.8", changefreq: "weekly",  lastmod: BUILD_DATE },

  // Secciones SEO programáticas (índices)
  { path: "/rankings",       priority: "0.8", changefreq: "weekly",  lastmod: BUILD_DATE },
  { path: "/paises",         priority: "0.8", changefreq: "monthly", lastmod: BUILD_DATE },
  { path: "/comparar",       priority: "0.7", changefreq: "monthly", lastmod: BUILD_DATE },
  { path: "/preguntas",      priority: "0.7", changefreq: "monthly", lastmod: BUILD_DATE },

  // Proyecto / informativas
  { path: "/sobre",          priority: "0.6", changefreq: "monthly", lastmod: BUILD_DATE },
  { path: "/metodologia",    priority: "0.6", changefreq: "monthly", lastmod: BUILD_DATE },
  { path: "/glosario",       priority: "0.6", changefreq: "monthly", lastmod: BUILD_DATE },
  { path: "/contacto",       priority: "0.5", changefreq: "yearly",  lastmod: BUILD_DATE },

  // Blog
  { path: "/blog",           priority: "0.7", changefreq: "weekly",  lastmod: BUILD_DATE },
  { path: "/blog/cafe-mas-consumido-mundo",                    priority: "0.7", changefreq: "monthly", lastmod: "2024-10-01" },
  { path: "/blog/como-se-mide-pib-per-capita",                 priority: "0.7", changefreq: "monthly", lastmod: "2024-10-01" },
  { path: "/blog/diferencias-economicas-espana-latinoamerica", priority: "0.7", changefreq: "monthly", lastmod: "2024-10-01" },
  { path: "/blog/los-paises-mas-grandes-del-mundo",            priority: "0.7", changefreq: "monthly", lastmod: "2024-10-01" },
  { path: "/blog/por-que-paises-nordicos-mas-altos",           priority: "0.7", changefreq: "monthly", lastmod: "2024-10-01" },

  // Legal
  { path: "/legal/privacidad", priority: "0.3", changefreq: "yearly", lastmod: BUILD_DATE },
  { path: "/legal/terminos",   priority: "0.3", changefreq: "yearly", lastmod: BUILD_DATE },
  { path: "/legal/cookies",    priority: "0.3", changefreq: "yearly", lastmod: BUILD_DATE },
];

function buildRoutes() {
  // Rankings programáticos
  const rankingRoutes = POPULAR_RANKINGS.map(r => ({
    path: `/rankings/${r.slug}`, priority: "0.8", changefreq: "monthly", lastmod: BUILD_DATE,
  }));

  // Fichas de país (47)
  const paisRoutes = Object.values(countries).map(c => ({
    path: `/paises/${slugify(c.name)}`, priority: "0.7", changefreq: "monthly", lastmod: BUILD_DATE,
  }));

  // Comparaciones (6)
  const compareRoutes = POPULAR_COMPARISONS
    .map(({ a, b }) => {
      const cA = countries[a]; const cB = countries[b];
      if (!cA || !cB) return null;
      return { path: `/comparar/${compareSlug(cA.name, cB.name)}`, priority: "0.7", changefreq: "monthly", lastmod: BUILD_DATE };
    })
    .filter(Boolean);

  // Preguntas (5)
  const questionRoutes = POPULAR_QUESTIONS.map(q => ({
    path: `/preguntas/${q.slug}`, priority: "0.75", changefreq: "monthly", lastmod: BUILD_DATE,
  }));

  return [
    ...STATIC_ROUTES,
    ...rankingRoutes,
    ...paisRoutes,
    ...compareRoutes,
    ...questionRoutes,
  ];
}

function buildSitemap(routes) {
  const urls = routes.map(({ path, priority, changefreq, lastmod }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;
}

export default function Sitemap() { return null; }

export function getServerSideProps({ res }) {
  const routes = buildRoutes();
  const sitemap = buildSitemap(routes);
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.write(sitemap);
  res.end();
  return { props: {} };
}
