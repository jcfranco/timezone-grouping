export type MappedDb = {
  label: string;
  continent: string;
  isRegularContinent: boolean;
  dates: Array<ReturnType<DateEngine['create']>>;
  count?: number;
  visited?: boolean;
};

export type RawTimeZone = {
  label: string;
  count: number;
};

export type Grouping = {
  label: undefined | string;
  representative: string;
  count: number;
  rawTZs: RawTimeZone[];
};

export type TimeZone = string;

export type FinalGrouping = Omit<Grouping, 'count' | 'rawTZs'> & {
  rawTZs: TimeZone[];
};

export type SupportedTimeZone = {
  label: string;
};

export type SupportedDateEngine =
  | 'moment'
  | 'dayjs'
  | 'luxon'
  | 'date-fns'
  | 'native';

export type DateEngine<DateWrapper = any> = {
  create(date: string): DateWrapper;
  increaseDay(date: DateWrapper): DateWrapper;
  format(date: DateWrapper): string;
  tzToUtc(isoDate: string, tz: string): DateWrapper;
  equal(date1: DateWrapper, date2: DateWrapper): boolean;
};

export type GroupTimeZonesOptions = {
  startDate: string;
  groupDateRange: number;
  dateEngine: SupportedDateEngine;
  debug: boolean;
};
