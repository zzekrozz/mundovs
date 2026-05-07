import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <nav className="nav">
        <Link href="/" className="nav-logo">Mundo<span>Vs</span></Link>
        <div className="nav-links">
          <Link href="/sobre">Sobre</Link>
          <Link href="/metodologia">Metodología</Link>
          <Link href="/blog">Blog</Link>
        </div>
      </nav>
      <main className="layout-content">{children}</main>
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>MundoVs</h4>
            <p style={{ fontSize: 12, color: "#666", marginBottom: "0.5rem" }}>Herramienta educativa gratuita para comparar países. Datos de fuentes oficiales.</p>
          </div>
          <div className="footer-col">
            <h4>Recursos</h4>
            <ul>
              <li><Link href="/sobre">Sobre el proyecto</Link></li>
              <li><Link href="/metodologia">Metodología</Link></li>
              <li><Link href="/glosario">Glosario</Link></li>
              <li><Link href="/blog">Blog educativo</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/legal/privacidad">Privacidad</Link></li>
              <li><Link href="/legal/terminos">Términos</Link></li>
              <li><Link href="/legal/cookies">Cookies</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} <strong>MundoVs</strong> · Banco Mundial, OCDE, OMS, FIFA, COI</div>
      </footer>
    </div>
  );
}
