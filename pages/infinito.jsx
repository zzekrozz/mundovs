import Head from "next/head";
import Layout from "../components/Layout";
import HigherLowerVs from "../components/HigherLowerVs";

export default function InfinitoPage() {
  return (
    <Layout>
      <Head>
        <title>Higher / Lower VS — Modo Infinito | MundoVs</title>
        <meta
          name="description"
          content="Compara países sin parar. ¿Tiene más o menos? Encadena la mayor racha posible. Modo infinito de MundoVS."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="Higher / Lower VS — MundoVs" />
        <meta property="og:description" content="Compara países sin parar. Una respuesta mal y se acaba la misión." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HigherLowerVs />
    </Layout>
  );
}
