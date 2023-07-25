import { DateTime } from 'luxon';
import type { DateEngine } from "../interfaces.d.ts";

export class LuxonDateEngine implements DateEngine<luxon.DateTime> {
  create(date: string): luxon.DateTime {
    return DateTime.fromISO(date);
  }

  increaseDay(date: luxon.DateTime): luxon.DateTime {
    return date.plus({ days: 1 });
  }

  format(date: luxon.DateTime): string {
    return date.toFormat("yyyy-MM-dd");
  }

  tzToUtc(date: string, tz: string) {
    return DateTime.fromISO(date, { zone: tz }).toUTC();
  }

  equal(date1: luxon.DateTime, date2: luxon.DateTime): boolean {
    return date1.equals(date2);
  }
}

export { LuxonDateEngine as DateEngine };
