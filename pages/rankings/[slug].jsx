import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import { BreadcrumbSchema, ItemListSchema } from "../../components/JsonLd";
import { POPULAR_RANKINGS, formatValue, KEY_META } from "../../lib/seo";
import { trackEvent, EVENTS } from "../../lib/analytics";
import countries from "../../data/countries.json";

const SITE_URL = "https://mundovs.com";

// ─── FAQ genérica por ranking ─────────────────────────────────────────────────
function buildFaq(ranking, top1) {
  return [
    {
      q: `¿Cuál es el país con ${ranking.label.toLowerCase().replace("países con ", "más ").replace("países más ", "más ")}?`,
      a: `${top1.flag} ${top1.name} lidera el ranking con ${formatValue(ranking.key, top1.value)}.`,
    },
    {
      q: "¿De dónde vienen los datos?",
      a: `Los datos de este ranking provienen de ${KEY_META[ranking.key]?.source || "fuentes oficiales"}. Se actualizan periódicamente.`,
    },
    {
      q: "¿Puedo jugar con esta categoría?",
      a: `Sí. En el Modo Infinito de MundoVs puedes seleccionar "${ranking.label}" y competir encadenando comparaciones hasta que falles.`,
    },
  ];
}

export default function RankingPage({ ranking, rows }) {
  if (!ranking || !rows) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    trackEvent(EVENTS.RANKING_PAGE_CLICK, { slug: ranking.slug });
  }, [ranking.slug]);

  const top1 = rows[0];
  const faq = buildFaq(ranking, top1);
  const meta = KEY_META[ranking.key] || {};

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Rankings", url: "/rankings" },
    { name: ranking.label, url: `/rankings/${ranking.slug}` },
  ];

  const itemList = rows.slice(0, 10).map((r, i) => ({
    name: `${i + 1}. ${r.name} — ${formatValue(ranking.key, r.value)}`,
    url: `/paises/${r.slug}`,
  }));

  const title = `${ranking.label} — Ranking completo | MundoVs`;
  const desc = `Ranking de ${ranking.label.toLowerCase()}. ${top1.flag} ${top1.name} lidera con ${formatValue(ranking.key, top1.value)}. Datos de ${meta.source || "fuentes oficiales"}.`;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`${SITE_URL}/rankings/${ranking.slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`${SITE_URL}/rankings/${ranking.slug}`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <BreadcrumbSchema items={breadcrumbs} />
        <ItemListSchema items={itemList} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <div className="rk-wrap">
        {/* Breadcrumb */}
        <nav className="rk-breadcrumb" aria-label="Navegación">
          <Link href="/">Inicio</Link>
          <span>›</span>
          <Link href="/rankings">Rankings</Link>
          <span>›</span>
          <span>{ranking.label}</span>
        </nav>

        {/* Hero */}
        <header className="rk-hero">
          <div className="rk-hero-icon">{ranking.icon}</div>
          <h1 className="rk-hero-title">{ranking.label}</h1>
          <p className="rk-hero-sub">
            {rows.length} países comparados · Fuente: {meta.source || "fuentes oficiales"} · Datos más recientes disponibles
          </p>
        </header>

        {/* Medalla top 3 */}
        <div className="rk-podium">
          {rows.slice(0, 3).map((r, i) => (
            <Link key={r.code} href={`/paises/${r.slug}`} className={`rk-podium-item rk-podium-${i + 1}`}>
              <div className="rk-podium-medal">{["🥇","🥈","🥉"][i]}</div>
              <div className="rk-podium-flag">{r.flag}</div>
              <div className="rk-podium-name">{r.name}</div>
              <div className="rk-podium-val">{formatValue(ranking.key, r.value)}</div>
            </Link>
          ))}
        </div>

        {/* Tabla completa */}
        <div className="rk-table-wrap">
          <table className="rk-table">
            <thead>
              <tr>
                <th>#</th>
                <th>País</th>
                <th>{meta.label || ranking.label}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.code} className={i < 3 ? "rk-row-top" : ""}>
                  <td className="rk-pos">{i + 1}</td>
                  <td className="rk-country">
                    <Link href={`/paises/${r.slug}`} className="rk-country-link">
                      <span className="rk-flag">{r.flag}</span>
                      <span>{r.name}</span>
                    </Link>
                  </td>
                  <td className="rk-val">{formatValue(ranking.key, r.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Metodología */}
        <div className="rk-meta-box">
          <h2 className="rk-meta-title">Sobre este ranking</h2>
          <p className="rk-meta-text">
            Los datos de <strong>{meta.label || ranking.label}</strong> provienen de{" "}
            <strong>{meta.source || "fuentes oficiales"}</strong>. Solo se incluyen los{" "}
            {rows.length} países del catálogo de MundoVs. Pueden existir diferencias menores
            según la fecha de consulta y la metodología de cada organismo.
          </p>
        </div>

        {/* FAQ */}
        <section className="rk-faq">
          <h2 className="rk-faq-title">Preguntas frecuentes</h2>
          {faq.map((f, i) => (
            <details key={i} className="mv2-faq-item">
              <summary>{f.q}</summary>
              <div className="mv2-faq-body">{f.a}</div>
            </details>
          ))}
        </section>

        {/* CTA */}
        <div className="rk-cta">
          <h2 className="rk-cta-title">¿Sabrías ordenarlos?</h2>
          <p className="rk-cta-sub">Juega al Modo Infinito con la categoría <strong>{meta.label || ranking.label}</strong></p>
          <div className="rk-cta-btns">
            <Link href="/infinito" className="mv-btn mv-btn-primary mv-btn-lg">♾️ Jugar Modo Infinito</Link>
            <Link href="/clasico" className="mv-btn mv-btn-secondary">🆚 Comparar dos países</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─── Static generation ────────────────────────────────────────────────────────
export function getStaticPaths() {
  return {
    paths: POPULAR_RANKINGS.map(r => ({ params: { slug: r.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const ranking = POPULAR_RANKINGS.find(r => r.slug === params.slug);
  if (!ranking) return { notFound: true };

  const { slugify } = require("../../lib/seo");

  const rows = Object.entries(countries)
    .filter(([, c]) => c[ranking.key] !== null && c[ranking.key] !== undefined && !isNaN(c[ranking.key]))
    .map(([code, c]) => ({
      code,
      name: c.name,
      flag: c.flag,
      value: c[ranking.key],
      slug: slugify(c.name),
    }))
    .sort((a, b) => ranking.direction === "desc" ? b.value - a.value : a.value - b.value);

  return { props: { ranking, rows } };
}
