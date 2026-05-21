import Head from "next/head";
import Layout from "../components/Layout";
import ContentPage from "../components/ContentPage";

export default function Metodologia() {
  return (
    <>
      <Head>
        <title>Metodología — Cómo se calculan los datos en MundoVs</title>
        <meta name="description" content="Explicación detallada de las fuentes oficiales, criterios de cálculo y proceso de actualización de los datos de comparación de países en MundoVs." />
      </Head>
      <Layout>
        <ContentPage
          title="Metodología"
          subtitle="Explicamos de dónde sacamos cada dato y cómo lo calculamos."
          lastUpdated="Mayo 2026"
        >
          <p>
            La credibilidad de una herramienta educativa depende enteramente de la fiabilidad de sus datos. En esta página explicamos con detalle cómo seleccionamos cada fuente, cómo procesamos los datos y cómo gestionamos los casos en los que la información no está disponible o es discutida.
          </p>

          <h2>Principios generales</h2>
          <p>
            Trabajamos con tres principios que nos guían en todo momento:
          </p>
          <ol>
            <li><strong>Preferencia por fuentes oficiales</strong> — siempre que existan, usamos datos del Banco Mundial, OCDE, OMS, PNUD o equivalentes nacionales antes que estimaciones de terceros.</li>
            <li><strong>Datos más recientes disponibles</strong> — usamos los últimos datos publicados, aunque suelen tener uno o dos años de retraso porque las estadísticas oficiales se publican con desfase.</li>
            <li><strong>Transparencia total</strong> — si un dato no está disponible o es dudoso, lo marcamos como no disponible en lugar de inventar.</li>
          </ol>

          <h2>Categorías y fuentes</h2>

          <h3>Población y superficie</h3>
          <p>
            Los datos de población provienen del Banco Mundial, que a su vez consolida las estimaciones de las oficinas estadísticas nacionales. La superficie territorial usa los valores oficiales registrados por la División de Estadística de las Naciones Unidas, e incluye tanto tierra firme como aguas interiores.
          </p>
          <p>
            La densidad de población se calcula directamente dividiendo la población total entre la superficie en kilómetros cuadrados.
          </p>

          <h3>Indicadores económicos</h3>
          <p>
            El <strong>PIB total</strong> y el <strong>PIB per cápita</strong> se toman del Banco Mundial, expresados en dólares estadounidenses corrientes. Esto significa que reflejan los tipos de cambio actuales y no están ajustados por paridad de poder adquisitivo (PPA).
          </p>
          <p>
            El <strong>salario medio</strong> es el valor más complicado de unificar entre países, ya que cada estadística nacional lo calcula de forma distinta. Para los países OCDE usamos el dato oficial de salario medio bruto anual. Para el resto, usamos las estimaciones del Banco Mundial o, en su defecto, datos del Servicio Estadístico de la UE para los países europeos.
          </p>
          <p>
            El <strong>índice de coste de vida</strong> proviene de Numbeo, una de las bases de datos más completas del mundo en este ámbito. Se utiliza una escala donde Nueva York equivale a 100, lo que permite comparar de forma rápida entre países.
          </p>

          <h3>Salud y demografía</h3>
          <p>
            La <strong>esperanza de vida al nacer</strong> y la <strong>edad mediana</strong> provienen de la Organización Mundial de la Salud y del Departamento de Asuntos Económicos y Sociales de Naciones Unidas. Son datos que se actualizan anualmente y siguen metodologías estandarizadas internacionalmente.
          </p>
          <p>
            La <strong>altura media masculina</strong> proviene del estudio NCD Risk Factor Collaboration publicado en la revista eLife, que recopila datos de millones de personas en más de 200 países. Es la fuente más fiable para este indicador.
          </p>
          <p>
            La <strong>tasa de obesidad</strong> se basa en los datos de la OMS según la definición estándar de IMC superior a 30, en población adulta.
          </p>

          <h3>Educación y sociedad</h3>
          <p>
            El <strong>porcentaje de usuarios de internet</strong> proviene del Banco Mundial. El <strong>índice de educación</strong> es un componente del Índice de Desarrollo Humano del Programa de Naciones Unidas para el Desarrollo (PNUD), que combina años esperados de escolarización con años promedio efectivamente cursados por la población adulta.
          </p>

          <h3>Indicadores militares</h3>
          <p>
            El <strong>gasto militar</strong> proviene del Stockholm International Peace Research Institute (SIPRI), considerado la referencia mundial. El <strong>tamaño del ejército</strong> incluye únicamente personal activo en servicio, sin contar reservistas ni paramilitares, según los datos de The Military Balance del IISS.
          </p>

          <h3>Cultura y deporte</h3>
          <p>
            Los <strong>Mundiales de fútbol</strong> reflejan únicamente los títulos masculinos de la Copa del Mundo de la FIFA. Las <strong>medallas olímpicas</strong> son el total histórico acumulado de Juegos Olímpicos de verano e invierno, según los registros del Comité Olímpico Internacional.
          </p>

          <h3>Datos culturales y curiosos</h3>
          <p>
            El <strong>consumo de alcohol per cápita</strong> proviene de la OMS y se mide en litros de alcohol puro por persona adulta y año. El <strong>consumo de café</strong> usa datos de la International Coffee Organization, expresado en kilogramos por habitante y año.
          </p>
          <p>
            El <strong>número de McDonald's por país</strong> se basa en los listados oficiales de la propia compañía y de fuentes recopiladas en Wikipedia. Estos datos son de los más volátiles, ya que la red de restaurantes cambia constantemente.
          </p>

          <h2>Cómo gestionamos los datos no disponibles</h2>
          <p>
            En algunos países, ciertos datos simplemente no están disponibles de forma fiable. Algunos ejemplos comunes son:
          </p>
          <ul>
            <li><strong>Cuba y Venezuela</strong> — los datos económicos oficiales están sujetos a cuestionamiento por organismos internacionales debido a la situación política y de registro estadístico.</li>
            <li><strong>Países en conflicto</strong> — durante guerras, las estadísticas oficiales pueden estar interrumpidas o no publicarse.</li>
            <li><strong>Países muy pequeños</strong> — algunos indicadores no se calculan porque la muestra estadística sería demasiado reducida.</li>
          </ul>
          <p>
            Cuando esto ocurre, en MundoVs <strong>no rellenamos con estimaciones inventadas</strong>. Simplemente, esa categoría no aparece en partidas que involucren a ese país. Preferimos jugar con menos datos pero correctos.
          </p>

          <h2>Frecuencia de actualización</h2>
          <p>
            Los datos se revisan al menos una vez al año, normalmente entre marzo y mayo, cuando el Banco Mundial publica sus actualizaciones anuales. Algunos datos como las medallas olímpicas se actualizan después de cada Juego Olímpico, y los Mundiales de fútbol después de cada edición.
          </p>

          <h2>Limitaciones que reconocemos</h2>
          <p>
            Es importante ser honestos con las limitaciones de cualquier comparación entre países:
          </p>
          <ul>
            <li>Los <strong>promedios nacionales esconden enormes desigualdades internas</strong>. España tiene un PIB per cápita determinado, pero hay diferencias gigantes entre comunidades autónomas.</li>
            <li>Los datos económicos en dólares corrientes <strong>no reflejan la capacidad real de compra</strong> en cada país. Un salario de 30.000$ no compra lo mismo en Madrid que en Bogotá.</li>
            <li>Algunos datos como la altura media o la obesidad <strong>varían enormemente por edad y región</strong> dentro del mismo país.</li>
            <li>El <strong>tamaño del ejército</strong> no equivale necesariamente a capacidad militar real.</li>
          </ul>
          <p>
            Por eso, MundoVs es una herramienta para descubrir y aprender, no para sacar conclusiones definitivas sobre la "superioridad" de un país sobre otro. Los países son realidades complejas que no caben en cinco números.
          </p>

          <h2>Sugerencias y correcciones</h2>
          <p>
            Si detectas un dato incorrecto, desactualizado o que crees que merecería una fuente mejor, puedes <a href="/contacto">contactarnos</a>. Revisamos todas las sugerencias y, si están bien fundamentadas, actualizamos la base de datos en la siguiente revisión.
          </p>
        </ContentPage>
      </Layout>
    </>
  );
}
