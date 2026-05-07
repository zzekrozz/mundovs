# MundoVs 🌍

Herramienta educativa de comparación de países. Aprende geografía, economía y datos del mundo de forma interactiva.

## 🚀 Cómo arrancar

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## 📦 Estructura completa

```
mundovs/
├── components/
│   ├── MundoVs.jsx           # El juego completo
│   ├── Layout.jsx            # Nav + footer compartido
│   └── ContentPage.jsx       # Layout para páginas de texto
├── data/
│   ├── countries.json        # 47 países, 20 datos cada uno
│   └── categories.js         # Las 20 categorías + lógica de filtrado nulls
├── pages/
│   ├── _app.jsx
│   ├── index.jsx             # Home con el juego
│   ├── sobre.jsx             # Sobre el proyecto (posicionamiento educativo)
│   ├── metodologia.jsx       # Cómo se calculan los datos
│   ├── glosario.jsx          # Definiciones de los 20 indicadores
│   ├── contacto.jsx          # Página de contacto
│   ├── legal/
│   │   ├── privacidad.jsx    # RGPD-compliant
│   │   ├── terminos.jsx
│   │   └── cookies.jsx       # Cubre cookies de AdSense
│   └── blog/
│       ├── index.jsx
│       ├── los-paises-mas-grandes-del-mundo.jsx
│       ├── diferencias-economicas-espana-latinoamerica.jsx
│       ├── por-que-paises-nordicos-mas-altos.jsx
│       ├── como-se-mide-pib-per-capita.jsx
│       └── cafe-mas-consumido-mundo.jsx
└── package.json
```

## 🌐 Deploy en Vercel

```bash
npm i -g vercel
vercel
```

O conecta el repo de GitHub en vercel.com → deploy automático.

## 💰 Plan para AdSense

### Antes de solicitar
1. **Dominio mundovs.com** comprado y apuntando a Vercel
2. **Esperar 1-2 semanas** desde el deploy para tener algo de tráfico
3. **Subir 2-3 TikToks** apuntando a la web para tener visitas reales
4. **Verificar** que todas las páginas legales están accesibles desde el footer
5. **Cambiar el email de contacto** en las páginas (ahora dice contacto@mundovs.com)

### Solicitar AdSense
1. Ir a [adsense.google.com](https://adsense.google.com)
2. Añadir el dominio mundovs.com
3. Pegar el código de verificación en `pages/index.jsx`
4. Esperar 1-7 días para revisión

### Si te aprueban
En `components/MundoVs.jsx`, sustituye la función `AdSlot`:

```jsx
function AdSlot() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", minHeight: 90 }}
      data-ad-client="ca-pub-XXXXXXXX"
      data-ad-slot="XXXXXXX"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
```

### Si te rechazan
- **"Contenido escaso"**: añadir más artículos al blog
- **"Navegación insuficiente"**: esperar a tener más tráfico
- Las políticas de privacidad y cookies ya están cubiertas

### Alternativas si AdSense no funciona
- **Ezoic** — más fácil de aprobar, pagos similares
- **Media.net** — alternativa Yahoo/Bing
- **PropellerAds** — acepta casi todo

## 📊 Datos en MundoVs

- **47 países**: Europa + Latinoamérica + EEUU, Canadá, China, Japón, Corea del Sur, India, Australia, Sudáfrica, Egipto, Marruecos, Rusia, Turquía, Ucrania
- **20 categorías** clasificadas en 6 grupos
- **Combinaciones infinitas**: 5 categorías al azar de 20 cada partida

## 🎯 Próximos pasos sugeridos

- [ ] Comprar dominio mundovs.com
- [ ] Deploy en Vercel
- [ ] Subir primer TikTok apuntando a la web
- [ ] Solicitar AdSense después de 1-2 semanas
- [ ] Añadir más artículos al blog (recomendado: 1 por semana)
- [ ] Páginas SEO `/comparar/[paisA]-vs-[paisB]`
- [ ] Sistema de ranking diario (cuando tengamos backend)
