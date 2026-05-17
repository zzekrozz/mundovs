export default function ContentPage({ title, subtitle, lastUpdated, children }) {
  return (
    <article className="content-page">
      <header className="cp-header">
        <h1 className="cp-title">{title}</h1>
        {subtitle && <p className="cp-subtitle">{subtitle}</p>}
        {lastUpdated && <p className="cp-meta">Última actualización: {lastUpdated}</p>}
      </header>
      <div>{children}</div>
    </article>
  );
}
