import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import { BreadcrumbSchema } from "../../components/JsonLd";
import { slugify, compareSlug, POPULAR_COMPARISONS, formatValue, KEY_META, POPULAR_RANKINGS } from "../../lib/seo";
import { trackEvent, EVENTS } from "../../lib/analytics";
import countries from "../../data/countries.json";

const SITE_URL = "https://mundovs.com";

// Categorías de comparación (subset relevante para las fichas)
const COMPARE_KEYS = [
  "population", "area", "gdp_per_capita", "life_expectancy",
  "average_salary", "mcdonalds_count", "turistas_anuales",
  "olympic_medals", "world_cups", "skyscrapers_150m",
  "forest_area_percent", "corruption_cpi", "internet_users_percent",
  "education_index", "military_spending",
];

function buildSummaryText(cA, cB, rows) {
  const lines = [];
  const winA = rows.filter(r => r.winner === "A").length;
  const winB = rows.filter(r => r.winner === "B").length;

  if (winA > winB) {
    lines.push(`${cA.name} gana en ${winA} de las ${rows.length} categorías comparadas.`);
  } else if (winB > winA) {
    lines.push(`${cB.name} gana en ${winB} de las ${rows.length} categorías comparadas.`);
  } else {
    lines.push(`${cA.name} y ${cB.name} están igualados en el número de categorías ganadas.`);
  }

  // Añadir 2 datos concretos
  const popRow = rows.find(r => r.key === "population");
  if (popRow) {
    const bigger = popRow.winner === "A" ? cA.name : cB.name;
    const smaller = popRow.winner === "A" ? cB.name : cA.name;
    lines.push(`En población, ${bigger} supera a ${smaller}.`);
  }
  const gdpRow = rows.find(r => r.key === "gdp_per_capita");
  if (gdpRow) {
    const richer = gdpRow.winner === "A" ? cA.name : cB.name;
    lines.push(`Por PIB per cápita, ${richer} tiene el nivel más alto.`);
  }

  return lines.join(" ");
}

