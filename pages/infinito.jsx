import Head from "next/head";
import Layout from "../components/Layout";
import HigherLowerVs from "../components/HigherLowerVs";

const SITE_URL = "https://mundovs.com";

function GameSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "MundoVs — Modo Infinito",
    url: `${SITE_URL}/infinito`,
    inLanguage: "es",
    genre: "Geography",
    gamePlatform: "Web",
    applicationCategory: "GameApplication",
    description:
      "Modo Infinito de MundoVs: compara países encadenados respondiendo si " +
      "el siguiente tiene más o menos en una categoría. Un fallo y se acaba.",
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

export default function InfinitoPage() {
  return (
    <Layout>
      <Head>
        <title>Modo Infinito — Cadena de comparaciones de países | MundoVs</title>
        <meta
          name="description"
          content="Juega al modo infinito: elige una categoría y descubre si cada país tiene más o menos que el anterior. Encadena la mayor racha posible."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={`${SITE_URL}/infinito`} />
        <meta property="og:title" content="Modo Infinito — MundoVs" />
        <meta
          property="og:description"
          content="Compara países sin parar. ¿Más o menos? Una respuesta mal y se acaba la cadena."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/infinito`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta property="og:locale" content="es_ES" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Modo Infinito — MundoVs" />
        <meta name="twitter:description" content="Cadena de comparaciones de países. ¿Hasta dónde llegas?" />
        <meta name="twitter:image" content={`${SITE_URL}/favicon-512.png`} />
        <GameSchema />
      </Head>
      <HigherLowerVs />
    </Layout>
  );
}
