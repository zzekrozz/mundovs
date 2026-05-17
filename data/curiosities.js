// Datos curiosos verificados organizados por categoría
export const CURIOSITY_DATABASE = {
  economia: [
    "Luxemburgo tiene un PIB per cápita tan alto que un trabajador promedio gana más que dos en España juntos.",
    "Noruega es tan rica en petróleo que tiene un fondo soberano de más de 1 billón de dólares, unos 200.000€ por ciudadano.",
    "Suiza no usa el euro, y su franco es tan estable que lo usan como refugio cuando otras monedas tiemblan.",
    "Mónaco tiene tantos millonarios que 1 de cada 3 residentes es millonario. No es broma.",
    "Qatar tiene tanto gas natural que el gobierno da agua y electricidad gratis a sus ciudadanos.",
  ],
  tecnologia: [
    "Corea del Sur tiene internet tan rápido que se considera básico, como el agua corriente en otros países.",
    "Estonia permite votar online desde 2005. Su gobierno está básicamente en la nube.",
    "En Alemania es más raro encontrar una casa sin internet que una sin calefacción.",
    "Islandia usa tanta energía geotérmica que minar Bitcoin allí es más barato que en casi cualquier otro lugar.",
    "Singapur tiene tantos sensores que puede predecir atascos de tráfico con 15 minutos de antelación.",
  ],
  poblacion: [
    "Monaco es tan pequeño y denso que tiene más habitantes por km² que un estadio de fútbol lleno.",
    "Más de la mitad de la población de Canadá vive más al sur que Seattle (Estados Unidos).",
    "Tokio tiene más habitantes que todo Canadá. Y eso solo contando el área metropolitana.",
    "En Islandia puedes conocer a casi todo el mundo: solo son 370.000 personas, como un estadio grande.",
    "Mongolia es tan despoblada que tiene menos de 2 personas por km². Puedes caminar kilómetros sin ver a nadie.",
  ],
  geografia: [
    "Rusia tiene 11 zonas horarias. Cuando en Moscú desayunan, en Kamchatka ya están cenando.",
    "Australia es tan grande que cabe España 15 veces dentro. Y aún sobra espacio.",
    "Países Bajos tiene un 26% de su territorio bajo el nivel del mar. Literalmente viven en el fondo.",
    "Suiza está tan llena de montañas que tiene más de 7.000 lagos. Y aún hay más vacas que personas.",
    "Chile es tan largo que tiene desiertos al norte, glaciares al sur, y todo un clima mediterráneo en medio.",
  ],
  cultura: [
    "En Japón hay más máquinas expendedoras que habitantes en España. Literalmente una cada 23 personas.",
    "Francia es el país más visitado del mundo con 90 millones de turistas al año. Más que su propia población.",
    "Italia tiene más sitios Patrimonio de la Humanidad que cualquier otro país. 58 en total.",
    "México tiene tantas lenguas indígenas que reconoce 68 oficiales. El español es solo una más.",
    "En Finlandia hay más saunas que coches. Es parte de su identidad cultural.",
  ],
  curiosidades: [
    "En Liechtenstein puedes alquilar el país entero por 70.000$ la noche. Incluye bandera temporal con tu nombre.",
    "Nueva Zelanda tiene más ovejas que personas. Ratio 6:1. Las ovejas ganaron.",
    "Bhután mide la felicidad nacional bruta en vez del PIB. Spoiler: funcionó.",
    "En Islandia no hay apellidos. Te llamas 'hijo de' o 'hija de' tu padre. Ej: Jónsson = hijo de Jón.",
    "Samoa cambió de zona horaria en 2011 saltándose un día entero. El 30 de diciembre simplemente no existió.",
  ],
};

export function getRandomCuriosity(category = null) {
  if (category && CURIOSITY_DATABASE[category]) {
    const list = CURIOSITY_DATABASE[category];
    return list[Math.floor(Math.random() * list.length)];
  }
  
  // Random de todas las categorías
  const allCategories = Object.keys(CURIOSITY_DATABASE);
  const randomCat = allCategories[Math.floor(Math.random() * allCategories.length)];
  return getRandomCuriosity(randomCat);
}

export function getCuriosityByContext(step, countryA, countryB) {
  // Intentar match contextual
  const category = step.group || "curiosidades";
  return getRandomCuriosity(category);
}
