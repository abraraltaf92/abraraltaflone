import { useId, useRef, type CSSProperties, type PointerEvent } from "react";
import { journey } from "@/content/about";
import styles from "./Journey.module.css";

export type JourneyPoint = (typeof journey.points)[number];

/** A place on the chart, as percentages of its width and height. Also used for directions. */
type Spot = { x: number; y: number };

/** Empty room under the lowest level, in levels, so the first dot does not sit on the time axis. */
const GROUND = 0.6;
/** How far a point's number sits from the middle of its dot, in px. */
const NUMBER_REACH = 17;
/** A pointer this close to a dot (in px) counts as on it. Where dots crowd together the nearest one wins. */
const DOT_REACH = 22;
/** Roughly how many times wider a year is drawn than a level is tall. Only used to pick the side a number goes on. */
const YEAR_TO_LEVEL = 1.4;
/** Neighbours on one level count as close when they are less than this many years apart. */
const CLOSE = 0.5;

/** "2021-04" as a number of years: 2021.25. */
function yearsOf(date: string) {
  const [year, month = 1] = date.split("-").map(Number);
  return year + (month - 1) / 12;
}

const round = (value: number) => Math.round(value * 100) / 100;

const years = Array.from({ length: journey.years.to - journey.years.from + 1 }, (_, i) => journey.years.from + i);
const yearX = (year: number) => round(((year - journey.years.from) / (journey.years.to - journey.years.from)) * 100);
const levelY = (level: number) => round(((journey.levels.length - level) / (journey.levels.length - 1 + GROUND)) * 100);

const spots: Spot[] = journey.points.map((point) => ({ x: yearX(yearsOf(point.date)), y: levelY(point.level) }));

/**
 * A smooth line through the spots that never swings past them. Where two stretches meet,
 * the line takes the gentler of their two slopes (and runs flat at a peak or a dip),
 * so easy stretches stay straight and steep ones ease in and out.
 */
function smoothLine(points: Spot[]) {
  const last = points.length - 1;
  // two points in the same month have no run between them; the line then simply goes straight up
  const rise = (i: number) => (points[i + 1].y - points[i].y) / (points[i + 1].x - points[i].x) || 0;
  const slope = points.map((_, i) => {
    if (i === 0) return rise(0);
    if (i === last) return rise(last - 1);
    const before = rise(i - 1);
    const after = rise(i);
    if (before * after <= 0) return 0;
    return Math.abs(before) < Math.abs(after) ? before : after;
  });

  return points.slice(1).reduce((path, to, i) => {
    const from = points[i];
    const third = (to.x - from.x) / 3;
    return (
      path +
      `C${round(from.x + third)},${round(from.y + slope[i] * third)} ` +
      `${round(to.x - third)},${round(to.y - slope[i + 1] * third)} ${to.x},${to.y}`
    );
  }, `M${points[0].x},${points[0].y}`);
}

/**
 * Which way each point's number sits from its dot: on the outside of the bend the line
 * makes there, and never level with the dot, where the level's rule would strike through it.
 */
function numberSides() {
  const times = journey.points.map((point) => yearsOf(point.date));
  // the direction from point `i` towards point `j`, roughly as it looks on screen
  const towards = (i: number, j: number) => {
    const dx = (times[j] - times[i]) * YEAR_TO_LEVEL;
    const dy = journey.points[i].level - journey.points[j].level;
    const length = Math.hypot(dx, dy);
    return { x: dx / length, y: dy / length };
  };

  const sides: Spot[] = [];
  journey.points.forEach((_, i) => {
    const back = i > 0 ? towards(i, i - 1) : null;
    const ahead = i < journey.points.length - 1 ? towards(i, i + 1) : null;
    let x = -((back?.x ?? 0) + (ahead?.x ?? 0));
    let y = -((back?.y ?? 0) + (ahead?.y ?? 0));
    // On a straight run, and at either end, there is no bend to sit outside of: go above the line.
    if (!back || !ahead || Math.hypot(x, y) < 0.1) {
      const along = ahead ?? back ?? { x: 1, y: 0 };
      x = along.y * Math.sign(along.x || 1);
      y = -Math.abs(along.x);
    }
    // keep it clearly above or below the dot
    const tilt = Math.max(Math.abs(y) / Math.hypot(x, y), 0.6);
    y = y > 0 ? tilt : -tilt;
    x = Math.sign(x) * Math.sqrt(1 - tilt * tilt);

    // Close neighbours on one level would have their numbers touch on the same side: turn the second one round.
    const beside =
      i > 0 &&
      times[i] - times[i - 1] < CLOSE &&
      Math.abs(journey.points[i].level - journey.points[i - 1].level) < 0.5;
    if (beside && sides[i - 1].x * x + sides[i - 1].y * y > 0.5) {
      x = -x;
      y = -y;
    }
    sides.push({ x, y });
  });
  return sides;
}

