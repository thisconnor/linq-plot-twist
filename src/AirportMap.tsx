import { ArrowUpRight, Expand } from 'lucide-react';
import type { Scenario } from './scenario';
export function AirportMap({ scenario, large = false, onOpen }: { scenario: Scenario; large?: boolean; onOpen?: () => void }) {
  const gateX = scenario.key === 'direct' ? 245 : 330;
  const grid = large ? 'map-grid-large' : 'map-grid';
  // Every vertex is on a corridor. The dog stop and gate terminate at their actual markers.
  const route = `M40 170 H140 V96 M140 96 V170 H${gateX} V96`;
  return <div className={`airport-map ${large ? 'map-large' : ''}`}>
    <div className="map-topline"><span>TERMINAL 2</span><span>{scenario.minutes} min incl. pet stop <ArrowUpRight size={12}/></span></div>
    <svg viewBox="0 0 380 250" role="img" aria-label={`Sample airport diagram. Three minutes to pet relief beside B10, five-minute stop, then ${scenario.flight.petToGate} minutes to ${scenario.flight.gate}. Arrive ${scenario.arrival}.`}>
      <defs><pattern id={grid} width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" className="map-grid-line"/></pattern></defs>
      <rect width="380" height="250" fill={`url(#${grid})`}/>
      <path d="M25 170H350 M140 170V96 M245 170V96 M330 170V96" className="map-corridor"/>
      <path d={route} className="map-route"/>
      <rect x="111" y="54" width="58" height="42" rx="10" className="map-place is-relevant"/>
      <text x="140" y="80" textAnchor="middle" className="map-gate-text">🐾</text>
      {[{x:245,gate:'B12'}, {x:330,gate:'B16'}].map(({x,gate})=><g key={gate}><rect x={x-29} y="54" width="58" height="42" rx="10" className={scenario.flight.gate === gate ? 'map-gate' : 'map-place'}/><text x={x} y="81" textAnchor="middle" className={scenario.flight.gate === gate ? 'map-gate-text' : 'map-label'}>{gate}</text></g>)}
      <circle cx="40" cy="170" r="8" className="map-you-halo"/><circle cx="40" cy="170" r="4" className="map-you"/>
      <circle cx="140" cy="96" r="4" className="map-destination"/><circle cx={gateX} cy="96" r="5" className="map-destination"/>
      <text x="40" y="201" textAnchor="middle" className="map-label">You</text><text x="140" y="27" textAnchor="middle" className="map-label">Pet relief</text><text x="140" y="42" textAnchor="middle" className="map-small">beside B10</text>
      <text x="90" y="157" textAnchor="middle" className="map-small">3 min</text><text x={(140+gateX)/2} y="193" textAnchor="middle" className="map-small">{scenario.flight.petToGate} min to gate</text>
      <text x="190" y="232" textAnchor="middle" className="map-small">Sample airport diagram · not to scale</text>
    </svg><div className="map-route-label"><span>{scenario.routeLabel}</span>{onOpen && <button className="map-expand" onClick={onOpen} aria-label="Open airport diagram"><Expand size={14}/></button>}</div>
  </div>;
}
