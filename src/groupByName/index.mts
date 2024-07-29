import {timeZones} from '../utils/time-zones.mjs';

export async function groupByName() {
  return timeZones.sort().map((tz) => ({label: tz}));
}
