import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { BreadcrumbSchema } from "../../components/JsonLd";
import { POPULAR_QUESTIONS } from "../../lib/seo";

const SITE_URL = "https://mundovs.com";

export default function PreguntasIndex() {
  return (
    <Layout>
      <Head>
        <title>Preguntas de geografía — Respuestas con datos reales | MundoVs</title>
        <meta name="description" content="¿Qué país tiene más población? ¿Cuál es el más grande? ¿Cuál vive más años? Respuestas directas con datos de fuentes oficiales." />
        <link rel="canonical" href={`${SITE_URL}/preguntas`} />
        <meta property="og:title" content="Preguntas de geografía | MundoVs" />
        <meta property="og:description" content="Respuestas directas a las preguntas geográficas más buscadas." />
        <meta property="og:url" content={`${SITE_URL}/preguntas`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <BreadcrumbSchema items={[{ name: "Inicio", url: "/" }, { name: "Preguntas", url: "/preguntas" }]} />
      </Head>

      <div className="pq-index-wrap">
        <header className="pq-index-hero">
          <h1 className="pq-index-title">Preguntas de geografía</h1>
          <p className="pq-index-sub">Las dudas más buscadas, respondidas con datos oficiales.</p>
        </header>

        <div className="pq-index-list">
          {POPULAR_QUESTIONS.map(q => (
            <Link key={q.slug} href={`/preguntas/${q.slug}`} className="pq-index-card">
              <span className="pq-index-mark">?</span>
              <span className="pq-index-q">{q.q}</span>
              <span className="pq-index-arrow">→</span>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/infinito" className="mv-btn mv-btn-primary">♾️ Demuéstralo jugando</Link>
        </div>
      </div>
    </Layout>
  );
}