export default function CompararPage({ cA, cB, rows, slug }) {
  if (!cA || !cB) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    trackEvent(EVENTS.COMPARE_PAGE_CLICK, { slug });
  }, [slug]);

  const summary = buildSummaryText(cA, cB, rows);
  const winA = rows.filter(r => r.winner === "A").length;
  const winB = rows.filter(r => r.winner === "B").length;
  const overall = winA > winB ? "A" : winB > winA ? "B" : "TIE";

  const title = `${cA.flag} ${cA.name} vs ${cB.flag} ${cB.name} — Comparación completa | MundoVs`;
  const desc = `Compara ${cA.name} y ${cB.name}: población, economía, cultura, turismo y más. ${summary}`;

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: desc,
    url: `${SITE_URL}/comparar/${slug}`,
  };

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`${SITE_URL}/comparar/${slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`${SITE_URL}/comparar/${slug}`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <BreadcrumbSchema items={[
          { name: "Inicio", url: "/" },
          { name: "Comparar", url: "/comparar" },
          { name: `${cA.name} vs ${cB.name}`, url: `/comparar/${slug}` },
        ]} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }} />
      </Head>

      <div className="cp-wrap">
        {/* Breadcrumb */}
        <nav className="rk-breadcrumb" aria-label="Navegación">
          <Link href="/">Inicio</Link><span>›</span>
          <span>Comparar</span><span>›</span>
          <span>{cA.name} vs {cB.name}</span>
        </nav>

        {/* Hero comparación */}
        <header className="cp-hero">
          <div className={`cp-hero-side${overall === "A" ? " cp-winner" : ""}`}>
            <div className="cp-hero-flag">{cA.flag}</div>
            <h1 className="cp-hero-name">{cA.name}</h1>
            <div className="cp-hero-wins">{winA} categorías</div>
          </div>
          <div className="cp-hero-vs">
            <span>VS</span>
            {overall !== "TIE" && (
              <div className="cp-overall-winner">
                Gana: {overall === "A" ? `${cA.flag} ${cA.name}` : `${cB.flag} ${cB.name}`}
              </div>
            )}
            {overall === "TIE" && <div className="cp-overall-winner">Empate</div>}
          </div>
          <div className={`cp-hero-side${overall === "B" ? " cp-winner" : ""}`}>
            <div className="cp-hero-flag">{cB.flag}</div>
            <div className="cp-hero-name">{cB.name}</div>
            <div className="cp-hero-wins">{winB} categorías</div>
          </div>
        </header>

        {/* Resumen textual */}
        <div className="cp-summary-text">{summary}</div>

        {/* Tabla comparativa */}
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr>
                <th className="cp-th-country">{cA.flag} {cA.name}</th>
                <th className="cp-th-cat">Categoría</th>
                <th className="cp-th-country">{cB.flag} {cB.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.key}>
                  <td className={`cp-val${r.winner === "A" ? " cp-val-win" : ""}`}>
                    {r.winner === "A" && <span className="cp-win-icon">▶</span>}
                    {formatValue(r.key, r.valA)}
                  </td>
                  <td className="cp-cat">{KEY_META[r.key]?.label || r.key}</td>
                  <td className={`cp-val${r.winner === "B" ? " cp-val-win" : ""}`}>
                    {formatValue(r.key, r.valB)}
                    {r.winner === "B" && <span className="cp-win-icon">◀</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Links a fichas */}
        <div className="cp-links">
          <Link href={`/paises/${slugify(cA.name)}`} className="mv-btn mv-btn-secondary">
            {cA.flag} Ver ficha de {cA.name}
          </Link>
          <Link href={`/paises/${slugify(cB.name)}`} className="mv-btn mv-btn-secondary">
            {cB.flag} Ver ficha de {cB.name}
          </Link>
        </div>

        {/* Links a rankings relacionados */}
        <div className="cp-related">
          <h2 className="cp-related-title">Rankings relacionados</h2>
          <div className="cp-related-grid">
            {POPULAR_RANKINGS.map(r => (
              <Link key={r.slug} href={`/rankings/${r.slug}`} className="cp-related-card">
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rk-cta">
          <h2 className="rk-cta-title">¿Y si jugases esta comparación?</h2>
          <p className="rk-cta-sub">Reta tu intuición en MundoVs clásico</p>
          <div className="rk-cta-btns">
            <Link href="/clasico" className="mv-btn mv-btn-primary mv-btn-lg">🆚 Jugar MundoVs clásico</Link>
            <Link href="/infinito" className="mv-btn mv-btn-secondary">♾️ Modo Infinito</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─── Static generation ────────────────────────────────────────────────────────
export function getStaticPaths() {
  const paths = POPULAR_COMPARISONS.map(({ a, b }) => {
    const cA = countries[a]; const cB = countries[b];
    if (!cA || !cB) return null;
    return { params: { slug: compareSlug(cA.name, cB.name) } };
  }).filter(Boolean);
  return { paths, fallback: false };
}

export function getStaticProps({ params }) {
  const entry = POPULAR_COMPARISONS.find(({ a, b }) => {
    const cA = countries[a]; const cB = countries[b];
    if (!cA || !cB) return false;
    return compareSlug(cA.name, cB.name) === params.slug;
  });
  if (!entry) return { notFound: true };

  const cA = countries[entry.a]; const cB = countries[entry.b];

  const rows = COMPARE_KEYS
    .filter(k => cA[k] !== null && cA[k] !== undefined && cB[k] !== null && cB[k] !== undefined)
    .map(k => {
      const valA = cA[k]; const valB = cB[k];
      const winner = valA > valB ? "A" : valB > valA ? "B" : "TIE";
      return { key: k, valA, valB, winner };
    });

  return {
    props: {
      cA: { ...cA, code: entry.a },
      cB: { ...cB, code: entry.b },
      rows,
      slug: params.slug,
    },
  };
}
