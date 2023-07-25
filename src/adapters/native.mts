import type { DateEngine } from "../interfaces.d.ts";
class NativeDateEngine implements DateEngine<Date> {
    create(date: string): Date {
        return new Date(date);
    }
    increaseDay(date:Date): Date {
        return new Date(date.getTime() + 86400000);
    }
    format(date:Date) : string {
        return date.toISOString().slice(0, 10);
    }
    tzToUtc(isoDate:string, tz: string) : Date {
        return new Date((new Date(isoDate)).toLocaleDateString('en-US', { timeZone: tz }));
    }
    equal(date1:Date, date2:Date): boolean {
        console.log(date1, date2);

        return date1.getTime() === date2.getTime();
    }
}

export { NativeDateEngine as DateEngine };
