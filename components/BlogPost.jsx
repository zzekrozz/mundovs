// ============================================================
// MundoVS — BlogPost wrapper
// Envuelve todos los artículos del blog con SEO completo:
// title, description, canonical, OG, Twitter Card, JSON-LD Article,
// BreadcrumbList, y el layout visual de post.
// Uso:
//   <BlogPost slug="mi-slug" title="..." description="..." date="2026-04-15" readTime={6}>
//     <p>Contenido...</p>
//   </BlogPost>
// ============================================================

import Head from "next/head";
import Link from "next/link";
import Layout from "./Layout";

const SITE_URL = "https://mundovs.com";

export default function BlogPost({ slug, title, description, date, readTime, children }) {
  const url = `${SITE_URL}/blog/${slug}`;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const isoDate = date ? new Date(date).toISOString() : "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: isoDate,
    dateModified: isoDate,
    author: { "@type": "Organization", name: "MundoVs", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "MundoVs",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon-512.png` },
    },
    image: `${SITE_URL}/favicon-512.png`,
    inLanguage: "es",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  return (
    <Layout>
      <Head>
        <title>{title} | MundoVs</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta property="og:locale" content="es_ES" />
        <meta property="article:published_time" content={isoDate} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${SITE_URL}/favicon-512.png`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>

      <article className="bl-post-wrap">
        {/* Breadcrumb */}
        <nav className="rk-breadcrumb" aria-label="Navegación">
          <Link href="/">Inicio</Link>
          <span>›</span>
          <Link href="/blog">Blog</Link>
          <span>›</span>
          <span style={{ color: "var(--mv-text-dim)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </span>
        </nav>

        <header className="bl-post-header">
          <h1 className="bl-post-h1">{title}</h1>
          {(formattedDate || readTime) && (
            <div className="bl-post-meta-header">
              {formattedDate && <span>{formattedDate}</span>}
              {readTime && <span>· {readTime} min de lectura</span>}
            </div>
          )}
          {description && <p className="bl-post-lead">{description}</p>}
        </header>

        <div className="bl-post-body">{children}</div>

        {/* CTA al final */}
        <div className="bl-post-footer">
          <div className="bl-post-footer-text">¿Quieres poner a prueba lo que acabas de aprender?</div>
          <div className="bl-post-footer-btns">
            <Link href="/pais-del-dia" className="mv-btn mv-btn-primary">📡 País del Día</Link>
            <Link href="/clasico" className="mv-btn mv-btn-secondary">🆚 Comparar países</Link>
            <Link href="/infinito" className="mv-btn mv-btn-secondary">♾️ Modo Infinito</Link>
          </div>
          <Link href="/blog" className="bl-post-back">← Volver al blog</Link>
        </div>
      </article>
    </Layout>
  );
}
