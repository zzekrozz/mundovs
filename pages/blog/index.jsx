import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";

const POSTS = [
  {
    slug: "los-paises-mas-grandes-del-mundo",
    title: "Los 10 países más grandes del mundo y por qué la geografía importa",
    excerpt: "Rusia ocupa una superficie equivalente a la suma de los siguientes tres países más grandes. Pero no es ese tamaño absoluto lo que define el peso geopolítico de un país, sino cómo está repartida y aprovechada esa extensión.",
    date: "2026-04-15",
    readTime: 6,
  },
  {
    slug: "diferencias-economicas-espana-latinoamerica",
    title: "Diferencias económicas entre España y Latinoamérica explicadas",
    excerpt: "El PIB per cápita de España triplica al de muchos países latinoamericanos, pero el coste de vida también lo hace. Analizamos qué significa realmente esta brecha y por qué no es tan simple como parece.",
    date: "2026-04-08",
    readTime: 8,
  },
  {
    slug: "por-que-paises-nordicos-mas-altos",
    title: "¿Por qué los países nórdicos son los más altos del mundo?",
    excerpt: "Países Bajos, Dinamarca y Noruega lideran las listas mundiales con medias por encima de los 180 cm. La explicación combina genética, nutrición infantil y siglos de bienestar social.",
    date: "2026-03-29",
    readTime: 5,
  },
  {
    slug: "como-se-mide-pib-per-capita",
    title: "Cómo se mide el PIB per cápita y por qué a veces engaña",
    excerpt: "Es uno de los indicadores más usados para hablar de la riqueza de un país, pero sus limitaciones son enormes. Desigualdad, paridad de poder adquisitivo y economía sumergida cambian completamente la imagen.",
    date: "2026-03-22",
    readTime: 7,
  },
  {
    slug: "cafe-mas-consumido-mundo",
    title: "El país que más café consume del mundo no es el que crees",
    excerpt: "Brasil produce el 35% del café mundial, pero en consumo per cápita está lejísimos del podio. Los líderes son los países nórdicos, con Finlandia a la cabeza con cifras que sorprenden.",
    date: "2026-03-15",
    readTime: 4,
  },
];

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog educativo — MundoVs</title>
        <meta name="description" content="Artículos educativos sobre geografía, economía mundial, demografía y datos curiosos de los países del mundo. Aprende mientras descubres." />
      </Head>
      <Layout>
        <style jsx>{`
          .blog-header { padding: 1rem 0 2rem; border-bottom: 0.5px solid rgba(0,0,0,0.08); margin-bottom: 2rem; }
          .blog-title { font-size: 28px; font-weight: 500; line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 0.5rem; color: #1A1A1A; }
          .blog-subtitle { font-size: 15px; color: #666; line-height: 1.5; }
          .post-list { display: flex; flex-direction: column; gap: 1.5rem; }
          .post-card { padding: 1.25rem; border: 0.5px solid rgba(0,0,0,0.08); border-radius: 12px; transition: all 0.15s; cursor: pointer; }
          .post-card:hover { border-color: #1D9E75; background: #F4F2EC; }
          .post-meta { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; }
          .post-title { font-size: 18px; font-weight: 500; line-height: 1.3; margin-bottom: 0.5rem; color: #1A1A1A; }
          .post-excerpt { font-size: 14px; color: #555; line-height: 1.6; }
          .post-link { color: inherit; text-decoration: none; display: block; }
          .post-link:hover { text-decoration: none; }
        `}</style>

        <header className="blog-header">
          <h1 className="blog-title">Blog educativo</h1>
          <p className="blog-subtitle">
            Artículos sobre geografía, economía mundial y datos curiosos de los países. Para entender el mundo más allá de los números.
          </p>
        </header>

        <div className="post-list">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="post-link">
              <article className="post-card">
                <div className="post-meta">
                  {new Date(post.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })} · {post.readTime} min de lectura
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
              </article>
            </Link>
          ))}
        </div>
      </Layout>
    </>
  );
}
