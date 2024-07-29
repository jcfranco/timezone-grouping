import type {GroupTimeZonesOptions} from '../types/interfaces.mjs';

const now = new Date();
const startDate = now.toISOString();
const daysInYear = 365;
const groupDateRange = daysInYear;

export const defaultGroupingOptions: GroupTimeZonesOptions = {
  groupDateRange,
  startDate,
};
