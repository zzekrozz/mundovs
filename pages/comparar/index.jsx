import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { BreadcrumbSchema } from "../../components/JsonLd";
import { POPULAR_COMPARISONS, compareSlug } from "../../lib/seo";
import countries from "../../data/countries.json";

const SITE_URL = "https://mundovs.com";

export default function CompararIndex({ list }) {
  return (
    <Layout>
      <Head>
        <title>Comparaciones de países — Datos cara a cara | MundoVs</title>
        <meta name="description" content="Compara países cara a cara: población, economía, cultura y más. España vs Francia, EEUU vs China, y otras comparaciones populares." />
        <link rel="canonical" href={`${SITE_URL}/comparar`} />
        <meta property="og:title" content="Comparaciones de países | MundoVs" />
        <meta property="og:url" content={`${SITE_URL}/comparar`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <BreadcrumbSchema items={[{ name: "Inicio", url: "/" }, { name: "Comparar", url: "/comparar" }]} />
      </Head>
      <div className="cp-index-wrap">
        <h1 className="cp-index-title">Comparaciones de países</h1>
        <p className="cp-index-sub">Los duelos más buscados, con datos reales.</p>
        <div className="cp-index-grid">
          {list.map(item => (
            <Link key={item.slug} href={`/comparar/${item.slug}`} className="mv2-compare">
              <div className="mv2-compare-flags">
                <span>{item.flagA}</span>
                <span className="mv2-compare-vs">vs</span>
                <span>{item.flagB}</span>
              </div>
              <div className="mv2-compare-name">{item.nameA} vs {item.nameB}</div>
              <span className="mv2-compare-cta">Ver comparación →</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/clasico" className="mv-btn mv-btn-primary">Crear tu propia comparación →</Link>
        </div>
      </div>
    </Layout>
  );
}

export function getStaticProps() {
  const list = POPULAR_COMPARISONS.map(({ a, b }) => {
    const cA = countries[a]; const cB = countries[b];
    if (!cA || !cB) return null;
    return { nameA: cA.name, nameB: cB.name, flagA: cA.flag, flagB: cB.flag, slug: compareSlug(cA.name, cB.name) };
  }).filter(Boolean);
  return { props: { list } };
}
