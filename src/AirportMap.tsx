import { ArrowUpRight, Expand } from 'lucide-react';
import type { Scenario } from './scenario';

export function AirportMap({
  scenario,
  large = false,
  onOpen,
}: {
  scenario: Scenario;
  large?: boolean;
  onOpen?: () => void;
}) {
  const food = scenario.constraints.includes('food');
  const dog = scenario.constraints.includes('dog');
  const route =
    food && dog
      ? 'M50 170 L120 170 L120 90 L220 90 L220 170 L330 170 L330 102'
      : food
        ? 'M50 170 L120 170 L120 90 L175 90 L175 170 L330 170 L330 102'
        : dog
          ? 'M50 170 L220 170 L220 90 L250 90 L250 170 L330 170 L330 102'
          : 'M50 170 L330 170 L330 102';
  return (
    <div className={`airport-map ${large ? 'map-large' : ''}`}>
      <div className="map-topline">
        <span>TERMINAL 2</span>
        <span>
          {scenario.minutes} min route <ArrowUpRight size={12} />
        </span>
      </div>
      <svg
        viewBox="0 0 380 260"
        role="img"
        aria-label={`Sample airport diagram. From the central concourse via ${scenario.stops.join(', ')}. ${scenario.minutes} minutes, arriving ${scenario.arrival}.`}
      >
        <defs>
          <pattern
            id={large ? 'map-grid-large' : 'map-grid'}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path d="M16 0H0V16" className="map-grid-line" />
          </pattern>
        </defs>
        <rect
          width="380"
          height="260"
          fill={`url(#${large ? 'map-grid-large' : 'map-grid'})`}
        />
        <path
          d="M30 170H352 M120 170V74 M220 170V74 M330 170V74"
          className="map-corridor"
        />
        <rect
          x="91"
          y="54"
          width="58"
          height="42"
          rx="10"
          className={`map-place ${food ? 'is-relevant' : ''}`}
        />
        <path
          d="M112 67v12m-4-12v5h8v-5m-4 5v7m10-12v12"
          className="map-icon"
        />
        <rect
          x="191"
          y="54"
          width="58"
          height="42"
          rx="10"
          className={`map-place ${dog ? 'is-relevant' : ''}`}
        />
        <path
          d="M213 78c0-5 4-7 7-7s7 2 7 7c-4 3-10 3-14 0Zm-4-10h1m6-3h1m7 0h1m5 3h1"
          className="map-icon"
        />
        <rect
          x="301"
          y="54"
          width="58"
          height="42"
          rx="10"
          className="map-gate"
        />
        <text x="330" y="81" textAnchor="middle" className="map-gate-text">
          B12
        </text>
        <path d={route} className="map-route" />
        <circle cx="50" cy="170" r="8" className="map-you-halo" />
        <circle cx="50" cy="170" r="4" className="map-you" />
        <circle cx="330" cy="102" r="6" className="map-destination" />
        <text x="50" y="202" textAnchor="middle" className="map-label">
          You
        </text>
        <text x="120" y="39" textAnchor="middle" className="map-label">
          Food kiosk
        </text>
        <text x="220" y="27" textAnchor="middle" className="map-label">
          Pet relief
        </text>
        <text x="220" y="42" textAnchor="middle" className="map-small">
          beside B10
        </text>
        <text x="330" y="202" textAnchor="middle" className="map-label">
          Your gate
        </text>
        <text x="190" y="236" textAnchor="middle" className="map-small">
          Sample airport diagram · not to scale
        </text>
      </svg>
      <div className="map-route-label">
        <span>{scenario.routeLabel}</span>
        {onOpen && (
          <button
            className="map-expand"
            onClick={onOpen}
            aria-label="Open airport diagram"
          >
            <Expand size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
