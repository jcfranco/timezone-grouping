/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import {DateTime} from 'luxon';
import type {DateEngine} from '../types/interfaces.d.js';

class LuxonDateEngine implements DateEngine<luxon.DateTime> {
  get name(): string {
    return 'luxon';
  }

  create(date: string): luxon.DateTime {
    return DateTime.fromISO(date);
  }

  increase(date: luxon.DateTime): luxon.DateTime {
    return date.plus({days: 1});
  }

  formatToIsoDateString(date: luxon.DateTime): string {
    return date.toFormat('yyyy-MM-dd');
  }

  isoToTimeZone(date: string, tz: string) {
    return DateTime.fromISO(date, {zone: tz}).toUTC();
  }

  same(date1: luxon.DateTime, date2: luxon.DateTime): boolean {
    return date1.equals(date2);
  }
}

export {LuxonDateEngine as DateEngine};
