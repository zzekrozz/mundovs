import Head from "next/head";
import Layout from "../components/Layout";
import MundoVs from "../components/MundoVs";

const SITE_URL = "https://mundovs.com";

function GameSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "MundoVs Clásico — Compara países",
    url: `${SITE_URL}/clasico`,
    inLanguage: "es",
    genre: "Geography",
    gamePlatform: "Web",
    applicationCategory: "GameApplication",
    description:
      "Modo clásico de MundoVs: elige dos países y compáralos en 5 categorías " +
      "sorpresa de un catálogo de 29 datos. ¿Acertarás quién gana en cada una?",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@type": "Organization", name: "MundoVs", url: SITE_URL },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Clasico() {
  return (
    <Layout>
      <Head>
        <title>MundoVs Clásico — Compara países en 5 datos sorpresa | MundoVs</title>
        <meta
          name="description"
          content="Adivina qué país gana en cada categoría. Compara 47 países en 29 datos reales: población, economía, cultura, comida, turismo y mucho más."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={`${SITE_URL}/clasico`} />
        <meta property="og:title" content="MundoVs Clásico — Compara países" />
        <meta
          property="og:description"
          content="Compara dos países en 5 categorías sorpresa y reta tu intuición geográfica."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/clasico`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MundoVs Clásico — Compara países" />
        <meta
          name="twitter:description"
          content="5 rondas, 2 países, datos reales. ¿Acertarás los cinco?"
        />
        <meta name="twitter:image" content={`${SITE_URL}/favicon-512.png`} />
        <GameSchema />
      </Head>
      <MundoVs />
    </Layout>
  );
}
