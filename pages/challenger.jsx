import Head from "next/head";
import Layout from "../components/Layout";
import MundoVs from "../components/MundoVs";

const SITE_URL = "https://mundovs.com";

function GameSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "MundoVs Challenger — Racha infinita",
    url: `${SITE_URL}/challenger`,
    inLanguage: "es",
    genre: "Geography",
    gamePlatform: "Web",
    applicationCategory: "GameApplication",
    description:
      "Modo Challenger de MundoVs: comparaciones infinitas de países hasta el " +
      "primer fallo. ¿Cuántas conseguirás encadenar antes de equivocarte?",
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

export default function ChallengerPage() {
  return (
    <Layout>
      <Head>
        <title>Challenger — Racha infinita de comparaciones | MundoVs</title>
        <meta
          name="description"
          content="Modo Challenger: rachas infinitas de comparaciones de países. Un fallo y se acaba. ¿Hasta dónde aguantas?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={`${SITE_URL}/challenger`} />
        <meta property="og:title" content="MundoVs Challenger — Racha infinita" />
        <meta
          property="og:description"
          content="Aciertos infinitos hasta el primer fallo. ¿Cuántas conseguirás encadenar?"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/challenger`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MundoVs Challenger" />
        <meta
          name="twitter:description"
          content="Aciertos infinitos hasta el primer fallo. ¿Cuántas encadenas?"
        />
        <meta name="twitter:image" content={`${SITE_URL}/favicon-512.png`} />
        <GameSchema />
      </Head>
      <MundoVs initialMode="challenger" />
    </Layout>
  );
}
