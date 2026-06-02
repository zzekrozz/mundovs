import "../styles/tokens.css";
import "../styles/globals.css";
import Script from "next/script";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CookieConsentBanner from "../components/CookieConsentBanner";
import GoogleAnalytics from "../components/GoogleAnalytics";

const SITE_URL = "https://mundovs.com";

// ─── Schema Organization global ──────────────────────────────────────────────
// Se renderiza UNA sola vez en _app para todos los listados de Google.
// sameAs vacío hasta que existan perfiles sociales verificados.
const ORG_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MundoVs",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon-512.png`,
  description:
    "MundoVs es un juego educativo gratuito de geografía. " +
    "Compara países, adivina el país del día, consulta rankings " +
    "y aprende datos del mundo de forma divertida.",
  inLanguage: "es",
  sameAs: [
    // TODO: añadir cuando existan perfiles verificados
    // "https://twitter.com/mundovs",
    // "https://www.instagram.com/mundovs",
  ],
});

const STORAGE_KEY = "mundovs_cookie_consent";

function parseTwemoji() {
  if (typeof window !== "undefined" && window.twemoji) {
    window.twemoji.parse(document.body, {
      folder: "svg",
      ext: ".svg",
      base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
    });
  }
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [consent, setConsent] = useState(null); // null | "accepted" | "rejected"

  // Leer consentimiento guardado al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "accepted" || saved === "rejected") setConsent(saved);
    } catch (e) {}
  }, []);

  // Re-parse emojis on every page change
  useEffect(() => {
    parseTwemoji();
    const timer = setTimeout(parseTwemoji, 300);
    return () => clearTimeout(timer);
  }, [router.asPath]);

  // Also re-parse when DOM updates (for dynamic game content)
  useEffect(() => {
    const observer = new MutationObserver(() => { parseTwemoji(); });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Metadatos globales (se heredan; cada página los sobreescribe) ── */}
      <Head>
        {/* Viewport unificado */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Theme color (Chrome, Safari iOS) */}
        <meta name="theme-color" content="#071D2A" />
        <meta name="msapplication-TileColor" content="#071D2A" />
        {/* OG global */}
        <meta property="og:site_name" content="MundoVs" />
        <meta property="og:type" content="website" />
        {/* Twitter global */}
        <meta name="twitter:site" content="@mundovs" />
        <meta name="twitter:creator" content="@mundovs" />
        {/* Schema Organization — una sola vez en toda la app */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ORG_SCHEMA }}
        />
      </Head>

      {/* Twemoji */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={parseTwemoji}
      />

      {/* Google Analytics — solo si el usuario aceptó */}
      <GoogleAnalytics consent={consent} />

      {/* App */}
      <Component {...pageProps} />

      {/* Banner de cookies — aparece si no hay decisión guardada */}
      <CookieConsentBanner
        onAccept={() => setConsent("accepted")}
        onReject={() => setConsent("rejected")}
      />
    </>
  );
}
