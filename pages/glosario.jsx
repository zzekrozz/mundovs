import Head from "next/head";
import Layout from "../components/Layout";
import ContentPage from "../components/ContentPage";

export default function Glosario() {
  return (
    <>
      <Head>
        <title>Glosario de términos — Aprende geografía y datos del mundo | MundoVs</title>
        <meta name="description" content="Glosario educativo con la definición de PIB per cápita, esperanza de vida, índice de desarrollo humano y otros 17 indicadores que usamos para comparar países." />
      </Head>
      <Layout>
        <ContentPage
          title="Glosario de términos"
          subtitle="Definiciones claras de los 20 indicadores que usamos para comparar países."
        >
          <p>
            Para sacar el máximo partido a una herramienta de comparación, conviene entender bien qué significa cada dato. Aquí explicamos en lenguaje sencillo los veinte indicadores que aparecen en MundoVs, qué nos dicen y qué no nos dicen.
          </p>

          <h2>Datos básicos</h2>

          <h3>Población</h3>
          <p>
            El número total de personas que residen habitualmente en el territorio de un país. Incluye tanto a ciudadanos como a residentes extranjeros, y se mide a una fecha concreta (normalmente 1 de enero o 1 de julio del año en cuestión).
          </p>
          <blockquote>
            La población de China supera los 1.400 millones, mientras que la de Mónaco no llega a 40.000. Esta enorme diferencia de escala es lo que hace que muchas comparaciones internacionales necesiten convertirse a "per cápita" para tener sentido.
          </blockquote>

          <h3>Superficie</h3>
          <p>
            La extensión territorial total de un país medida en kilómetros cuadrados. Incluye tanto la tierra firme como aguas interiores como ríos y lagos, pero generalmente excluye las aguas territoriales marinas.
          </p>

          <h3>Densidad de población</h3>
          <p>
            El número de habitantes por kilómetro cuadrado. Se calcula dividiendo la población entre la superficie. Es un indicador interesante porque revela cómo de "lleno" está un país: Bangladesh tiene una densidad altísima mientras que Mongolia tiene de las más bajas del mundo.
          </p>

          <h2>Indicadores económicos</h2>

          <h3>PIB total</h3>
          <p>
            El Producto Interior Bruto es el valor total de todos los bienes y servicios producidos en un país durante un año. Es la medida más utilizada del tamaño de la economía de un país.
          </p>
          <p>
            Cuando hablamos de PIB total nos referimos al valor absoluto: Estados Unidos tiene el PIB más grande del mundo, seguido de China. Pero esto no significa que sus habitantes sean los más ricos individualmente.
          </p>

          <h3>PIB per cápita</h3>
          <p>
            El PIB total dividido entre la población del país. Da una idea aproximada de la riqueza media por habitante. Países pequeños y ricos como Luxemburgo, Irlanda o Suiza encabezan estas listas, mientras que los gigantes económicos como China e India tienen un PIB per cápita modesto debido a su enorme población.
          </p>
          <p>
            Es importante recordar que el PIB per cápita es una <strong>media aritmética</strong>: no refleja desigualdades. Un país con un PIB per cápita alto puede tener mucha pobreza si la riqueza está muy concentrada.
          </p>

          <h3>Salario medio</h3>
          <p>
            El salario bruto promedio anual de los trabajadores asalariados. A diferencia del PIB per cápita, este dato refleja específicamente lo que cobran las personas que trabajan por cuenta ajena. Suele ser un indicador más cercano a la experiencia real de las familias que el PIB per cápita.
          </p>

          <h3>Índice de coste de vida</h3>
          <p>
            Un índice que compara cuánto cuesta vivir en un país respecto a una referencia. Usamos la escala de Numbeo donde Nueva York equivale a 100. Si un país tiene un índice de 50, significa que vivir allí cuesta aproximadamente la mitad que en Nueva York.
          </p>
          <p>
            Combinar salario medio con coste de vida da una imagen más realista del bienestar económico. Un salario de 25.000 euros en un país barato puede equivaler a uno de 50.000 en uno caro.
          </p>

          <h2>Salud y demografía</h2>

          <h3>Esperanza de vida al nacer</h3>
          <p>
            Es el número promedio de años que se espera que viva una persona nacida hoy si las condiciones de mortalidad actuales se mantuvieran toda su vida. Es uno de los indicadores más potentes del estado de la salud pública y el desarrollo de un país.
          </p>
          <p>
            Japón, Suiza y Singapur lideran las listas mundiales con esperanzas superiores a los 84 años, mientras que algunos países en África subsahariana siguen por debajo de los 60.
          </p>

          <h3>Edad mediana</h3>
          <p>
            La edad que divide a la población en dos mitades iguales: la mitad de las personas son más jóvenes y la otra mitad más mayores. Refleja el envejecimiento de la población.
          </p>
          <p>
            Italia y Japón tienen las edades medianas más altas del mundo (alrededor de 49 años), mientras que muchos países africanos y latinoamericanos tienen edades medianas por debajo de 25.
          </p>

          <h3>Altura media masculina</h3>
          <p>
            La estatura promedio de los hombres adultos del país. Es un indicador interesante porque combina factores genéticos, nutricionales y de salud durante la infancia y adolescencia.
          </p>
          <p>
            Los países nórdicos y los Países Bajos lideran las listas mundiales con medias superiores a 180 cm, mientras que en algunas regiones de Asia y Latinoamérica la media está más cerca de los 165 cm.
          </p>

          <h3>Tasa de obesidad</h3>
          <p>
            El porcentaje de la población adulta con un Índice de Masa Corporal (IMC) superior a 30. Es un indicador de salud pública que ha crecido significativamente en muchos países durante las últimas décadas.
          </p>

          <h2>Educación y sociedad</h2>

          <h3>Usuarios de internet</h3>
          <p>
            El porcentaje de población que ha usado internet en los últimos tres meses. Es un indicador del nivel de penetración digital. En países como Noruega, Dinamarca o Corea del Sur supera el 97%, mientras que en algunos países en desarrollo todavía está por debajo del 50%.
          </p>

          <h3>Índice de educación</h3>
          <p>
            Un componente del Índice de Desarrollo Humano del PNUD que combina dos elementos: los años esperados de escolarización para un niño que entra al sistema educativo, y los años promedio de escolarización efectivamente cursados por la población adulta. El valor va de 0 a 1, donde 1 sería el máximo teórico.
          </p>

          <h2>Indicadores de poder e influencia</h2>

          <h3>Gasto militar</h3>
          <p>
            La cantidad total que un país invierte anualmente en defensa, incluyendo personal, equipamiento, mantenimiento, investigación y operaciones. Estados Unidos lidera con diferencia (más de 900 mil millones de dólares al año), seguido por China y, en muchos años recientes, Ucrania debido a la guerra.
          </p>

          <h3>Tamaño del ejército</h3>
          <p>
            El número de soldados en servicio activo. No incluye reservistas, paramilitares ni fuerzas de seguridad. China e India tienen los ejércitos activos más grandes del mundo, ambos superando los 1,4 millones de efectivos.
          </p>

          <h2>Cultura y deporte</h2>

          <h3>Mundiales de fútbol</h3>
          <p>
            El número de Copas del Mundo masculinas de la FIFA ganadas históricamente. Solo ocho países han ganado alguna vez: Brasil (5), Alemania e Italia (4 cada uno), Argentina (3), Francia y Uruguay (2), e Inglaterra y España (1 cada uno).
          </p>

          <h3>Medallas olímpicas</h3>
          <p>
            El total histórico de medallas (oro, plata y bronce) ganadas en Juegos Olímpicos de verano e invierno desde la primera edición moderna en 1896. Estados Unidos lidera con casi 3.000 medallas, seguido por la antigua Unión Soviética y Rusia.
          </p>

          <h2>Datos culturales</h2>

          <h3>Consumo de alcohol</h3>
          <p>
            La cantidad de alcohol puro consumido por persona adulta al año, medida en litros. La OMS lo calcula sumando todos los tipos de bebidas alcohólicas convertidas a litros equivalentes de alcohol puro. Los países de Europa del Este y los nórdicos suelen liderar las listas, mientras que países de mayoría musulmana tienen consumos muy bajos.
          </p>

          <h3>Consumo de café</h3>
          <p>
            La cantidad de café consumido por habitante al año, en kilogramos. Sorprendentemente, los líderes mundiales no son los grandes productores como Brasil o Colombia, sino los países nórdicos: Finlandia es el mayor consumidor de café del mundo per cápita, con más de 12 kg por persona al año.
          </p>

          <h3>Número de McDonald's</h3>
          <p>
            El número de restaurantes McDonald's en cada país. Aunque puede parecer un dato anecdótico, en realidad es un indicador interesante de globalización, urbanización y poder adquisitivo medio. Estados Unidos tiene más de 13.000, mientras que algunos países no tienen ninguno por motivos políticos, económicos o culturales.
          </p>

          <div className="cta-box">
            <h3>¿Listo para poner a prueba lo que has aprendido?</h3>
            <p>Compara dos países en cinco categorías sorpresa.</p>
            <a href="/">Empezar partida →</a>
          </div>
        </ContentPage>
      </Layout>
    </>
  );
}
