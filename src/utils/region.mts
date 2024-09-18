import {getCountryForTimezone, getTimezone} from 'countries-and-timezones';

export const global = 'Global';

/**
 * Check if a timezone is global (no country associated).
 */
function isGlobal(tz: string): boolean {
  return getTimezone(tz)!.countries.length === 0;
}

/**
 * Extract the region from a timezone.
 */
export function extractRegion(tz: string): string {
  if (isGlobal(tz)) {
    return global;
  }

  const separatorIndex = tz.indexOf('/');
  return separatorIndex === -1 ? tz : tz.slice(0, separatorIndex);
}

/**
 * Gets the country code for a timezone.
 */
export function getCountry(timeZone: string): string {
  return getCountryForTimezone(timeZone)?.id ?? timeZone;
}
