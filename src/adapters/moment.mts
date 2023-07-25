import moment from 'moment-timezone';
import type { DateEngine } from "../interfaces.d.ts";

export class MomentDateEngine implements DateEngine<moment.Moment> {
  create(date: string): moment.Moment {
    return moment(date);
  }

  increaseDay(date: moment.Moment): moment.Moment {
    return date.add(1, 'days');
  }

  format(date: moment.Moment): string {
    return date.format("YYYY-MM-DD");
  }

  tzToUtc(isoDate: string, tz: string) {
    return moment.tz(isoDate, tz);
  }

  equal(date1: moment.Moment, date2: moment.Moment): boolean {
    return date1.isSame(date2);
  }
}

export { MomentDateEngine as DateEngine };
