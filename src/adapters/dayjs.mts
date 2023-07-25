import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { DateEngine } from "../interfaces.d.ts";

dayjs.extend(utc);
dayjs.extend(timezone);
class DayJSDateEngine implements DateEngine<dayjs.Dayjs> {
  create(date: string): dayjs.Dayjs {
    return dayjs(date);
  }

  increaseDay(date: dayjs.Dayjs): dayjs.Dayjs {
    return date.add(1, 'days');
  }

  format(date: dayjs.Dayjs): string {
    return date.format("YYYY-MM-DD");
  }

  tzToUtc(isoDate: string, tz: string) {
    return dayjs.tz(isoDate, tz);
  }

  equal(date1: dayjs.Dayjs, date2: dayjs.Dayjs): boolean {
    return date1.isSame(date2);
  }
}

export { DayJSDateEngine as DateEngine };
