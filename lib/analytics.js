// ============================================================
// MundoVS — analytics helper
// trackEvent(name, props?) → enviar evento a GA4 (gtag) si está
// presente Y el usuario ha aceptado cookies. En cualquier otro
// caso, es un no-op silencioso. Nunca tira excepciones.
// ============================================================

const CONSENT_KEY = "mundovs_cookie_consent";

function hasConsent() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch (e) {
    return false;
  }
}

/**
 * Envía un evento de analytics si hay consentimiento y GA cargado.
 * - name: string corto en snake_case (ej: 'game_start', 'share_result').
 * - props: objeto plano de parámetros opcionales (ej: { mode: 'classic' }).
 * Nunca tira. Si algo falla, lo traga sin romper la UX.
 */
export function trackEvent(name, props) {
  if (typeof window === "undefined") return;
  if (!name) return;
  // Sin consentimiento, no se trackea nada (RGPD).
  if (!hasConsent()) return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, props || {});
    }
  } catch (e) {
    // Silencioso: la analítica nunca debe romper la app.
  }
}

/** Catálogo de eventos. No hace falta importarlo, pero documenta. */
export const EVENTS = {
  // Modos
  GAME_START:               "game_start",
  GAME_COMPLETE:            "game_complete",

  // País del día
  DAILY_COUNTRY_START:      "daily_country_start",
  DAILY_COUNTRY_SUCCESS:    "daily_country_success",
  DAILY_COUNTRY_FAIL:       "daily_country_fail",

  // Infinito
  INFINITE_MODE_START:      "infinite_mode_start",
  INFINITE_MODE_CORRECT:    "infinite_mode_correct",
  INFINITE_MODE_FAIL:       "infinite_mode_fail",

  // Challenger
  CHALLENGER_START:         "challenger_start",
  CHALLENGER_FAIL:          "challenger_fail",

  // Acciones del usuario
  SHARE_RESULT:             "share_result",
  CATEGORY_SELECTED:        "category_selected",
  COUNTRY_SELECTED:         "country_selected",

  // Navegación SEO
  RANKING_PAGE_CLICK:       "ranking_page_click",
  COUNTRY_PAGE_CLICK:       "country_page_click",
  COMPARE_PAGE_CLICK:       "compare_page_click",
};
