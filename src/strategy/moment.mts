import moment from 'moment-timezone';
import type { DateEngine } from "../interfaces.d.ts";

export class MomentDateEngine implements DateEngine<moment.Moment> {
  get name(): string {
    return "moment";
  }

  create(date: string): moment.Moment {
    return moment(date);
  }

  increase(date: moment.Moment): moment.Moment {
    return date.add(1, 'days');
  }

  formatToIsoDateString(date: moment.Moment): string {
    return date.format("YYYY-MM-DD");
  }

  isoToTimeZone(isoDate: string, tz: string) {
    return moment.tz(isoDate, tz);
  }

  same(date1: moment.Moment, date2: moment.Moment): boolean {
    return date1.isSame(date2);
  }
}

export { MomentDateEngine as DateEngine };
