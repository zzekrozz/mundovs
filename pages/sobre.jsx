import Head from "next/head";
import Layout from "../components/Layout";
import ContentPage from "../components/ContentPage";

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre MundoVs — Herramienta educativa de comparación de países</title>
        <meta name="description" content="MundoVs es una herramienta educativa gratuita que ayuda a estudiantes, profesores y curiosos a aprender geografía, demografía y datos del mundo de forma interactiva." />
      </Head>
      <Layout>
        <ContentPage
          title="Sobre MundoVs"
          subtitle="Una herramienta educativa para descubrir el mundo a través de los datos."
        >
          <h2>Nuestra misión</h2>
          <p>
            <strong>MundoVs</strong> es un proyecto educativo que nació con una idea simple: la mayoría de personas no conocemos los datos básicos de los países del mundo, ni los nuestros propios. Sabemos dónde están en el mapa, pero rara vez tenemos una idea precisa de su tamaño real, su población, su economía o sus particularidades sociales.
          </p>
          <p>
            Esta web convierte el aprendizaje de geografía y demografía en un juego interactivo. En lugar de memorizar tablas aburridas, comparas dos países en cinco categorías sorpresa, intentas adivinar quién gana en cada una y, al final, descubres datos que probablemente no conocías.
          </p>

          <h2>Para quién está pensado</h2>
          <p>
            Hemos diseñado MundoVs pensando en tres tipos de usuarios principales:
          </p>
          <ul>
            <li><strong>Estudiantes</strong> de secundaria y bachillerato que necesitan repasar geografía, economía o ciencias sociales de una forma más amena que los libros de texto.</li>
            <li><strong>Profesores y docentes</strong> que buscan un recurso interactivo para introducir conceptos de demografía, economía mundial o geografía humana en sus clases.</li>
            <li><strong>Curiosos</strong> de cualquier edad que disfrutan descubriendo datos sorprendentes sobre los países del mundo.</li>
          </ul>

          <h2>Por qué creemos que funciona</h2>
          <p>
            La investigación en aprendizaje muestra que <strong>la información retenida cuando se descubre activamente es muchísimo mayor</strong> que cuando se lee de forma pasiva. Cuando intentas adivinar si España o Argentina tiene más esperanza de vida y descubres la respuesta correcta, ese dato se queda contigo de una forma que nunca lograría una tabla en un libro.
          </p>
          <p>
            Además, cada partida muestra solo cinco datos elegidos al azar entre las veinte categorías que tenemos en la base de datos. Esto significa que dos jugadores que comparen los mismos países pueden vivir experiencias completamente distintas, y que volver a jugar siempre aporta información nueva.
          </p>

          <h2>Las categorías que medimos</h2>
          <p>
            Hemos seleccionado veinte indicadores agrupados en seis grandes categorías que dan una visión equilibrada de cada país:
          </p>

          <h3>Datos básicos</h3>
          <p>Población, superficie, densidad de población. Los fundamentales para entender el tamaño y la concentración humana de un país.</p>

          <h3>Economía</h3>
          <p>PIB total, PIB per cápita, salario medio, índice de coste de vida. Estos indicadores juntos cuentan una historia mucho más rica que mirar solo el PIB.</p>

          <h3>Demografía y salud</h3>
          <p>Esperanza de vida, edad mediana, altura media masculina, tasa de obesidad. Reflejan el estado de bienestar y salud pública de cada país.</p>

          <h3>Sociedad</h3>
          <p>Penetración de internet e índice de educación del PNUD. Indicadores del nivel de desarrollo social.</p>

          <h3>Poder e influencia</h3>
          <p>Gasto militar y tamaño del ejército. Datos relevantes para entender el peso geopolítico de cada país.</p>

          <h3>Cultura y curiosidades</h3>
          <p>Mundiales de fútbol ganados, medallas olímpicas históricas, consumo de alcohol y café per cápita, número de McDonald's. Datos culturales y curiosos que generan conversación.</p>

          <div className="source-box">
            <h4>Fuentes oficiales utilizadas</h4>
            <ul>
              <li>Banco Mundial — datos económicos, demográficos y sociales</li>
              <li>OCDE — salarios e indicadores de bienestar</li>
              <li>OMS — datos de salud pública</li>
              <li>PNUD — Índice de Desarrollo Humano y de Educación</li>
              <li>FIFA — Mundiales de fútbol</li>
              <li>Comité Olímpico Internacional — medallas históricas</li>
              <li>Numbeo — coste de vida e índices urbanos</li>
              <li>UNESCO — datos culturales y educativos</li>
            </ul>
          </div>

          <h2>Compromiso con la calidad</h2>
          <p>
            Nuestro compromiso es mantener los datos lo más actualizados posible y siempre referenciados a fuentes oficiales. Cuando un dato no está disponible o no existe una fuente fiable, simplemente no aparece en la partida. Preferimos mostrar menos datos pero correctos que rellenar con información dudosa.
          </p>
          <p>
            Si detectas un dato que crees que está desactualizado o es incorrecto, puedes <a href="/contacto">escribirnos</a> y lo revisaremos.
          </p>

          <h2>El proyecto</h2>
          <p>
            MundoVs es un proyecto independiente sin ánimo de lucro educativo. Nos financiamos exclusivamente mediante publicidad no intrusiva mostrada al final de cada partida, lo que nos permite mantener la web gratuita y accesible para todo el mundo, sin necesidad de registro.
          </p>
          <p>
            Si te gusta el proyecto, la mejor forma de apoyarlo es <strong>compartirlo</strong> con tus amigos, profesores o estudiantes. Cada partida que se comparte ayuda a que el proyecto siga creciendo.
          </p>

          <div className="cta-box">
            <h3>¿Listo para empezar?</h3>
            <p>Pon a prueba tus conocimientos sobre el mundo en cinco rondas.</p>
            <a href="/">Jugar ahora →</a>
          </div>
        </ContentPage>
      </Layout>
    </>
  );
}
