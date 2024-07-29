/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
import type {
  DateEngine,
  RawTimeZone,
  TimeZoneItem,
  TimeZoneMetadatum,
} from '../types/interfaces.mjs';
import {extractContinent, isRegularContinent} from '../utils/continent.mjs';

const _getDates = (
  startDate: any,
  numberDays: number,
  dateEngine: DateEngine,
) => {
  const dateArray = [];

  let date = dateEngine.create(startDate);

  for (let i = 0; i <= numberDays; i++) {
    date = dateEngine.increase(date);
    dateArray.push(dateEngine.formatToIsoDateString(date));
  }

  return dateArray;
};

export const generateTimeZoneMetadata = (
  timeZoneItems: TimeZoneItem[],
  startDate: string,
  numberDays: number,
  dateEngine: DateEngine,
): TimeZoneMetadatum[] => {
  const processedDates = new Map<string, any>();

  const theDates = _getDates(startDate, numberDays, dateEngine);

  return timeZoneItems.map((tzItem) => {
    const {label} = tzItem;
    const continent = extractContinent(label);
    const dates = theDates.map((date) => {
      const key = `${date}-${label}`;
      let utc = processedDates.get(key);

      if (utc) {
        return utc;
      }

      utc = dateEngine.isoToTimeZone(date, label);

      processedDates.set(key, utc);

      return utc;
    });

    return {
      ...tzItem,
      continent,
      isRegularContinent: isRegularContinent(continent),
      dates,
    };
  });
};

export const compareDateArrs = (
  array1: Array<ReturnType<DateEngine['create']>>,
  array2: Array<ReturnType<DateEngine['create']>>,
  dateEngine: DateEngine,
) =>
  array1.length === array2.length &&
  array1.every((value, index) => dateEngine.same(value, array2[index]));

export const getGroupLabelTimeZoneIndices = (
  rawTZs: RawTimeZone[],
  max = 5,
): number[] => {
  const shrinkedTzs = rawTZs.filter(({label}) =>
    isRegularContinent(extractContinent(label)),
  );

  if (shrinkedTzs.length === 0) {
    return [0];
  }

  const validLabels = shrinkedTzs.map((tz) => rawTZs.indexOf(tz));

  return equallyDistributedSampling(validLabels, max);
};

function equallyDistributedSampling(items: number[], maxItems = 5) {
  const totalItems = items.length;

  if (totalItems <= maxItems) {
    return items;
  }

  const numberItemsToSelect = Math.min(totalItems - 2, maxItems - 2);
  const stepSize = (totalItems - 1) / (numberItemsToSelect + 1);

  return [
    items[0],
    ...Array.from(
      {length: numberItemsToSelect},
      (_, i) => items[Math.round((i + 1) * stepSize)],
    ),
    items[totalItems - 1],
  ];
}
