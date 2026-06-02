import Head from "next/head";
import Layout from "../components/Layout";
import ContentPage from "../components/ContentPage";

export default function Contacto() {
  return (
    <>
      <Head>
        <title>Contacto — MundoVs</title>
        <meta name="description" content="Contacta con el equipo de MundoVs para sugerencias, correcciones de datos, colaboraciones o consultas sobre la herramienta educativa." />
      </Head>
      <Layout>
        <ContentPage
          title="Contacto"
          subtitle="Sugerencias, correcciones, colaboraciones. Estamos abiertos."
        >
          <p>
            Si quieres ponerte en contacto con nosotros, puedes hacerlo a través del correo electrónico que encontrarás más abajo. Leemos todos los mensajes y respondemos a la mayoría, aunque a veces podemos tardar varios días en hacerlo.
          </p>

          <h2>¿Para qué puedes escribirnos?</h2>

          <h3>Corrección de datos</h3>
          <p>
            Si has detectado un dato que crees que está incorrecto, desactualizado o que tiene una fuente mejor, escríbenos indicando:
          </p>
          <ul>
            <li>Qué país y qué categoría</li>
            <li>El valor que aparece en MundoVs</li>
            <li>El valor que crees que sería correcto</li>
            <li>La fuente oficial que respalda la corrección</li>
          </ul>
          <p>
            Revisamos todas las sugerencias bien fundamentadas y, si están respaldadas por fuentes fiables, actualizamos la base de datos en la siguiente revisión.
          </p>

          <h3>Sugerencias de nuevas categorías</h3>
          <p>
            Tenemos veinte categorías en la base de datos, pero podemos añadir más. Si crees que falta algún indicador relevante (con fuente oficial fiable), nos encantará considerarlo.
          </p>

          <h3>Uso educativo</h3>
          <p>
            Si eres profesor, profesora o trabajas en educación y quieres usar MundoVs en tus clases, no dudes en escribirnos. Podemos ayudarte con materiales de apoyo o sugerencias didácticas. La herramienta es y seguirá siendo gratuita.
          </p>

          <h3>Colaboraciones y prensa</h3>
          <p>
            Si trabajas en medios de comunicación, organizaciones educativas o quieres proponer una colaboración, escribe especificando el tipo de propuesta.
          </p>

          <h3>Cuestiones técnicas</h3>
          <p>
            Si encuentras un error técnico (la web no funciona en tu dispositivo, un botón no responde, los datos no cargan), por favor indica qué dispositivo y navegador estás usando.
          </p>

          <h2>Email de contacto</h2>
          <p>
            Puedes escribirnos a:
          </p>
          <p style={{ fontSize: 18, padding: "1rem", background: "var(--mv-card)", borderRadius: 8, textAlign: "center", margin: "1rem 0" }}>
            <strong>contacto@mundovs.com</strong>
          </p>
          <p>
            <em>Por cuestiones de spam, te recomendamos escribir un asunto descriptivo. Los correos sin asunto o con asuntos genéricos pueden ir a la carpeta de no deseados.</em>
          </p>

          <h2>Lo que no respondemos</h2>
          <p>
            Para gestionar bien el tiempo, hay algunos tipos de mensajes a los que no respondemos:
          </p>
          <ul>
            <li>Propuestas de SEO, backlinks o intercambio de enlaces</li>
            <li>Ofertas de servicios o productos no relacionados con el proyecto</li>
            <li>Solicitudes de publicidad fuera del sistema estándar</li>
            <li>Reclamaciones sobre datos sin aportar fuente alternativa</li>
          </ul>

          <h2>Tiempo de respuesta</h2>
          <p>
            MundoVs es un proyecto independiente y los mensajes los gestionamos personalmente. El tiempo medio de respuesta suele estar entre 2 y 7 días laborables. Si tu mensaje es importante y no recibes respuesta en dos semanas, no dudes en reenviarlo.
          </p>

          <p style={{ marginTop: "2rem", padding: "1rem", background: "var(--mv-green-soft)", borderRadius: 8, fontSize: 14 }}>
            <strong>Aviso de privacidad:</strong> los correos que nos envíes los usamos exclusivamente para responderte. No los añadimos a ninguna lista de correo, no los compartimos con terceros y los eliminamos cuando ya no son necesarios. Para más información puedes consultar nuestra <a href="/legal/privacidad">política de privacidad</a>.
          </p>
        </ContentPage>
      </Layout>
    </>
  );
}
