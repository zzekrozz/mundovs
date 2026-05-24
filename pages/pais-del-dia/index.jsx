import Head from "next/head";
import Layout from "../../components/Layout";
import PaisDelDia from "../../components/PaisDelDia";

const SITE_URL = "https://mundovs.com";

function GameSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "MundoVs — País del Día",
    url: `${SITE_URL}/pais-del-dia`,
    inLanguage: "es",
    genre: "Geography",
    gamePlatform: "Web",
    applicationCategory: "GameApplication",
    description:
      "Reto diario de geografía. Cada día un país secreto distinto: " +
      "tienes diez pistas progresivas para descubrirlo. Cuanto antes lo " +
      "adivines, más puntos. Comparte tu resultado con tus amigos.",
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

export default function PaisDelDiaPage() {
  return (
    <Layout>
      <Head>
        <title>País del Día — Adivina el país secreto del día | MundoVs</title>
        <meta
          name="description"
          content="Cada día un país secreto distinto. Adivínalo con 10 pistas progresivas. El reto diario de geografía más adictivo. Comparte tu resultado."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={`${SITE_URL}/pais-del-dia`} />
        <meta property="og:title" content="País del Día — MundoVs" />
        <meta
          property="og:description"
          content="Adivina el país secreto del día con pistas progresivas. ¿Lo sacarás antes que tus amigos?"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/pais-del-dia`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="País del Día — MundoVs" />
        <meta
          name="twitter:description"
          content="Adivina el país secreto del día con 10 pistas. Sólo una oportunidad."
        />
        <meta name="twitter:image" content={`${SITE_URL}/favicon-512.png`} />
        <GameSchema />
      </Head>
      <PaisDelDia />
    </Layout>
  );
}
