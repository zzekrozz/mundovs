import BlogPost from "../../components/BlogPost";

export default function Post() {
  return (
    <BlogPost
      slug="como-se-mide-pib-per-capita"
      title="Cómo se mide el PIB per cápita y por qué a veces engaña"
      description="Es el indicador más usado para hablar de la riqueza de un país, pero sus limitaciones son enormes. Desigualdad, PPA y economía sumergida cambian la imagen."
      date="2026-03-22"
      readTime={7}
    >
<p>
            El PIB per cápita es probablemente el dato económico más citado en los medios de comunicación. Aparece en titulares de prensa, en discursos políticos, en rankings internacionales. Pero ¿qué mide exactamente? Y, más importante: ¿qué deja fuera? En este artículo desgranamos qué es, cómo se calcula y por qué entender sus limitaciones es fundamental para no sacar conclusiones erróneas.
          </p>

          <h2>Qué es el PIB</h2>
          <p>
            Antes de hablar del PIB per cápita, conviene tener claro qué es el PIB. El Producto Interior Bruto es el <strong>valor monetario total de todos los bienes y servicios finales producidos dentro de las fronteras de un país durante un periodo</strong>, normalmente un año.
          </p>
          <p>
            La palabra clave es "finales". Si una empresa produce harina y otra la usa para hacer pan, en el PIB solo se cuenta el valor del pan (el producto final), no el de la harina, para evitar la doble contabilidad. La idea es medir el valor económico añadido total que genera un país en un periodo concreto.
          </p>
          <p>
            El PIB se puede calcular de tres formas matemáticamente equivalentes:
          </p>
          <ul>
            <li><strong>Por gastos:</strong> sumando consumo + inversión + gasto público + exportaciones netas.</li>
            <li><strong>Por rentas:</strong> sumando salarios + beneficios + rentas + impuestos a la producción.</li>
            <li><strong>Por producción:</strong> sumando el valor añadido de cada sector económico.</li>
          </ul>

          <h2>Y el PIB per cápita</h2>
          <p>
            El PIB per cápita es simplemente el PIB total dividido entre la población del país. Si España produce un PIB de 1,6 billones de dólares y tiene 48 millones de habitantes, el PIB per cápita es aproximadamente 33.700 dólares por persona.
          </p>
          <p>
            Esto da una idea aproximada de cuánto valor económico le "tocaría" a cada habitante si la riqueza se repartiera por igual. Es importante destacar el <strong>"si"</strong>: en la realidad, la riqueza nunca se reparte por igual, y eso es precisamente una de las grandes limitaciones del indicador.
          </p>

          <h2>Las cinco grandes limitaciones</h2>

          <h3>1. No mide la desigualdad</h3>
          <p>
            Imagina dos países hipotéticos:
          </p>
          <ul>
            <li><strong>País A:</strong> 10 personas con ingresos de 25.000 € cada una. PIB per cápita = 25.000 €.</li>
            <li><strong>País B:</strong> 9 personas con 5.000 € y 1 persona con 205.000 €. PIB per cápita = 25.000 €.</li>
          </ul>
          <p>
            Ambos países tienen el mismo PIB per cápita, pero la realidad de sus habitantes es radicalmente distinta. Un PIB per cápita alto puede coexistir con grandes bolsas de pobreza si la desigualdad es alta.
          </p>
          <p>
            Por eso muchos economistas recomiendan acompañar el PIB per cápita con el coeficiente de Gini (que mide la desigualdad) o con la mediana de ingresos en lugar de la media.
          </p>

          <h3>2. No considera el coste de vida</h3>
          <p>
            Comparar PIB per cápita en dólares corrientes ignora que vivir cuesta cosas distintas en lugares distintos. Un sueldo de 30.000 dólares en Madrid no compra lo mismo que uno de 30.000 dólares en Ciudad de México.
          </p>
          <p>
            Para corregir esto, los economistas han desarrollado el PIB per cápita ajustado por <strong>paridad de poder adquisitivo (PPA)</strong>. Este ajuste hace que las comparaciones sean más realistas en términos de capacidad de compra real, y suele acercar los países en desarrollo a los desarrollados.
          </p>

          <h3>3. No mide la economía sumergida</h3>
          <p>
            En la mayoría de países hay actividad económica que no aparece en las estadísticas oficiales: trabajos no declarados, intercambios sin facturar, mercado negro. Esto se conoce como <strong>economía sumergida</strong>, y su tamaño varía enormemente entre países.
          </p>
          <p>
            En países nórdicos puede ser del 10% del PIB oficial. En algunos países de Latinoamérica o el sur de Europa puede superar el 25%. Esto significa que el PIB real (la actividad económica realmente existente) es mayor que el oficial, pero la diferencia no es uniforme entre países, lo que complica las comparaciones.
          </p>

          <h3>4. No mide el bienestar</h3>
          <p>
            Tener más PIB no equivale a vivir mejor. Hay actividades que aumentan el PIB pero no necesariamente el bienestar:
          </p>
          <ul>
            <li>Reparar daños tras desastres naturales aumenta el PIB.</li>
            <li>Más medicamentos por enfermedades prevenibles aumenta el PIB.</li>
            <li>Atascos largos que requieren más gasolina aumentan el PIB.</li>
          </ul>
          <p>
            Por otro lado, hay cosas que aportan bienestar pero no aparecen en el PIB: el trabajo doméstico no remunerado, el voluntariado, los servicios prestados por familiares, el tiempo de ocio en sí mismo.
          </p>
          <p>
            Por eso indicadores como el <strong>Índice de Desarrollo Humano</strong> del PNUD intentan complementar el PIB per cápita con educación y esperanza de vida, dando una imagen más rica del nivel de vida.
          </p>

          <h3>5. No considera el medio ambiente</h3>
          <p>
            Un país puede tener un PIB per cápita altísimo basado en explotar recursos naturales no renovables (petróleo, gas, minerales). Esto genera riqueza ahora, pero compromete el futuro. El PIB tradicional no resta el "coste" de degradar el medio ambiente.
          </p>
          <p>
            Por esta razón, la <strong>contabilidad económica ambiental</strong> está ganando terreno: ajusta el PIB por el agotamiento de recursos naturales y los costes de la contaminación. Algunos países como Noruega o Costa Rica ya publican estos cálculos paralelos.
          </p>

          <h2>Cuándo el PIB per cápita es útil</h2>
          <p>
            A pesar de sus limitaciones, el PIB per cápita sigue siendo útil cuando:
          </p>
          <ul>
            <li>Se compara la <strong>evolución de un mismo país a lo largo del tiempo</strong> (siempre que no haya inflación galopante o crisis monetarias).</li>
            <li>Se complementa con otros indicadores como Gini, IDH o esperanza de vida.</li>
            <li>Se usa con la advertencia explícita de que es solo una aproximación.</li>
          </ul>

          <h2>Indicadores alternativos a tener en cuenta</h2>
          <p>
            Si quieres tener una imagen más completa del bienestar de un país, complementa el PIB per cápita con:
          </p>
          <ul>
            <li><strong>Índice de Desarrollo Humano (IDH):</strong> combina PIB, educación y salud.</li>
            <li><strong>Índice Gini:</strong> mide la desigualdad de ingresos.</li>
            <li><strong>Mediana de ingresos:</strong> ingreso del hogar "del medio".</li>
            <li><strong>Better Life Index de la OCDE:</strong> 11 dimensiones de bienestar.</li>
            <li><strong>Índice de Felicidad Mundial:</strong> encuestas de satisfacción vital.</li>
            <li><strong>Esperanza de vida en buena salud:</strong> no solo años, sino años saludables.</li>
          </ul>

          <h2>Conclusión</h2>
          <p>
            El PIB per cápita es como el termómetro de un médico: muy útil, pero insuficiente por sí solo. Sirve para diagnósticos rápidos y comparaciones generales, pero no captura la complejidad del bienestar humano.
          </p>
          <p>
            La próxima vez que veas un titular del estilo "España es X veces más rica que Y", pregúntate: ¿qué pasa con la desigualdad?, ¿con el coste de vida?, ¿con la economía sumergida?, ¿con la calidad de vida real? La realidad casi siempre es más rica de lo que cabe en una sola cifra.
          </p>

          <div className="cta-box">
            <h3>Pon a prueba tus conocimientos</h3>
            <p>Compara el PIB per cápita y otras 19 categorías entre países.</p>
            <a href="/">Empezar partida →</a>
          </div>

          <p style={{ marginTop: "2rem", padding: "1rem", background: "var(--mv-card)", borderRadius: 8, fontSize: 13, color: "var(--mv-text-dim)" }}>
            <strong>Fuentes:</strong> Banco Mundial, OCDE, PNUD, Sistema de Cuentas Nacionales de las Naciones Unidas.
          </p>
    </BlogPost>
  );
}
