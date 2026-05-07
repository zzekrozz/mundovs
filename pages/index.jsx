import Head from "next/head";
import MundoVs from "../components/MundoVs";

export default function Home() {
  return (
    <>
      <Head>
        <title>MundoVs — Compara países en 5 datos sorpresa</title>
        <meta name="description" content="Adivina qué país gana en cada categoría. Compara 42 países en 20 datos diferentes. ¿Acertarás todas?" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="MundoVs — ¿Conoces el mundo?" />
        <meta property="og:description" content="Compara países en 5 datos sorpresa y reta a tus amigos." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        {/* Cuando tengas la cuenta de AdSense, descomenta esto:
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        */}
      </Head>
      <MundoVs />
    </>
  );
}
