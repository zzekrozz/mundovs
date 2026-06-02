import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "mundovs_cookie_consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState(null); // null | "accepted" | "rejected"

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "accepted" || saved === "rejected") setConsent(saved);
    } catch (e) {}
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch (e) {}
    setConsent("accepted");
  }

  function reject() {
    try { localStorage.setItem(STORAGE_KEY, "rejected"); } catch (e) {}
    setConsent("rejected");
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setConsent(null);
  }

  return { consent, accept, reject, reset };
}

export default function CookieConsentBanner({ onAccept, onReject }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  if (!mounted || !visible) return null;

  function handleAccept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch (e) {}
    setVisible(false);
    onAccept?.();
  }

  function handleReject() {
    try { localStorage.setItem(STORAGE_KEY, "rejected"); } catch (e) {}
    setVisible(false);
    onReject?.();
  }

  return (
    <div className="cookie-banner" role="dialog" aria-label="Aviso de cookies" aria-live="polite">
      <div className="cookie-banner-content">
        <p className="cookie-banner-text">
          Usamos cookies técnicas, analíticas y publicitarias para mejorar MundoVS y financiar el proyecto con anuncios.{" "}
          <Link href="/legal/cookies" className="cookie-banner-link">
            Ver política de cookies ↗
          </Link>
        </p>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-reject" onClick={handleReject}>
            Rechazar
          </button>
          <button className="cookie-btn cookie-btn-accept" onClick={handleAccept}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
