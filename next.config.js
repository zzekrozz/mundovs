/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Headers de seguridad en todas las respuestas
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Cache agresivo para assets estáticos de Next.js
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Redireccionamientos útiles
  async redirects() {
    return [
      // Alias comunes
      { source: "/jugar", destination: "/pais-del-dia", permanent: false },
      { source: "/ranking", destination: "/rankings", permanent: true },
      { source: "/pais", destination: "/paises", permanent: true },
      { source: "/comparar-paises", destination: "/comparar", permanent: true },
    ];
  },
};

module.exports = nextConfig;
