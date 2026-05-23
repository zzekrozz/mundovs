# 📚 Guía: Cómo añadir nuevas categorías a MundoVS

## 📋 Estructura actual

**Archivos principales:**
- `data/countries.json` → 47 países con ~24 campos cada uno
- `data/categories.js` → 23 categorías con lógica de comparación
- `data/categories_metadata.json.js` → Metadata detallada de categorías (fuentes, confianza, notas)
- `data/category_values.json.js` → Valores granulares de cada país por categoría (con año, fuente, confianza)

**Cómo funciona el juego:**
1. Elige 2 países aleatorios
2. Elige una categoría aleatoria disponible (ambos países deben tener el valor)
3. Compara valores usando `getWinner(cA, cB, category)`
4. `category.dir === "higher"` significa "gana el mayor valor", `"lower"` significa "gana el menor"
5. Muestra resultado usando `category.format()` y `category.phrase()`

## ✅ Proceso para añadir una nueva categoría

### Paso 1: Recopilar datos
Busca datos verificados para los 47 países:

**Países siempre presentes:**
```
ES, PT, FR, DE, IT, GB, NL, BE, CH, AT, SE, NO, DK, FI, IE, PL, GR, RO, HU, CZ, RU, UA, TR, IL, SA, AE, 
BR, AR, CL, CO, PE, VE, EC, BO, UY, CR, PA, GT, CU, DO, US, CA, CN, JP, KR, IN, AU, ZA, EG, MA
```

Usa fuentes confiables (World Bank, OECD, FAO, UN, etc.)

### Paso 2: Actualizar `countries.json`
Añade el campo al objeto de cada país:
```json
{
  "ES": {
    "name": "España",
    ...existentes campos...,
    "nuevo_campo": 123.45  // ← NUEVO
  }
}
```

**Regla:** Si no tienes datos verificados, usa `null` (no inventes).

### Paso 3: Actualizar `categories_metadata.json.js`
Añade la definición en la sección `nuevas`:
```javascript
nuevo_campo: {
  id: "nuevo_campo",
  key: "nuevo_campo",  // Debe coincidir con el nombre en countries.json
  label: "Nombre corto",
  group: "categoria",  // basicos, economia, humanos, sociedad, poder, cultura, geografia
  question: "¿Pregunta para el usuario?",
  comparison: "higher_wins" | "lower_wins",
  unit: "unidad",
  sourceMain: "Fuente principal",
  sourceSecondary: "Fuente secundaria (opcional)",
  difficulty: "easy" | "medium" | "hard",
  confidence: "high" | "medium" | "low",
  recommendation: "use_now" | "phase2" | "review_needed",
  funScore: 8,  // 1-10
  clarityScore: 9,  // 1-10
  stalenessRisk: "low" | "medium" | "high",
  refreshCadenceDays: 365,
  notes: "Cualquier nota importante...",
}
```

### Paso 4: Actualizar `category_values.json.js`
Añade los valores granulares:
```javascript
nuevo_campo: {
  ES: { value: 123.45, year: 2024, source: "Fuente", confidence: "high", notes: null, nullReason: null },
  PT: { value: 111.22, year: 2024, source: "Fuente", confidence: "high", notes: null, nullReason: null },
  ...otros países...
  // Si NO tienes dato:
  VE: { value: null, year: null, source: null, confidence: null, notes: null, nullReason: "Razón por la que falta" },
}
```

### Paso 5: Añadir a `categories.js`
Añade la categoría al array `CATEGORIES`:
```javascript
{
  key: "nuevo_campo",  // Debe coincidir exactamente con countries.json
  label: "Nombre corto para UI",
  group: "categoria",  // Grupos visuales
  question: "¿Pregunta clara?",
  gradient: "linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%)",
  backgrounds: ["/illustrations/icono.svg"],  // URLs de fondos SVG
  format: (v) => "Valor formateado: " + v,   // Cómo mostrar el número
  phrase: (a, b) => "Frase viral comparativa",
  dir: "higher" | "lower",  // Quién gana
}
```

### Paso 6: Testing
Verifica que:
1. El juego no se rompe
2. La categoría aparece en el juego
3. Se calcula el ganador correctamente
4. Se muestran los datos correctamente

