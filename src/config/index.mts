import type { GroupTimeZonesOptions, SupportedDateEngine } from "../interfaces.d.ts";

export { cityTranslations } from './cities.mjs';
export { supportedTimeZones } from "./supportedTimeZones.mjs";

const now = new Date();
const startDate = now.toISOString();
const daysInYear = 365;
const groupDateRange = daysInYear;
const dateEngine: SupportedDateEngine = "moment";

export const DEFAULT_GROUPING_OPTIONS: GroupTimeZonesOptions = {
  startDate,
  groupDateRange,
  dateEngine,
  debug: false,
};

