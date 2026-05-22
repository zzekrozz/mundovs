import "../styles/globals.css";
import Script from "next/script";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CookieConsentBanner from "../components/CookieConsentBanner";
import GoogleAnalytics from "../components/GoogleAnalytics";

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
