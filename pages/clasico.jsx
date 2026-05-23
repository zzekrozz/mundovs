import Head from "next/head";
import Layout from "../components/Layout";
import MundoVs from "../components/MundoVs";

export default function Clasico() {
  return (
    <Layout>
      <Head>
        <title>Mundo VS clásico — Compara países en 5 datos sorpresa | MundoVs</title>
        <meta
          name="description"
          content="Adivina qué país gana en cada categoría. Compara 47 países en 29 datos diferentes. ¿Acertarás los cinco?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="Mundo VS clásico — ¿Conoces el mundo?" />
        <meta property="og:description" content="Compara países en 5 datos sorpresa y reta a tus amigos." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MundoVs />
    </Layout>
  );
}
