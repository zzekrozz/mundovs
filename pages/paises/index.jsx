import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { BreadcrumbSchema } from "../../components/JsonLd";
import { slugify } from "../../lib/seo";
import countries from "../../data/countries.json";

const SITE_URL = "https://mundovs.com";

export default function PaisesIndex({ list }) {
  return (
    <Layout>
      <Head>
        <title>Países del mundo — Fichas con datos | MundoVs</title>
        <meta name="description" content="Fichas completas de 47 países con datos de población, economía, cultura, turismo y más. Rankings donde aparece cada país." />
        <link rel="canonical" href={`${SITE_URL}/paises`} />
        <meta property="og:title" content="Países del mundo — Datos y fichas | MundoVs" />
        <meta property="og:url" content={`${SITE_URL}/paises`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <BreadcrumbSchema items={[{ name: "Inicio", url: "/" }, { name: "Países", url: "/paises" }]} />
      </Head>

      <div className="pu-index-wrap">
        <div className="pu-index-hero">
          <h1 className="pu-index-title">Fichas de países</h1>
          <p className="pu-index-sub">{list.length} países con datos reales de población, economía, cultura y más.</p>
        </div>

        <div className="pu-index-grid">
          {list.map(p => (
            <Link key={p.code} href={`/paises/${p.slug}`} className="pu-index-card">
              <span className="pu-index-flag">{p.flag}</span>
              <span className="pu-index-name">{p.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function getStaticProps() {
  const list = Object.entries(countries)
    .map(([code, c]) => ({ code, name: c.name, flag: c.flag, slug: slugify(c.name) }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  return { props: { list } };
}
