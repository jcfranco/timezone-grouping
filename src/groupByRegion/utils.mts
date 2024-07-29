import type {TimeZoneItem, TimeZoneMetadatum} from '../types/interfaces.mjs';
import {extractContinent, isRegularContinent} from '../utils/continent.mjs';

export const generateTimeZoneMetadata = (
  timeZoneItems: TimeZoneItem[],
): Array<Omit<TimeZoneMetadatum, 'dates'>> => {
  return timeZoneItems.map((tzItem) => {
    const {label} = tzItem;
    const continent = extractContinent(label, true);

    return {
      ...tzItem,
      continent,
      isRegularContinent: isRegularContinent(continent),
    };
  });
};
