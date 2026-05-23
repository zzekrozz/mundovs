import Head from "next/head";
import Layout from "../../components/Layout";
import ContentPage from "../../components/ContentPage";

export default function Terminos() {
  return (
    <>
      <Head>
        <title>Términos y condiciones — MundoVs</title>
        <meta name="description" content="Términos y condiciones de uso de la herramienta educativa MundoVs." />
      </Head>
      <Layout>
        <ContentPage
          title="Términos y condiciones de uso"
          subtitle="Las reglas básicas para usar MundoVs."
          lastUpdated="Mayo 2026"
        >
          <p>
            Estos términos regulan el uso de la web MundoVs (mundovs.com). Al acceder y utilizar este sitio web, aceptas estos términos en su totalidad. Si no estás de acuerdo con alguna parte, te pedimos que no utilices la web.
          </p>

          <h2>1. Sobre MundoVs</h2>
          <p>
            MundoVs es una herramienta educativa gratuita que permite comparar países en distintos indicadores demográficos, económicos y sociales. El contenido de la web está dirigido a estudiantes, docentes, investigadores y al público general interesado en geografía y datos del mundo.
          </p>
          <p>
            La herramienta es de uso libre y no requiere registro, suscripción ni pago alguno.
          </p>

          <h2>2. Uso permitido</h2>
          <p>
            Puedes usar MundoVs libremente para:
          </p>
          <ul>
            <li>Jugar partidas de comparación con fines personales o educativos.</li>
            <li>Compartir resultados de partidas en redes sociales o por mensajería.</li>
            <li>Citar datos de la web en trabajos académicos, siempre que se mencione la fuente original (Banco Mundial, OCDE, etc.) y opcionalmente MundoVs como herramienta de consulta.</li>
            <li>Recomendar la web a otros usuarios.</li>
          </ul>

          <h2>3. Uso no permitido</h2>
          <p>
            No está permitido:
          </p>
          <ul>
            <li>Copiar el código, diseño o estructura de la web para crear productos similares competidores.</li>
            <li>Usar técnicas de scraping masivo o automatizado para extraer la base de datos.</li>
            <li>Manipular el contenido de la web mediante extensiones, scripts o herramientas externas.</li>
            <li>Intentar comprometer la seguridad del sitio o de sus usuarios.</li>
            <li>Utilizar la web con fines fraudulentos o ilegales.</li>
            <li>Sobrecargar los servidores con peticiones automatizadas.</li>
          </ul>

          <h2>4. Propiedad intelectual</h2>
          <p>
            El diseño, el código fuente, los textos originales, las ilustraciones y la marca MundoVs están protegidos por las leyes de propiedad intelectual aplicables. Su uso comercial sin autorización está prohibido.
          </p>
          <p>
            Los datos numéricos provienen de fuentes públicas oficiales (Banco Mundial, OCDE, OMS, FIFA, COI, etc.) y son del dominio público o están disponibles bajo licencias abiertas. La compilación, organización y presentación de estos datos en MundoVs sí está protegida.
          </p>

          <h2>5. Exactitud de los datos</h2>
          <p>
            Hacemos un esfuerzo razonable para que los datos mostrados sean correctos y estén actualizados, pero no podemos garantizar exactitud absoluta. Las estadísticas internacionales tienen siempre cierto margen de error y desfase temporal respecto a la realidad.
          </p>
          <p>
            Por tanto, MundoVs <strong>no debe usarse como única fuente</strong> para decisiones importantes (académicas, profesionales, financieras). Para usos críticos, recomendamos siempre consultar directamente las fuentes oficiales originales.
          </p>

          <h2>6. Limitación de responsabilidad</h2>
          <p>
            MundoVs se ofrece "tal cual", sin garantías de ningún tipo. No nos hacemos responsables de:
          </p>
          <ul>
            <li>Decisiones tomadas basándose en los datos mostrados en la web.</li>
            <li>Interrupciones temporales del servicio.</li>
            <li>Errores en los datos que escapen a nuestro control de calidad.</li>
            <li>Daños derivados del uso de la web.</li>
          </ul>

          <h2>7. Enlaces externos</h2>
          <p>
            La web puede contener enlaces a otros sitios (fuentes oficiales, redes sociales, etc.). No nos hacemos responsables del contenido o las prácticas de privacidad de esos sitios externos.
          </p>

          <h2>8. Publicidad</h2>
          <p>
            MundoVs muestra anuncios a través de Google AdSense para mantener el servicio gratuito. No tenemos control directo sobre los anuncios específicos que se muestran, ya que Google los selecciona en función del contexto y del usuario.
          </p>
          <p>
            Si ves un anuncio que consideras inapropiado, puedes notificarlo directamente a Google a través de los controles que aparecen en cada anuncio, o escribirnos para que estudiemos bloquearlo.
          </p>

          <h2>9. Disponibilidad</h2>
          <p>
            Aunque trabajamos para mantener la web disponible 24/7, pueden producirse interrupciones por mantenimiento, actualizaciones o causas técnicas. Nos reservamos el derecho a interrumpir temporalmente el servicio sin previo aviso.
          </p>

          <h2>10. Modificaciones</h2>
          <p>
            Nos reservamos el derecho a modificar estos términos en cualquier momento. La versión actualizada aparecerá publicada en esta misma URL y la fecha de última actualización quedará indicada. El uso continuado de la web después de los cambios implica la aceptación de los nuevos términos.
          </p>

          <h2>11. Legislación aplicable</h2>
          <p>
            Estos términos se rigen por la legislación española. Cualquier conflicto derivado del uso de MundoVs será resuelto ante los tribunales competentes en España, salvo que la legislación de protección al consumidor establezca otra jurisdicción para usuarios residentes en otros países de la Unión Europea.
          </p>

          <h2>12. Contacto</h2>
          <p>
            Si tienes cualquier duda sobre estos términos, escríbenos a <strong>contacto@mundovs.com</strong>.
          </p>
        </ContentPage>
      </Layout>
    </>
  );
}
