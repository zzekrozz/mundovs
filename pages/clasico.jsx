import Head from "next/head";
import MundoVs from "../components/MundoVs";

export default function Clasico() {
  return (
    <>
      <Head>
        <title>Mundo VS Clásico — Compara países en 5 datos sorpresa | MundoVs</title>
        <meta name="description" content="Adivina qué país gana en cada categoría. Compara 47 países en 20 datos diferentes. ¿Acertarás todas?" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="Mundo VS Clásico — ¿Conoces el mundo?" />
        <meta property="og:description" content="Compara países en 5 datos sorpresa y reta a tus amigos." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MundoVs />
    </>
  );
}
