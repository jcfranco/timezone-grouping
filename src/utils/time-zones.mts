import {getAllTimezones, getTimezone} from 'countries-and-timezones';
import type {SupportedTimeZone} from '../types/interfaces.mjs';

/**
 * List of all supported, canonical, timezones.
 */
export const timeZones: SupportedTimeZone[] = Object.keys(getAllTimezones());

/**
 * Normalize an IANA timezone name to its canonical equivalent.
 */
export function normalize(tz: string): string {
  const tzData = getTimezone(tz);
  return tzData?.aliasOf ?? tz;
}
