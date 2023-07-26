import type { DateEngine } from "../interfaces.d.ts";

let flag = false;
const formatterCache = new Map<string, Intl.DateTimeFormat>();

const localOffset = new Date().getTimezoneOffset();

class NativeDateEngine implements DateEngine<Date> {
    create(date: string): Date {
        return new Date(date);
    }
    increaseDay(date:Date): Date {
        return new Date(date.getTime() + 86400000);
    }
    format(date:Date) : string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    tzToUtc(isoDate:string, tz: string) : Date {
        const dateParts = isoDate.split('-');
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[2], 10);

        const date = new Date(year, month, day);

        let formatter = formatterCache.get(tz);

        if (!formatter) {
            formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZoneName: 'shortOffset',
            });
            formatterCache.set(tz, formatter);
        }

        const parts = formatter.formatToParts(date);
        const [m, d, y] = parts.filter(({ type }) => type !== 'literal').map(({ value }) => Number(value));
        const offset = parts.find(({ type }) => type === 'timeZoneName')!.value;

        const gmtTimeZoneToHoursMinutes = (gmtTimeZone: string) => {
            const [sign, ...hoursMinutes] = gmtTimeZone.slice(3);
            const [hours, minutes] = hoursMinutes.join("").split(':');
            const factor = sign === '+' ? 1 : -1;
            return factor * (Number(hours) * 60 + Number(minutes || 0));
        }

        const tzOffset = gmtTimeZoneToHoursMinutes(offset);

        return new Date(Date.UTC(y, m - 1, d, 0, -tzOffset, 0, 0));
    }
    equal(date1:Date, date2:Date): boolean {
        return date1.getTime() === date2.getTime();
    }
}

export { NativeDateEngine as DateEngine };
