import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <nav className="nav" aria-label="Navegación principal">
        <Link href="/" className="nav-logo">
          Mundo<span>Vs</span>
        </Link>
        <div className="nav-links">
          <Link href="/pais-del-dia">País del día</Link>
          <Link href="/rankings">Rankings</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/sobre">Sobre</Link>
        </div>
      </nav>

      <main className="layout-content">{children}</main>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>MundoVs</h4>
            <p style={{ fontSize: 12, color: "var(--mv-text-dim)", marginBottom: "0.5rem", lineHeight: 1.5 }}>
              Aprende geografía jugando. Compara países, descubre datos y rankings.
              Datos de fuentes oficiales.
            </p>
          </div>
          <div className="footer-col">
            <h4>Modos</h4>
            <ul>
              <li><Link href="/pais-del-dia">País del día</Link></li>
              <li><Link href="/clasico">MundoVs clásico</Link></li>
              <li><Link href="/challenger">Challenger</Link></li>
              <li><Link href="/infinito">Modo infinito</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Explora</h4>
            <ul>
              <li><Link href="/rankings">Rankings</Link></li>
              <li><Link href="/paises">Países</Link></li>
              <li><Link href="/comparar">Comparar</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Proyecto</h4>
            <ul>
              <li><Link href="/sobre">Sobre el proyecto</Link></li>
              <li><Link href="/metodologia">Metodología</Link></li>
              <li><Link href="/glosario">Glosario</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/legal/privacidad">Privacidad</Link></li>
              <li><Link href="/legal/terminos">Términos</Link></li>
              <li><Link href="/legal/cookies">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} <strong>MundoVs</strong> · Datos: Banco Mundial, OCDE, OMS, FIFA, COI, UNODC, FAOSTAT
        </div>
      </footer>
    </div>
  );
}
