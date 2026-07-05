// Shared date math for the repeating-task widget.

export type Unit = "days" | "weeks" | "months";

export interface Occurrence {
  /** Next occurrence on or after today. */
  next: Date;
  /** The occurrence immediately before `next` (start of the current cycle). */
  prev: Date;
  /** Whole days from today until `next` (0 means today is an occurrence). */
  diffDays: number;
  /** Length of the current cycle in whole days (prev -> next). */
  cycleDays: number;
  /** Days elapsed in the current cycle (today - prev), clamped to >= 0. */
  elapsedDays: number;
}

const MS_PER_DAY = 86_400_000;

function atMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(a: Date, b: Date): number {
  // Whole days from a -> b, robust to DST via UTC-normalised midnights.
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / MS_PER_DAY);
}

/**
 * Add `n` months to `base`, preserving the intended day-of-month.
 * Clamps to the last day of the target month when it is shorter
 * (e.g. Jan 31 + 1 month -> Feb 28/29).
 */
function addMonths(base: Date, n: number, anchorDay: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth() + n, 1);
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(anchorDay, daysInMonth));
  return d;
}

/**
 * Compute the next occurrence of a recurring task.
 *
 * @param start    First occurrence date.
 * @param interval How many units between occurrences (>= 1).
 * @param unit     "days" | "weeks" | "months".
 * @param today    Reference "now" (defaults to the current date).
 */
export function computeOccurrence(
  start: Date,
  interval: number,
  unit: Unit,
  today: Date = new Date()
): Occurrence {
  const step = Math.max(1, Math.floor(interval));
  const startMid = atMidnight(start);
  const todayMid = atMidnight(today);

  let next: Date;
  let prev: Date;

  if (unit === "months") {
    const anchorDay = startMid.getDate();
    // Walk forward from the start until we reach today or later.
    let k = 0;
    let occ = startMid;
    // Bounded loop: guards against pathological inputs.
    for (let guard = 0; guard < 100_000; guard++) {
      if (daysBetween(todayMid, occ) >= 0) break;
      k++;
      occ = addMonths(startMid, k * step, anchorDay);
    }
    next = occ;
    prev = k > 0 ? addMonths(startMid, (k - 1) * step, anchorDay) : addMonths(startMid, -step, anchorDay);
  } else {
    const stepDays = unit === "weeks" ? step * 7 : step;
    const fromStart = daysBetween(startMid, todayMid);
    if (fromStart <= 0) {
      // Today is on or before the first occurrence.
      next = startMid;
      prev = new Date(startMid.getFullYear(), startMid.getMonth(), startMid.getDate() - stepDays);
    } else {
      const cycles = Math.ceil(fromStart / stepDays);
      next = new Date(startMid.getFullYear(), startMid.getMonth(), startMid.getDate() + cycles * stepDays);
      prev = new Date(startMid.getFullYear(), startMid.getMonth(), startMid.getDate() + (cycles - 1) * stepDays);
    }
  }

  const diffDays = daysBetween(todayMid, next);
  const cycleDays = Math.max(1, daysBetween(prev, next));
  const elapsedDays = Math.max(0, daysBetween(prev, todayMid));

  return { next, prev, diffDays, cycleDays, elapsedDays };
}

/** Human-readable frequency, e.g. "every 2 weeks" or "daily". */
export function frequencyLabel(interval: number, unit: Unit): string {
  const n = Math.max(1, Math.floor(interval));
  if (n === 1) {
    if (unit === "days") return "daily";
    if (unit === "weeks") return "weekly";
    return "monthly";
  }
  return `every ${n} ${unit}`;
}
