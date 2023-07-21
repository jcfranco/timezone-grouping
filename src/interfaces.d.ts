export type MappedDb = {
  label: string;
  continent: string;
  isRegularContinent: boolean;
  dates: string[];
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
