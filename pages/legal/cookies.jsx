import Head from "next/head";
import Layout from "../../components/Layout";
import ContentPage from "../../components/ContentPage";

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Política de cookies — MundoVs</title>
        <meta name="description" content="Información sobre las cookies que utiliza MundoVs y cómo gestionarlas." />
      </Head>
      <Layout>
        <ContentPage
          title="Política de cookies"
          subtitle="Qué cookies usamos, para qué sirven y cómo gestionarlas."
          lastUpdated="Mayo 2026"
        >
          <p>
            Este documento explica qué son las cookies, qué cookies utiliza MundoVs y cómo puedes gestionar tus preferencias respecto a ellas.
          </p>

          <h2>¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que los sitios web colocan en el dispositivo (ordenador, móvil, tablet) cuando los visitas. Sirven para recordar información sobre la visita: idioma preferido, opciones marcadas, identificación del usuario, etc. Existen desde los inicios de la web y son una herramienta básica para el funcionamiento de internet moderno.
          </p>

          <h2>Tipos de cookies</h2>
          <p>
            Las cookies pueden clasificarse de varias formas:
          </p>

          <h3>Según quién las gestiona</h3>
          <ul>
            <li><strong>Cookies propias</strong> — las gestiona directamente MundoVs.</li>
            <li><strong>Cookies de terceros</strong> — las gestiona otra entidad (Google, redes sociales, etc.) cuyo servicio se incluye en la web.</li>
          </ul>

          <h3>Según su duración</h3>
          <ul>
            <li><strong>Cookies de sesión</strong> — se eliminan cuando cierras el navegador.</li>
            <li><strong>Cookies persistentes</strong> — se mantienen durante un periodo de tiempo definido.</li>
          </ul>

          <h3>Según su finalidad</h3>
          <ul>
            <li><strong>Técnicas</strong> — necesarias para el funcionamiento básico de la web.</li>
            <li><strong>Analíticas</strong> — sirven para medir cómo se usa la web.</li>
            <li><strong>Publicitarias</strong> — sirven para mostrar anuncios.</li>
            <li><strong>De personalización</strong> — recuerdan preferencias del usuario.</li>
          </ul>

          <h2>Cookies utilizadas en MundoVs</h2>

          <h3>Cookies técnicas (necesarias)</h3>
          <p>
            Son las imprescindibles para que la web funcione correctamente. No se pueden desactivar porque sin ellas la web no operaría. No requieren consentimiento del usuario según la normativa.
          </p>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>__cf_bm</td>
                <td>Cloudflare — protección anti-bots</td>
                <td>30 minutos</td>
              </tr>
            </tbody>
          </table>

          <h3>Cookies analíticas</h3>
          <p>
            Las usamos para entender de forma anónima y agregada cómo los usuarios interactúan con la web (qué países se comparan más, qué páginas se visitan, en qué punto los usuarios abandonan, etc.). Esta información nos ayuda a mejorar la herramienta.
          </p>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Analytics</td>
                <td>Distinguir usuarios únicos</td>
                <td>2 años</td>
              </tr>
              <tr>
                <td>_ga_*</td>
                <td>Google Analytics</td>
                <td>Persistir estado de sesión</td>
                <td>2 años</td>
              </tr>
            </tbody>
          </table>

          <h3>Cookies publicitarias</h3>
          <p>
            Las gestiona Google a través de AdSense. Sirven para mostrar publicidad relevante y medir su rendimiento. Es la forma en que financiamos la web para que pueda ser gratuita.
          </p>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>__gads</td>
                <td>Google AdSense</td>
                <td>Mostrar anuncios y limitar frecuencia</td>
                <td>13 meses</td>
              </tr>
              <tr>
                <td>IDE</td>
                <td>DoubleClick (Google)</td>
                <td>Medir rendimiento de anuncios</td>
                <td>13 meses</td>
              </tr>
              <tr>
                <td>NID</td>
                <td>Google</td>
                <td>Preferencias y personalización</td>
                <td>6 meses</td>
              </tr>
            </tbody>
          </table>

          <h2>Cómo gestionar las cookies</h2>

          <h3>Configuración del navegador</h3>
          <p>
            Todos los navegadores modernos permiten gestionar cookies (verlas, eliminarlas, bloquearlas). Encontrarás las opciones en los ajustes de tu navegador. Aquí tienes enlaces a las guías oficiales:
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>

          <h3>Optar por no recibir publicidad personalizada de Google</h3>
          <p>
            Si quieres seguir viendo anuncios pero que no estén personalizados según tu actividad, puedes configurarlo en:
          </p>
          <ul>
            <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Configuración de anuncios de Google</a></li>
            <li><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance (aboutads.info)</a></li>
            <li><a href="https://www.youronlinechoices.com/es/" target="_blank" rel="noopener noreferrer">Your Online Choices (versión europea)</a></li>
          </ul>

          <h2>Consecuencias de desactivar las cookies</h2>
          <p>
            Si desactivas las cookies completamente:
          </p>
          <ul>
            <li>La web seguirá funcionando, ya que no usamos cookies para guardar el estado del juego (todo está en memoria del navegador durante la sesión).</li>
            <li>Verás anuncios menos relevantes, pero seguirás viéndolos.</li>
            <li>No podremos analizar de forma agregada cómo se usa la web, lo que dificulta su mejora.</li>
          </ul>

          <h2>Cambios en esta política</h2>
          <p>
            Esta política puede actualizarse cuando cambien las cookies que utilizamos o la legislación aplicable. La fecha de última actualización aparece al principio.
          </p>

          <h2>Más información</h2>
          <p>
            Para cualquier duda sobre cookies, puedes consultar también nuestra <a href="/legal/privacidad">política de privacidad</a> o escribirnos a <strong>contacto@mundovs.com</strong>.
          </p>
        </ContentPage>
      </Layout>
    </>
  );
}
