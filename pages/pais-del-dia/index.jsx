import Head from "next/head";
import Layout from "../components/Layout";
import PaisDelDia from "../components/PaisDelDia";

export default function PaisDelDiaPage() {
  return (
    <Layout>
      <Head>
        <title>País del Día - Adivina el país secreto | MundoVs</title>
        <meta
          name="description"
          content="Cada día un país secreto distinto. Adivínalo con pistas progresivas. El reto diario de geografía más adictivo. Comparte tu resultado con tus amigos."
        />
        <meta property="og:title" content="País del Día - MundoVs" />
        <meta
          property="og:description"
          content="Adivina el país secreto del día con pistas progresivas. ¿Lo sacarás antes que tus amigos?"
        />
      </Head>
      <PaisDelDia />
    </Layout>
  );
}