```bash
# Validar sintaxis
node -e "const cats = require('./data/categories.js'); console.log(cats.CATEGORIES.length, 'categorías')"
```

## 🎯 Decisiones de diseño

### Cuándo usar `higher_wins` vs `lower_wins`
- `higher_wins`: PIB, población, educación, esperanza de vida, robustez → "MÁS es MEJOR"
- `lower_wins`: homicidios, corrupción (en algunos casos), coste de vida → "MENOS es MEJOR"

**Nota:** Corrupción es confuso. En CPI de TI, "puntuación más alta = MENOS corrupción", así que usa `higher_wins`.

### Reglas para `group`
```
basicos → población, área, densidad
economia → PIB, salario, coste de vida
humanos → edad, altura, esperanza de vida, obesidad
sociedad → internet, educación, corrupción
poder → gasto militar, tamaño ejército
cultura → deporte, comida, bebida, McDonald's
geografia → lluvia, bosques, costa, islas
```

## 📊 Ejemplo completo: Suelo una nueva categoría

**Metadatos (`categories_metadata.json.js`):**
```javascript
billionaires_total: {
  id: "billionaires_total",
  key: "billionaires_total",
  label: "Multimillonarios",
  group: "poder",
  question: "¿Qué país tiene más multimillonarios?",
  comparison: "higher_wins",
  unit: "billionarios",
  sourceMain: "Forbes Billionaires List 2024",
  difficulty: "medium",
  confidence: "high",
  recommendation: "use_now",
  funScore: 9,
  clarityScore: 10,
  stalenessRisk: "medium",
  refreshCadenceDays: 365,
  notes: "Dato anual que cambia. Año 2024.",
}
```

**Valores (`category_values.json.js`):**
```javascript
billionaires_total: {
  US: { value: 813, year: 2024, source: "Forbes", confidence: "high", notes: null, nullReason: null },
  CN: { value: 415, year: 2024, source: "Forbes", confidence: "high", notes: null, nullReason: null },
  IN: { value: 200, year: 2024, source: "Forbes", confidence: "high", notes: null, nullReason: null },
  ...resto de países...
}
```

**Campos en countries.json:**
```json
{
  "US": { ..., "billionaires_total": 813 },
  "CN": { ..., "billionaires_total": 415 },
  ...
}
```

**Categoría en categories.js:**
```javascript
{
  key: "billionaires_total",
  label: "Multimillonarios",
  group: "poder",
  question: "¿Qué país tiene más multimillonarios?",
  gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
  backgrounds: ["/illustrations/wealth.svg"],
  format: (v) => v.toLocaleString() + " billionarios",
  phrase: (a, b) => {
    const r = Math.max(a,b) / Math.min(a,b);
    if (r >= 2) return r.toFixed(1) + "x más multimillonarios";
    return Math.abs(a-b).toFixed(0) + " multimillonarios más";
  },
  dir: "higher",
}
```

## ⚠️ Errores comunes

❌ **NO hacer:**
- Inventar datos ("creo que X tiene ~1000")
- Mezclar fuentes sin contexto ("según mi tío...")
- Usar datos muy antiguos (>3 años) sin avisar
- Olvidar actualizar `countries.json`
- Usar `null` sin explicar por qué

✅ **SÍ hacer:**
- Documentar fuente y año
- Usar `null` + `nullReason` honesto
- Indicar confianza ("medium" si es estimación)
- Testear que el juego no se rompe
- Revisar que funciona con `higher_wins` y `lower_wins`

## 🚀 Quick checklist para añadir categoría

```
☐ Datos recopilados y verificados para 47 países
☐ Actualizado categories_metadata.json.js
☐ Actualizado category_values.json.js (con todas las anotaciones)
☐ Actualizado countries.json
☐ Añadida a categories.js con format() y phrase()
☐ Gradient y backgrounds elegidos
☐ dir: "higher" o "lower" verificado
☐ Testeado que el juego funciona
☐ Documentado en notas si hay algún problema
```

## 📞 Contacto / Preguntas

Si una categoría tiene datos incompletos (varios nulls), marca como `recommendation: "phase2"` y déjala lista para después.

Si está completamente documentada pero dudas de confianza, marca `confidence: "medium"` o `"low"`.
