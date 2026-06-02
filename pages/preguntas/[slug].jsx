import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { BreadcrumbSchema } from "../../components/JsonLd";
import { POPULAR_QUESTIONS, POPULAR_RANKINGS, slugify, formatValue, KEY_META } from "../../lib/seo";
import countries from "../../data/countries.json";

const SITE_URL = "https://mundovs.com";

export default function PreguntaPage({ question, top5, top1, relatedRanking }) {
  if (!question) return null;

  const meta = KEY_META[question.key] || {};
  const faqItems = [
    {
      q: question.q,
      a: `${top1.flag} ${top1.name} es el país con ${meta.label?.toLowerCase() || "más valor"} del mundo, con ${formatValue(question.key, top1.value)}.`,
    },
    {
      q: `¿De dónde vienen estos datos?`,
      a: `Los datos provienen de ${meta.source || "fuentes oficiales internacionales"} y corresponden a los valores más recientes disponibles.`,
    },
    {
      q: `¿Puedo jugar con esta categoría?`,
      a: `Sí. En el Modo Infinito de MundoVs puedes comparar países por esta categoría encadenando aciertos hasta que falles.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const title = `${question.q} — Respuesta y ranking | MundoVs`;
  const desc = `${top1.flag} ${top1.name} con ${formatValue(question.key, top1.value)}. Ranking completo y datos de ${meta.source || "fuentes oficiales"}.`;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`${SITE_URL}/preguntas/${question.slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`${SITE_URL}/preguntas/${question.slug}`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <BreadcrumbSchema items={[
          { name: "Inicio", url: "/" },
          { name: "Preguntas", url: "/preguntas" },
          { name: question.q, url: `/preguntas/${question.slug}` },
        ]} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      <div className="pq-wrap">
        {/* Breadcrumb */}
        <nav className="rk-breadcrumb" aria-label="Navegación">
          <Link href="/">Inicio</Link><span>›</span>
          <span>Preguntas</span><span>›</span>
          <span style={{ color: "var(--mv-text-dim)", fontSize: 12 }}>{question.q}</span>
        </nav>

        {/* Hero pregunta */}
        <header className="pq-hero">
          <div className="pq-hero-tag">RESPUESTA DIRECTA</div>
          <h1 className="pq-hero-q">{question.q}</h1>
          <div className="pq-answer">
            <div className="pq-answer-flag">{top1.flag}</div>
            <div>
              <div className="pq-answer-country">{top1.name}</div>
              <div className="pq-answer-val">{formatValue(question.key, top1.value)}</div>
              <div className="pq-answer-source">Fuente: {meta.source || "datos oficiales"}</div>
            </div>
          </div>
        </header>

        {/* Top 5 visual */}
        <section className="pq-top5">
          <h2 className="pq-section-title">Top 5 — {meta.label || question.q}</h2>
          <div className="pq-top5-list">
            {top5.map((r, i) => (
              <Link key={r.code} href={`/paises/${r.slug}`} className="pq-top5-row">
                <span className="pq-top5-pos">{i + 1}</span>
                <span className="pq-top5-flag">{r.flag}</span>
                <span className="pq-top5-name">{r.name}</span>
                <span className="pq-top5-val">{formatValue(question.key, r.value)}</span>
              </Link>
            ))}
          </div>
          {relatedRanking && (
            <Link href={`/rankings/${relatedRanking.slug}`} className="pq-ranking-link">
              Ver ranking completo ({relatedRanking.label}) →
            </Link>
          )}
        </section>

        {/* FAQ */}
        <section className="pq-faq">
          <h2 className="pq-section-title">Preguntas relacionadas</h2>
          {faqItems.map((f, i) => (
            <details key={i} className="mv2-faq-item">
              <summary>{f.q}</summary>
              <div className="mv2-faq-body">{f.a}</div>
            </details>
          ))}
        </section>

        {/* Otras preguntas */}
        <section className="pq-others">
          <h2 className="pq-section-title">Más preguntas de geografía</h2>
          <div className="pq-others-grid">
            {POPULAR_QUESTIONS.filter(q => q.slug !== question.slug).map(q => (
              <Link key={q.slug} href={`/preguntas/${q.slug}`} className="pq-other-card">
                <span className="pq-other-q">{q.q}</span>
                <span className="pq-other-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rk-cta">
          <h2 className="rk-cta-title">¿Lo sabías antes de leerlo?</h2>
          <p className="rk-cta-sub">Demuéstralo jugando al Modo Infinito</p>
          <div className="rk-cta-btns">
            <Link href="/infinito" className="mv-btn mv-btn-primary mv-btn-lg">♾️ Jugar Modo Infinito</Link>
            <Link href="/pais-del-dia" className="mv-btn mv-btn-secondary">📡 País del Día</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ─── Static generation ────────────────────────────────────────────────────────
export function getStaticPaths() {
  return {
    paths: POPULAR_QUESTIONS.map(q => ({ params: { slug: q.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const question = POPULAR_QUESTIONS.find(q => q.slug === params.slug);
  if (!question) return { notFound: true };

  const sorted = Object.entries(countries)
    .filter(([, c]) => c[question.key] !== null && c[question.key] !== undefined && !isNaN(c[question.key]))
    .map(([code, c]) => ({ code, name: c.name, flag: c.flag, value: c[question.key], slug: slugify(c.name) }))
    .sort((a, b) => question.direction === "desc" ? b.value - a.value : a.value - b.value);

  const top5 = sorted.slice(0, 5);
  const top1 = sorted[0];
  const relatedRanking = POPULAR_RANKINGS.find(r => r.key === question.key) || null;

  return { props: { question, top5, top1, relatedRanking } };
}
