import type {DateEngine} from '../../types/interfaces.mjs';

class NativeDateEngine implements DateEngine<Date> {
  private readonly _formatterCache = new Map<string, Intl.DateTimeFormat>();

  private readonly _commonDateTimeFormatterOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZoneName: 'shortOffset',
  } as const;

  get name(): string {
    return 'native';
  }

  create(date: string): Date {
    return new Date(date);
  }

  increase(date: Date): Date {
    const oneDayInMs = 86_400_000;
    return new Date(date.getTime() + oneDayInMs);
  }

  formatToIsoDateString(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
  }

  isoToTimeZone(isoDate: string, tz: string): Date {
    const date = this._toDate(isoDate);
    const formatter = this._getFormatter(tz);
    const parts = formatter.formatToParts(date);
    const [offset] = parts
      .filter(({type}) => type === 'timeZoneName')
      .map(({value}) => value);
    const tzOffset = this._getTimeZoneOffsetInMins(offset);
    const tzOffsetMinutes =
      date.getMinutes() - (date.getTimezoneOffset() - tzOffset);

    date.setMinutes(tzOffsetMinutes);

    return date;
  }

  same(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime();
  }

  private _toDate(isoDate: string): Date {
    return new Date(isoDate);
  }

  private _getFormatter(tz: string) {
    // Workaround for https://issues.chromium.org/issues/381620359
    if (tz === 'Factory') {
      tz = 'Etc/GMT';
    }

    let formatter = this._formatterCache.get(tz);

    if (!formatter) {
      formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        ...this._commonDateTimeFormatterOptions,
      });

      this._formatterCache.set(tz, formatter);
    }

    return formatter;
  }

  private _getTimeZoneOffsetInMins(gmtTimeZone: string) {
    const [sign, ...hoursMinutes] = gmtTimeZone.slice(3);
    const [hours, minutes] = hoursMinutes.join('').split(':');
    const signMultiplier = sign === '+' ? 1 : -1;
    return signMultiplier * (Number(hours) * 60 + Number(minutes || 0));
  }
}

export {NativeDateEngine as DateEngine};
