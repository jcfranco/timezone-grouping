import moment from 'moment-timezone';
import { cityTranslations } from './config/index.mjs';
import type { MappedDb, RawTimeZone, SupportedTimeZone } from "./interfaces.d.ts";

const CONTINENT_ALLOWLIST = [
  'Europe',
  'Asia',
  'America',
  'America/Argentina',
  'Africa',
  'Australia',
  'Pacific',
  'Atlantic',
  'Antarctica',
  'Arctic',
  'Indian',
];

const LABELS_DENYLIST = [
  'Australia/West',
  'Australia/South',
  'America/North_Dakota/Center',
];

const _getDates = (startDate: any, numDays: number) => {
  const dateArray = [];

  const momentStart = moment(startDate);

  for (let i = 0; i <= numDays; i++) {
    dateArray.push(momentStart.clone().add(i, 'days').format('YYYY-MM-DD'));
  }

  return dateArray;
};

const _extractContinent = (label: string) => {
  if (label.indexOf('Istanbul') !== -1) {
    return 'Europe';
  }

  const lastIndex = label.lastIndexOf('/');
  return (lastIndex === -1 ? label : label.slice(0, lastIndex));
}

const _isRegularContinent = (continent: string) => CONTINENT_ALLOWLIST.includes(continent);

export const generateMappedDB = (database: SupportedTimeZone[], startDate: string, numDays: number): MappedDb[] => {
  console.log(`Initializing data starting ${startDate} with ${numDays} days in the future, comparing ${database.length} timezones`);

  const theDates = _getDates(startDate, numDays);
  return database.map(d => {
    const continent = _extractContinent(d.label);
    return {
      ...d,
      continent,
      isRegularContinent: _isRegularContinent(continent),
      dates: theDates.map(date => moment.tz(date, d.label).utc().format()),
    }
  });
};

export const compareDateArrs = (arr1: any[], arr2: any[]) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

const _extractCity = (label: string): string => {
  if (cityTranslations[label]) {
    return cityTranslations[label];
  }

  if (label.indexOf('Etc/') === 0 || LABELS_DENYLIST.includes(label)) {
    return label;
  }

  const lastIndex = label.lastIndexOf('/');
  return (lastIndex === -1 ? label : label.slice(lastIndex + 1)).replace(/[\W_]/g, ' ');
}

export const calculateGroupLabel = (rawTZs: RawTimeZone[], max = 5) => {
  rawTZs = rawTZs.sort((a, b) => b.count - a.count);

  const shrinkedTZs = rawTZs.filter(({ label }) => _isRegularContinent(_extractContinent(label)));
  rawTZs = shrinkedTZs.length === 0 ? [rawTZs[0]] : shrinkedTZs;

  const uniqueLabels = [
    ...new Set(
      rawTZs
        .map(({ label }) => _extractCity(label))
        .filter(_ => !!_)
    )];

  return uniqueLabels
    .slice(0, max)
    .join(', ');
}