const line = smoothLine(spots);
const sides = numberSides();

/**
 * The chart: a smooth line through the points, with a dot and a number on each.
 * The dots react to the pointer; the list under the chart is what the keyboard and screen readers use.
 */
export function JourneyChart({
  activeId,
  onOpen,
  onLeave,
}: {
  activeId: number | undefined;
  onOpen: (point: JourneyPoint, dot: HTMLElement) => void;
  onLeave: () => void;
}) {
  const fade = useId();
  const hovered = useRef<HTMLElement | null>(null);
  const active = spots[journey.points.findIndex((point) => point.id === activeId)];

  /** The point whose dot is nearest the pointer, if one is within reach. */
  const nearest = (e: PointerEvent<HTMLElement>) => {
    const dots = [...e.currentTarget.querySelectorAll<HTMLElement>("[data-dot]")];
    const distance = dots.map((dot) => {
      const box = dot.getBoundingClientRect();
      return Math.hypot(e.clientX - box.left - box.width / 2, e.clientY - box.top - box.height / 2);
    });
    const i = distance.indexOf(Math.min(...distance));
    return distance[i] <= DOT_REACH ? { point: journey.points[i], dot: dots[i] } : null;
  };
  // A mouse opens a point by coming near it and closes it by moving away; a tap or a click opens it too.
  const hover = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const over = e.type === "pointerleave" ? null : nearest(e);
    const dot = over?.dot ?? null;
    if (dot === hovered.current) return;
    hovered.current = dot;
    if (over) onOpen(over.point, over.dot);
    else onLeave();
  };
  const press = (e: PointerEvent<HTMLElement>) => {
    const over = nearest(e);
    if (over) onOpen(over.point, over.dot);
  };

  return (
    <div className={styles.chart} role="img" aria-label={journey.description}>
      <ul className={styles.levels}>
        {journey.levels.map((label, i) => (
          <li key={label} style={{ top: `${levelY(i + 1)}%` }}>
            {label}
          </li>
        ))}
      </ul>

      <div className={styles.field} onPointerMove={hover} onPointerLeave={hover} onPointerUp={press}>
        {/* Stretched to fill the field: drawn on a 100 x 100 grid, with strokes that keep their own width. */}
        <svg className={styles.art} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#000" stopOpacity="0.09" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </linearGradient>
          </defs>
          {journey.levels.map((label, i) => (
            <path key={label} className={styles.rule} d={`M0,${levelY(i + 1)}H100`} />
          ))}
          <path d={`${line}V100H${spots[0].x}Z`} fill={`url(#${fade})`} />
          <path className={styles.axis} d="M0,100H100" />
          {active && <path className={styles.guide} d={`M${active.x},${active.y}V100`} />}
          <path className={styles.line} d={line} />
        </svg>

        <ul className={styles.years}>
          {years.map((year) => (
            <li key={year} style={{ left: `${yearX(year)}%` }}>
              {year}
            </li>
          ))}
        </ul>

        {journey.points.map((point, i) => (
          <div
            key={point.id}
            className={styles.mark}
            data-dot=""
            data-point={point.id}
            data-active={activeId === point.id || undefined}
            style={
              {
                left: `${spots[i].x}%`,
                top: `${spots[i].y}%`,
                "--dx": `${round(sides[i].x * NUMBER_REACH)}px`,
                "--dy": `${round(sides[i].y * NUMBER_REACH)}px`,
              } as CSSProperties
            }
          >
            <span className={styles.dot} />
            <span className={styles.number}>{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
