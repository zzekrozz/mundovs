// Sistema de curiosidades CONTEXTUALES
// Genera curiosidades basadas en la pregunta y los países que juegan

function fmtNum(n) {
  if (n === null || n === undefined) return "—";
  if (n >= 1e12) return (n / 1e12).toFixed(1).replace(".0", "") + " billones";
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(".0", "") + " mil millones";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + " millones";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + " mil";
  return n.toLocaleString("es-ES");
}

function fmtRatio(a, b) {
  if (!a || !b || b === 0) return null;
  const ratio = a / b;
  if (ratio >= 10) return `${Math.round(ratio)} veces más`;
  if (ratio >= 2) return `${ratio.toFixed(1).replace(".0", "")} veces más`;
  if (ratio >= 1.2) return `un ${Math.round((ratio - 1) * 100)}% más`;
  return null;
}

function fmtPercent(n) {
  if (n === null || n === undefined) return "—";
  return n.toFixed(1).replace(".0", "") + "%";
}

// ── Generadores por tipo de pregunta ──

function curiosityPopulation(w, l) {
  const r = fmtRatio(w.population, l.population);
  if (r) return `${w.name} tiene ${r} habitantes que ${l.name}: ${fmtNum(w.population)} frente a ${fmtNum(l.population)}.`;
  return `${w.name} tiene ${fmtNum(w.population)} habitantes, algo más que ${l.name} (${fmtNum(l.population)}).`;
}

function curiosityArea(w, l) {
  const r = fmtRatio(w.area, l.area);
  if (r) return `${w.name} es ${r} grande que ${l.name}: ${fmtNum(w.area)} km² frente a ${fmtNum(l.area)} km².`;
  return `${w.name} ocupa ${fmtNum(w.area)} km², superando a ${l.name}.`;
}

function curiosityGDP(w, l) {
  const r = fmtRatio(w.gdp, l.gdp);
  if (r) return `La economía de ${w.name} es ${r} grande que la de ${l.name}. Su PIB alcanza los ${fmtNum(w.gdp)} de dólares.`;
  return `${w.name} tiene un PIB de ${fmtNum(w.gdp)}$, superior al de ${l.name}.`;
}

function curiosityGDPperCapita(w, l) {
  const r = fmtRatio(w.gdp_per_capita, l.gdp_per_capita);
  if (r) return `Un ciudadano medio de ${w.name} gana ${r} que uno de ${l.name}: ${fmtNum(w.gdp_per_capita)}$ frente a ${fmtNum(l.gdp_per_capita)}$ al año.`;
  return `La renta per cápita de ${w.name} (${fmtNum(w.gdp_per_capita)}$) supera a la de ${l.name}.`;
}

function curiosityInternet(w, l) {
  const diff = w.internet_users - l.internet_users;
  if (diff > 30) return `En ${w.name}, ${fmtPercent(w.internet_users)} de la población usa internet. En ${l.name} solo el ${fmtPercent(l.internet_users)}. Una brecha digital enorme.`;
  if (diff > 10) return `${w.name} tiene mayor penetración digital: ${fmtPercent(w.internet_users)} frente al ${fmtPercent(l.internet_users)} de ${l.name}.`;
  return `${w.name} (${fmtPercent(w.internet_users)}) supera por poco a ${l.name} (${fmtPercent(l.internet_users)}) en uso de internet.`;
}

function curiosityOlympic(w, l) {
  if (l.olympic_medals === 0 && w.olympic_medals > 0) {
    return `${w.name} ha ganado ${fmtNum(w.olympic_medals)} medallas olímpicas en su historia. ${l.name} aún no tiene ninguna.`;
  }
  const r = fmtRatio(w.olympic_medals, l.olympic_medals);
  if (r) return `${w.name} acumula ${r} medallas olímpicas que ${l.name}: ${fmtNum(w.olympic_medals)} frente a ${fmtNum(l.olympic_medals)}.`;
  return `${w.name} suma ${fmtNum(w.olympic_medals)} medallas olímpicas, ligeramente más que ${l.name}.`;
}

