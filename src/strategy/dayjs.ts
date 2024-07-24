/* eslint-disable @typescript-eslint/no-unsafe-return */
import dayjs from 'dayjs/esm';
import utc from 'dayjs/esm/plugin/utc';
import timezone from 'dayjs/esm/plugin/timezone';
import type {DateEngine} from '../types/interfaces.d.ts';

dayjs.extend(utc);
dayjs.extend(timezone);

class DayJsDateEngine implements DateEngine<dayjs.Dayjs> {
  get name(): string {
    return 'dayjs';
  }

  create(date: string): dayjs.Dayjs {
    return dayjs(date);
  }

  increase(date: dayjs.Dayjs): dayjs.Dayjs {
    return date.add(1, 'days');
  }

  formatToIsoDateString(date: dayjs.Dayjs): string {
    return date.format('YYYY-MM-DD');
  }

  isoToTimeZone(isoDate: string, tz: string) {
    return dayjs.tz(isoDate, tz);
  }

  same(date1: dayjs.Dayjs, date2: dayjs.Dayjs): boolean {
    return date1.isSame(date2);
  }
}

export {DayJsDateEngine as DateEngine};
