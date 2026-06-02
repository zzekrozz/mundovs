import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { BreadcrumbSchema } from "../../components/JsonLd";

const SITE_URL = "https://mundovs.com";

export const POSTS = [
  {
    slug: "los-paises-mas-grandes-del-mundo",
    title: "Los 10 países más grandes del mundo y por qué la geografía importa",
    excerpt: "Rusia ocupa una superficie equivalente a la suma de los tres siguientes países más grandes. Pero el tamaño absoluto no lo es todo: analizamos qué significa ser un país gigante.",
    date: "2026-04-15",
    readTime: 6,
    category: "Geografía",
    icon: "🗺️",
  },
  {
    slug: "diferencias-economicas-espana-latinoamerica",
    title: "Diferencias económicas entre España y Latinoamérica explicadas",
    excerpt: "El PIB per cápita de España triplica al de muchos países latinoamericanos, pero el coste de vida también lo hace. Analizamos qué significa realmente esta brecha.",
    date: "2026-04-08",
    readTime: 8,
    category: "Economía",
    icon: "💰",
  },
  {
    slug: "por-que-paises-nordicos-mas-altos",
    title: "¿Por qué los países nórdicos son los más altos del mundo?",
    excerpt: "Países Bajos, Dinamarca y Noruega lideran las listas mundiales con medias por encima de los 180 cm. La explicación combina genética, nutrición infantil y bienestar social.",
    date: "2026-03-29",
    readTime: 5,
    category: "Sociedad",
    icon: "🧬",
  },
  {
    slug: "como-se-mide-pib-per-capita",
    title: "Cómo se mide el PIB per cápita y por qué a veces engaña",
    excerpt: "Es uno de los indicadores más usados para hablar de la riqueza de un país, pero sus limitaciones son enormes. Desigualdad, paridad de poder y economía sumergida cambian la imagen.",
    date: "2026-03-22",
    readTime: 7,
    category: "Economía",
    icon: "📊",
  },
  {
    slug: "cafe-mas-consumido-mundo",
    title: "El país que más café consume del mundo no es el que crees",
    excerpt: "Brasil produce el 35% del café mundial, pero en consumo per cápita está lejísimos del podio. Los líderes son los países nórdicos, con Finlandia a la cabeza.",
    date: "2026-03-15",
    readTime: 4,
    category: "Cultura",
    icon: "☕",
  },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogIndex() {
  const breadcrumbs = [{ name: "Inicio", url: "/" }, { name: "Blog", url: "/blog" }];
  return (
    <Layout>
      <Head>
        <title>Blog educativo — Geografía, economía y datos del mundo | MundoVs</title>
        <meta name="description" content="Artículos sobre geografía, economía mundial y datos curiosos de los países. Aprende mientras descubres el mundo." />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:title" content="Blog educativo — MundoVs" />
        <meta property="og:description" content="Artículos sobre geografía, economía y datos curiosos de los países del mundo." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:image" content={`${SITE_URL}/favicon-512.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog educativo — MundoVs" />
        <meta name="twitter:description" content="Geografía, economía y datos curiosos del mundo." />
        <BreadcrumbSchema items={breadcrumbs} />
      </Head>

      <div className="bl-index-wrap">
        <header className="bl-index-hero">
          <h1 className="bl-index-title">Blog educativo</h1>
          <p className="bl-index-sub">
            Geografía, economía y datos curiosos de los países. Para entender el mundo más allá de los números.
          </p>
        </header>

        <div className="bl-post-list">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="bl-post-card">
              <div className="bl-post-meta">
                <span className="bl-post-cat">
                  <span>{post.icon}</span>
                  <span>{post.category}</span>
                </span>
                <span className="bl-post-date">{formatDate(post.date)}</span>
                <span className="bl-post-time">{post.readTime} min</span>
              </div>
              <h2 className="bl-post-title">{post.title}</h2>
              <p className="bl-post-excerpt">{post.excerpt}</p>
              <span className="bl-post-cta">Leer artículo →</span>
            </Link>
          ))}
        </div>

        {/* Enlace al juego */}
        <div className="bl-index-bottom">
          <p>¿Prefieres aprender jugando?</p>
          <div className="bl-index-btns">
            <Link href="/pais-del-dia" className="mv-btn mv-btn-primary">📡 País del día</Link>
            <Link href="/clasico" className="mv-btn mv-btn-secondary">🆚 Comparar países</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
