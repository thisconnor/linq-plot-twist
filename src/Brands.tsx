export function LinqLogo() {
  return <img className="linq-logo" src="./linq-logo.png" alt="Linq" />;
}

export function PlotLogo({ compact = false }: { compact?: boolean }) {
  return <span className={`plot-logo ${compact ? 'plot-logo-small' : ''}`}>
    <svg viewBox="0 0 36 36" aria-hidden="true"><path d="M5 26h13c12 0 12-16 1-16h-8m0 0 6-6m-6 6 6 6" /></svg>
    <span>plot twist<small>TRAVEL</small></span>
  </span>;
}
