import { BusSchedule } from './mockData';

/**
 * Normalizes city and stop names for reliable search matching
 * e.g., 'kopargaon central' -> 'kopargaon'
 * 'chhatrapati sambhajinagar' matches 'aurangabad'
 */
function normalizeStopName(name: string): string {
  const lower = name.toLowerCase().trim();
  if (lower.includes('aurangabad') || lower.includes('sambhajinagar')) {
    return 'chhatrapati sambhajinagar aurangabad ' + lower;
  }
  return lower;
}

/**
 * Checks if a bus schedule matches directional search criteria.
 * Supports origin, destination, and intermediate stops in forward route order.
 */
export function isRouteMatchingSearch(
  schedule: BusSchedule,
  filterFrom: string,
  filterTo: string
): boolean {
  const fromQuery = filterFrom.trim().toLowerCase();
  const toQuery = filterTo.trim().toLowerCase();

  // If no search terms, schedule matches by default
  if (!fromQuery && !toQuery) {
    return true;
  }

  // Construct full ordered sequence of stops
  const rawStops = [
    schedule.origin,
    ...(schedule.stops || []),
    schedule.destination
  ];

  const fullStops = rawStops.map(normalizeStopName);

  // Helper to find matching index in sequence
  const findStopIndex = (query: string, fromStartIndex = 0): number => {
    const q = query.toLowerCase();
    for (let i = fromStartIndex; i < fullStops.length; i++) {
      if (fullStops[i].includes(q) || (q === 'aurangabad' && fullStops[i].includes('sambhajinagar')) || (q === 'sambhajinagar' && fullStops[i].includes('aurangabad'))) {
        return i;
      }
    }
    return -1;
  };

  // Case 1: Both From and To provided
  if (fromQuery && toQuery) {
    const fromIndex = findStopIndex(fromQuery, 0);
    if (fromIndex === -1) return false;

    // Search for destination strictly AFTER origin in the route
    const toIndex = findStopIndex(toQuery, fromIndex + 1);
    return toIndex !== -1 && toIndex > fromIndex;
  }

  // Case 2: Only From provided
  if (fromQuery) {
    return findStopIndex(fromQuery, 0) !== -1;
  }

  // Case 3: Only To provided
  if (toQuery) {
    return findStopIndex(toQuery, 0) !== -1;
  }

  return true;
}
