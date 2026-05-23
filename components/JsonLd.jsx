// ============================================================
// MundoVS — JsonLd helpers
// Renderiza schema.org seguro en SSR. Usar dentro de <Head>.
// ============================================================

import React from "react";

const SITE_URL = "https://mundovs.com";

function tag(obj) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
    />
  );
}

/**
 * Sitio entero (úsalo en la home una vez).
 */
export function WebSiteSchema() {
  return tag({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MundoVs",
    url: SITE_URL,
    inLanguage: "es",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

/**
 * App de juego.
 */
export function WebApplicationSchema() {
  return tag({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MundoVs",
    url: SITE_URL,
    applicationCategory: "GameApplication",
    operatingSystem: "Any (Web)",
    inLanguage: "es",
    description:
      "Juego de geografía gratis. Compara países, adivina el país del día, " +
      "consulta rankings y datos curiosos del mundo.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  });
}

/**
 * FAQ schema. Recibe array de { q, a }.
 */
export function FaqSchema({ items }) {
  if (!items || items.length === 0) return null;
  return tag({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  });
}

/**
 * Breadcrumb schema. Recibe array de { name, url }.
 */
export function BreadcrumbSchema({ items }) {
  if (!items || items.length === 0) return null;
  return tag({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  });
}

/**
 * ItemList — útil para rankings y listas de países.
 */
export function ItemListSchema({ items }) {
  if (!items || items.length === 0) return null;
  return tag({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url ? (it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`) : undefined,
    })),
  });
}