function curiosityWorldCups(w, l) {
  if (w.fifa_world_cups > 0 && l.fifa_world_cups === 0) {
    return `${w.name} ha levantado ${w.fifa_world_cups} Mundial${w.fifa_world_cups > 1 ? "es" : ""} de fútbol. ${l.name} aún sueña con su primero.`;
  }
  if (w.fifa_world_cups === 0 && l.fifa_world_cups === 0) {
    return `Ni ${w.name} ni ${l.name} han ganado nunca un Mundial de fútbol.`;
  }
  return `${w.name} ha ganado ${w.fifa_world_cups} Mundiales de fútbol, frente a los ${l.fifa_world_cups} de ${l.name}.`;
}

function curiosityMilitary(w, l) {
  const r = fmtRatio(w.military_budget, l.military_budget);
  if (r) return `${w.name} gasta ${r} en defensa que ${l.name}: ${fmtNum(w.military_budget)}$ anuales.`;
  return `El presupuesto militar de ${w.name} (${fmtNum(w.military_budget)}$) supera al de ${l.name}.`;
}

function curiosityTourism(w, l) {
  const r = fmtRatio(w.tourists, l.tourists);
  if (r) return `${w.name} recibe ${r} turistas que ${l.name}: ${fmtNum(w.tourists)} visitantes al año.`;
  return `${w.name} recibe ${fmtNum(w.tourists)} turistas anuales, más que ${l.name}.`;
}

function curiosityCO2(w, l) {
  return `${w.name} emite ${fmtNum(w.co2_emissions)} toneladas de CO₂ al año, frente a las ${fmtNum(l.co2_emissions)} de ${l.name}.`;
}

function curiosityForest(w, l) {
  return `El ${fmtPercent(w.forest_area)} del territorio de ${w.name} es bosque. En ${l.name} solo lo es el ${fmtPercent(l.forest_area)}.`;
}

function curiosityUrban(w, l) {
  return `En ${w.name}, el ${fmtPercent(w.urban_population)} vive en ciudades. En ${l.name}, el ${fmtPercent(l.urban_population)}.`;
}

function curiosityNobel(w, l) {
  if (l.nobel_prizes === 0 && w.nobel_prizes > 0) {
    return `${w.name} acumula ${fmtNum(w.nobel_prizes)} Premios Nobel. ${l.name} aún espera el primero.`;
  }
  return `${w.name} tiene ${fmtNum(w.nobel_prizes)} Premios Nobel, frente a los ${fmtNum(l.nobel_prizes)} de ${l.name}.`;
}

// ── Mapping ──
const GENERATORS = {
  population: curiosityPopulation,
  area: curiosityArea,
  gdp: curiosityGDP,
  gdp_per_capita: curiosityGDPperCapita,
  internet_users: curiosityInternet,
  olympic_medals: curiosityOlympic,
  fifa_world_cups: curiosityWorldCups,
  military_budget: curiosityMilitary,
  tourists: curiosityTourism,
  co2_emissions: curiosityCO2,
  forest_area: curiosityForest,
  urban_population: curiosityUrban,
  nobel_prizes: curiosityNobel,
};

export function getCuriosityByContext(step, cA, cB) {
  if (!step || !cA || !cB) return "";
  const valA = cA[step.key];
  const valB = cB[step.key];
  if (valA == null || valB == null) return fallback(cA, cB);
  const winner = valA >= valB ? cA : cB;
  const loser = valA >= valB ? cB : cA;
  const gen = GENERATORS[step.key];
  if (gen) { try { return gen(winner, loser); } catch(e) {} }
  return fallback(cA, cB);
}

function fallback(cA, cB) {
  if (cA.continent === cB.continent) {
    return `${cA.name} y ${cB.name} están ambos en ${cA.continent}, pero tienen realidades muy distintas.`;
  }
  return `${cA.name} (${cA.continent}) y ${cB.name} (${cB.continent}) muestran cómo el mundo es enormemente diverso.`;
}

export function getRandomCuriosity() {
  return "Cada país tiene su propia historia única.";
}
