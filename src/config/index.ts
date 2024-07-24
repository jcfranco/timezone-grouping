import type {GroupTimeZonesOptions} from '../types/interfaces.d.js';

export {supportedTimeZones} from './supported-time-zones.js';

const now = new Date();
const startDate = now.toISOString();
const daysInYear = 365;
const groupDateRange = daysInYear;
const debug = false;
const groupBy = 'timezone';

export const defaultGroupingOptions: GroupTimeZonesOptions = {
  debug,
  groupBy,
  groupDateRange,
  startDate,
};
