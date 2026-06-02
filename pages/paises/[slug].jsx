import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import { BreadcrumbSchema } from "../../components/JsonLd";
import { slugify, compareSlug, POPULAR_RANKINGS, POPULAR_COMPARISONS, formatValue, KEY_META } from "../../lib/seo";
import { trackEvent, EVENTS } from "../../lib/analytics";
import countries from "../../data/countries.json";
import countriesFull from "../../data/countries_full.json";

const SITE_URL = "https://mundovs.com";

// Campos que mostramos en la tabla de datos, agrupados
const DATA_GROUPS = [
  {
    label: "Sociedad",
    keys: ["population", "density", "median_age", "life_expectancy", "obesity_rate", "average_height_male"],
  },
  {
    label: "Economía",
    keys: ["gdp_total", "gdp_per_capita", "average_salary", "cost_of_living_index", "billionaires_count", "millonarios_total"],
  },
  {
    label: "Cultura y ocio",
    keys: ["mcdonalds_count", "coffee_consumption", "alcohol_consumption", "meat_consumption_kg", "cerveza_per_capita", "vino_per_capita"],
  },
  {
    label: "Geografía",
    keys: ["area", "rainfall_mm", "forest_area_percent", "land_borders_count", "capital_elevation_m"],
  },
  {
    label: "Turismo y poder",
    keys: ["turistas_anuales", "military_spending", "army_size", "corruption_cpi", "homicide_rate_per_100k"],
  },
  {
    label: "Deporte y tecnología",
    keys: ["world_cups", "olympic_medals", "internet_users_percent", "education_index", "skyscrapers_150m", "coches_per_capita"],
  },
];

// Cuántos campos válidos tiene un país
function validCount(c) {
  return Object.values(c).filter(v => v !== null && v !== undefined && v !== "" && !isNaN(v)).length;
}

// Rankings donde aparece el país (posición calculada)
function getRankingsForCountry(code, country) {
  return POPULAR_RANKINGS
    .map(r => {
      const val = country[r.key];
      if (val === null || val === undefined) return null;
      const sorted = Object.entries(countries)
        .filter(([, c]) => c[r.key] !== null && !isNaN(c[r.key]))
        .sort((a, b) => r.direction === "desc" ? b[1][r.key] - a[1][r.key] : a[1][r.key] - b[1][r.key]);
      const pos = sorted.findIndex(([c]) => c === code) + 1;
      return pos > 0 ? { ...r, pos, total: sorted.length, val } : null;
    })
    .filter(Boolean);
}

// Comparaciones donde aparece el país
function getComparisonsForCountry(code) {
  return POPULAR_COMPARISONS
    .filter(({ a, b }) => a === code || b === code)
    .map(({ a, b }) => {
      const cA = countries[a]; const cB = countries[b];
      if (!cA || !cB) return null;
      return { a, b, nameA: cA.name, nameB: cB.name, flagA: cA.flag, flagB: cB.flag,
                slug: compareSlug(cA.name, cB.name) };
    })
    .filter(Boolean);
}

