import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es" dir="ltr">
      <Head>
        {/* ── Charset ── */}
        <meta charSet="UTF-8" />

        {/* ── Favicons ── */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />

        {/* ── Preconnect para recursos críticos externos ── */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />

        {/* ── Web App manifest (PWA) ── */}
        <link rel="manifest" href="/manifest.json" />

        {/* ── DNS prefetch para Google Maps (se usa en PDD) ── */}
        <link rel="dns-prefetch" href="https://www.google.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
