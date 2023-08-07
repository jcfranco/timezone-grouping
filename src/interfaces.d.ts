export type TimeZoneMetadatum = {
  label: string;
  continent: string;
  isRegularContinent: boolean;
  dates: Array<ReturnType<DateEngine['create']>>;
  visited?: boolean;
};

export type TimeZoneMetadata = TimeZoneMetadatum[];

export type RawTimeZone = {
  label: string;
};

export type Grouping = {
  label: undefined | string;
  representative: string;
  rawTZs: RawTimeZone[];
};

export type TimeZone = string;

export type FinalGrouping = Omit<Grouping, 'rawTZs'> & {
  rawTZs: TimeZone[];
};

export type SupportedTimeZone = string;

export type SupportedDateEngine =
  | 'moment'
  | 'dayjs'
  | 'luxon'
  | 'date-fns'
  | 'native';

export type DateEngine<DateWrapper = any> = {
  create(date: string): DateWrapper;
  increase(date: DateWrapper): DateWrapper;
  formatToIsoDateString(date: DateWrapper): string;
  isoToTimeZone(isoDate: string, timeZone: string): DateWrapper;
  same(date1: DateWrapper, date2: DateWrapper): boolean;
};

export type TimeZoneItem = RawTimeZone;

type Extendable = Record<string, any>;

export type CustomTimeZoneMetadatum = TimeZoneMetadatum & Extendable;
export type CustomTimeZoneMetadata = CustomTimeZoneMetadatum[];
export type CustomTimeZoneItem = TimeZoneItem & Extendable;
export type CustomGrouping = Omit<Grouping, 'rawTZs'> & {
  rawTZs: Array<RawTimeZone & Extendable>;
} & Extendable;
export type CustomFinalGrouping = FinalGrouping & Extendable;

export type GroupTimeZonesOptions = {
  startDate: string;
  groupDateRange: number;
  dateEngine?: DateEngine;
  debug: boolean;
  hooks?: Partial<{
    onBeforeTimeZoneMetadataCreate(timeZoneItems: CustomTimeZoneItem[]): void;
    onTimeZoneMetadataCreate(timeZoneMetadata: CustomTimeZoneMetadata): void;
    onGroupCreate(
      grouping: CustomGrouping,
      timeZoneMetadatum: CustomTimeZoneMetadatum,
    ): void;
    onGroupTimeZoneAdd(
      grouping: CustomGrouping,
      tzItem: CustomTimeZoneItem,
      timeZoneMetadatum: CustomTimeZoneMetadatum,
    ): void;
    onGroupAdd(grouping: CustomGrouping): void;
    onBeforeFinalGroupCreate(group: CustomGrouping): void;
    onFinalGroupCreate(
      finalGrouping: CustomFinalGrouping,
      group: FinalGroup,
    ): void;
    onFinalGroupingCreate(
      grouping: CustomFinalGrouping[],
    ): CustomFinalGrouping[];
  }>;
};
