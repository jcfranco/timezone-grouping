import { add, format, isEqual } from 'date-fns';
import { utcToZonedTime} from 'date-fns-tz';
import type { DateEngine } from "../interfaces.d.ts";

export class DateFnsDateEngine implements DateEngine<Date> {
  get name(): string {
    return "date-fns";
  }

  create(date: string): Date {
    return new Date(date);
  }

  increase(date: Date): Date {
    return add(date, { days: 1 });
  }

  formatToIsoDateString(date: Date): string {
    return format(date, "yyyy-MM-dd");
  }

  isoToTimeZone(isoDate: string, tz: string) {
    return utcToZonedTime(isoDate, tz);
  }

  same(date1: Date, date2: Date): boolean {
    return isEqual(date1, date2);
  }
}

export { DateFnsDateEngine as DateEngine };
