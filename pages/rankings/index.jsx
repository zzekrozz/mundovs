import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { BreadcrumbSchema } from "../../components/JsonLd";
import { POPULAR_RANKINGS } from "../../lib/seo";

const SITE_URL = "https://mundovs.com";

export default function RankingsIndex() {
  return (
    <Layout>
      <Head>
        <title>Rankings de países — Datos oficiales del mundo | MundoVs</title>
        <meta name="description" content="Explora los rankings de países por población, superficie, esperanza de vida, PIB, McDonald's y más. Datos de fuentes oficiales." />
        <link rel="canonical" href={`${SITE_URL}/rankings`} />
        <meta property="og:title" content="Rankings de países | MundoVs" />
        <meta property="og:description" content="Los países del mundo ordenados por los datos que más interesan." />
        <meta property="og:url" content={`${SITE_URL}/rankings`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <BreadcrumbSchema items={[{ name: "Inicio", url: "/" }, { name: "Rankings", url: "/rankings" }]} />
      </Head>

      <div className="rk-index-wrap">
        <div className="rk-index-hero">
          <div className="mv2-badge mv2-badge-blue" style={{ display:"inline-flex", marginBottom:"1rem" }}>RANKINGS GLOBALES</div>
          <h1 className="rk-index-title">Rankings de países</h1>
          <p className="rk-index-sub">Los datos del mundo, ordenados. Fuentes oficiales: Banco Mundial, OMS, FIFA, Forbes y más.</p>
        </div>

        <div className="rk-index-grid">
          {POPULAR_RANKINGS.map(r => (
            <Link key={r.slug} href={`/rankings/${r.slug}`} className="rk-index-card">
              <span className="rk-index-icon">{r.icon}</span>
              <div>
                <div className="rk-index-name">{r.label}</div>
                <div className="rk-index-arrow">Ver ranking completo →</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="rk-index-cta">
          <p>¿Quieres comparar dos países tú mismo?</p>
          <Link href="/clasico" className="mv-btn mv-btn-primary">Jugar MundoVs clásico</Link>
        </div>
      </div>
    </Layout>
  );
}
