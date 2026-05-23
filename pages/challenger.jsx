import Head from "next/head";
import Layout from "../components/Layout";
import MundoVs from "../components/MundoVs";

export default function ChallengerPage() {
  return (
    <Layout>
      <Head>
        <title>Challenger — Aciertos infinitos hasta el primer fallo | MundoVs</title>
        <meta
          name="description"
          content="Modo Challenger: rachas infinitas de comparaciones de países. ¿Hasta dónde llegas?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="MundoVs Challenger" />
        <meta property="og:description" content="Aciertos infinitos. ¿Cuánto aguantas sin fallar?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MundoVs initialMode="challenger" />
    </Layout>
  );
}
