import { add, format, isEqual } from 'date-fns';
import { utcToZonedTime} from 'date-fns-tz';
import type { DateEngine } from "../interfaces.d.ts";

export class DateFnsDateEngine implements DateEngine<Date> {
  create(date: string): Date {
    return new Date(date);
  }

  increaseDay(date: Date): Date {
    return add(date, { days: 1 });
  }

  format(date: Date): string {
    return format(date, "yyyy-MM-dd");
  }

  tzToUtc(isoDate: string, tz: string) {
    return utcToZonedTime(isoDate, tz);
  }

  equal(date1: Date, date2: Date): boolean {
    return isEqual(date1, date2);
  }
}

export { DateFnsDateEngine as DateEngine };
