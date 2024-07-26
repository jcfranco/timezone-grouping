import type {GroupTimeZonesOptions} from '../types/interfaces.d.js';

export {supportedTimeZones} from './supported-time-zones.js';

const now = new Date();
const startDate = now.toISOString();
const daysInYear = 365;
const groupDateRange = daysInYear;

export const defaultGroupingOptions: GroupTimeZonesOptions = {
  startDate,
  groupDateRange,
  debug: false,
};
