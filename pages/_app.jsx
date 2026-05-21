import "../styles/globals.css";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";

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

  // Re-parse emojis on every page change
  useEffect(() => {
    parseTwemoji();
    // Small delay to catch dynamic content
    const timer = setTimeout(parseTwemoji, 300);
    return () => clearTimeout(timer);
  }, [router.asPath]);

  // Also re-parse when DOM updates (for dynamic game content)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      parseTwemoji();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Twemoji - renders flag emojis as images on all platforms */}
      <Script
        src="https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js"
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={parseTwemoji}
      />

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-883JPQGZ1H"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-883JPQGZ1H');
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}
