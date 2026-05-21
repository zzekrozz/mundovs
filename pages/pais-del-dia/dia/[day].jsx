import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../../../components/Layout";
import PaisDelDia from "../../../components/PaisDelDia";

export default function PaisDelDiaArchivo() {
  const router = useRouter();
  const { day } = router.query;

  if (!day) {
    return (
      <Layout>
        <div className="pdd-loading"><div className="pdd-loading-globe">🌍</div>Cargando...</div>
      </Layout>
    );
  }

  const dayNum = parseInt(day, 10);
  if (isNaN(dayNum)) {
    return (
      <Layout>
        <div className="pdd-loading">Día no válido</div>
      </Layout>
    );
  }

  // Calcular offset desde hoy
  const START_DATE = new Date("2026-05-05T00:00:00.000Z");
  const now = new Date();
  const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const today = Math.floor((utcNow.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
  const offset = dayNum - today;

  return (
    <Layout>
      <Head>
        <title>Día #{dayNum} · País del Día · MundoVs</title>
        <meta name="robots" content="noindex" />
      </Head>
      <PaisDelDia dayOffset={offset} />
    </Layout>
  );
}
