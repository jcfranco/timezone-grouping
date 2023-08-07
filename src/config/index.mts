import type { GroupTimeZonesOptions } from "../interfaces.d.ts";

export { cityTranslations } from './cities.mjs';
export { supportedTimeZones } from "./supportedTimeZones.mjs";

const now = new Date();
const startDate = now.toISOString();
const daysInYear = 365;
const groupDateRange = daysInYear;

export const DEFAULT_GROUPING_OPTIONS: GroupTimeZonesOptions = {
  startDate,
  groupDateRange,
  debug: false,
};

