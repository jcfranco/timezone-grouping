import type { DateEngine } from "../interfaces.d.ts";

class NativeDateEngine implements DateEngine<Date> {
    get name(): string {
        return "native";
    }

    create(date: string): Date {
        return new Date(date);
    }
    increase(date:Date): Date {
        const oneDayInMs = 86400000;
        return new Date(date.getTime() + oneDayInMs);
    }
    formatToIsoDateString(date:Date) : string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    isoToTimeZone(isoDate:string, tz: string) : Date {
        const date = this._toDate(isoDate);
        const formatter = this._getFormatter(tz);
        const parts = formatter.formatToParts(date);
        const [month, day, year, offset] = parts.filter(({ type }) => type !== 'literal').map(({ value }) => value);
        const tzOffset = this._getTimeZoneOffsetInMins(offset);

        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 0, -tzOffset));
    }
    same(date1:Date, date2:Date): boolean {
        return date1.getTime() === date2.getTime();
    }

    private _toDate(isoDate: string): Date {
        const dateParts = isoDate.split('-');
        const year =  Number(dateParts[0]);
        const month = Number(dateParts[1]) - 1;
        const day =   Number(dateParts[2]);

        return new Date(year, month, day);
    }

    private _getFormatter(tz: string) {
        let formatter = this._formatterCache.get(tz);

        if (!formatter) {
            formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                ...this._commonDateTimeFormatterOptions
            });

            this._formatterCache.set(tz, formatter);
        }

        return formatter;
    }

    private _formatterCache = new Map<string, Intl.DateTimeFormat>();

    private _commonDateTimeFormatterOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZoneName: 'shortOffset'
    } as const;

    private _getTimeZoneOffsetInMins(gmtTimeZone: string) {
        const [sign, ...hoursMinutes] = gmtTimeZone.slice(3);
        const [hours, minutes] = hoursMinutes.join("").split(':');
        const signMultiplier = sign === '+' ? 1 : -1;
        return signMultiplier * (Number(hours) * 60 + Number(minutes || 0));
    }
}

export { NativeDateEngine as DateEngine };