export default function PaisPage({ country, countryFull, rankingsData, comparisons, isNoindex, slug }) {
  if (!country) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    trackEvent(EVENTS.COUNTRY_PAGE_CLICK, { slug });
  }, [slug]);
  const name = country.name;
  const flag = country.flag;
  const cont = countryFull?.continent || "";
  const capital = countryFull?.capital || "";
  const langs = countryFull?.official_languages?.join(", ") || "";
  const currency = countryFull?.currency || "";
  const govt = countryFull?.government || "";

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Country",
    name,
    description: `Datos de ${name}: población, economía, cultura, turismo y más.`,
    url: `${SITE_URL}/paises/${slug}`,
    image: `${SITE_URL}/favicon-512.png`,
    ...(capital ? { containsPlace: { "@type": "City", name: capital } } : {}),
  };

  const title = `${flag} ${name} — Datos, rankings y curiosidades | MundoVs`;
  const desc = [
    `Ficha completa de ${name}`,
    capital ? `Capital: ${capital}` : "",
    cont ? `Continente: ${cont}` : "",
    `Datos de población, economía, cultura y más. Compara ${name} con otros países.`,
  ].filter(Boolean).join(". ");

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        {isNoindex && <meta name="robots" content="noindex, nofollow" />}
        <link rel="canonical" href={`${SITE_URL}/paises/${slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`${SITE_URL}/paises/${slug}`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <BreadcrumbSchema items={[
          { name: "Inicio", url: "/" },
          { name: "Países", url: "/paises" },
          { name: name, url: `/paises/${slug}` },
        ]} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }} />
      </Head>

      <div className="pu-wrap">
        {/* Breadcrumb */}
        <nav className="rk-breadcrumb" aria-label="Navegación">
          <Link href="/">Inicio</Link><span>›</span>
          <Link href="/paises">Países</Link><span>›</span>
          <span>{name}</span>
        </nav>

        {/* Hero del país */}
        <header className="pu-hero">
          <div className="pu-hero-flag">{flag}</div>
          <div className="pu-hero-info">
            <h1 className="pu-hero-name">{name}</h1>
            <div className="pu-hero-tags">
              {cont && <span className="pu-tag">{cont}</span>}
              {capital && <span className="pu-tag">Capital: {capital}</span>}
              {langs && <span className="pu-tag">{langs}</span>}
              {currency && <span className="pu-tag">{currency}</span>}
              {govt && <span className="pu-tag pu-tag-dim">{govt}</span>}
            </div>
          </div>
        </header>

        {/* Datos en grupos */}
        {DATA_GROUPS.map(group => {
          const validKeys = group.keys.filter(k => country[k] !== null && country[k] !== undefined && !isNaN(country[k]));
          if (validKeys.length === 0) return null;
          return (
            <section key={group.label} className="pu-group">
              <h2 className="pu-group-title">{group.label}</h2>
              <div className="pu-data-grid">
                {validKeys.map(k => (
                  <div key={k} className="pu-data-cell">
                    <div className="pu-data-label">{KEY_META[k]?.label || k}</div>
                    <div className="pu-data-val">{formatValue(k, country[k])}</div>
                    <div className="pu-data-source">{KEY_META[k]?.source || ""}</div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Rankings donde aparece */}
        {rankingsData.length > 0 && (
          <section className="pu-rankings">
            <h2 className="pu-section-title">Rankings donde aparece {name}</h2>
            <div className="pu-rankings-grid">
              {rankingsData.map(r => (
                <Link key={r.slug} href={`/rankings/${r.slug}`} className="pu-rank-card">
                  <span className="pu-rank-icon">{r.icon}</span>
                  <div>
                    <div className="pu-rank-label">{r.label}</div>
                    <div className="pu-rank-pos">Posición <strong>{r.pos}</strong> de {r.total}</div>
                    <div className="pu-rank-val">{formatValue(r.key, r.val)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Comparaciones destacadas */}
        {comparisons.length > 0 && (
          <section className="pu-compares">
            <h2 className="pu-section-title">Comparaciones con {name}</h2>
            <div className="pu-compare-list">
              {comparisons.map(c => (
                <Link key={c.slug} href={`/comparar/${c.slug}`} className="pu-compare-card">
                  <span>{c.flagA} {c.nameA}</span>
                  <span className="pu-compare-vs">vs</span>
                  <span>{c.flagB} {c.nameB}</span>
                  <span className="pu-compare-arrow">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="pu-cta">
          <h2 className="pu-cta-title">¿Cómo se compara {name} con el mundo?</h2>
          <div className="pu-cta-btns">
            <Link href="/clasico" className="mv-btn mv-btn-primary mv-btn-lg">
              🆚 Comparar {name} con otro país
            </Link>
            <Link href="/infinito" className="mv-btn mv-btn-secondary">
              ♾️ Modo Infinito
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─── Static generation ────────────────────────────────────────────────────────
export function getStaticPaths() {
  const paths = Object.entries(countries).map(([, c]) => ({
    params: { slug: slugify(c.name) },
  }));
  return { paths, fallback: false };
}

export function getStaticProps({ params }) {
  // Encontrar el país por slug
  const entry = Object.entries(countries).find(([, c]) => slugify(c.name) === params.slug);
  if (!entry) return { notFound: true };
  const [code, country] = entry;

  const countryFull = countriesFull[code] || null;
  const isNoindex = validCount(country) < 5;
  const rankingsData = getRankingsForCountry(code, country);
  const comparisons = getComparisonsForCountry(code);

  return {
    props: {
      country,
      countryFull,
      rankingsData,
      comparisons,
      isNoindex,
      slug: params.slug,
      code,
    },
  };
}
