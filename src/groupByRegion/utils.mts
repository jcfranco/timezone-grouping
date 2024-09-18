import type {TimeZoneItem, TimeZoneMetadatum} from '../types/interfaces.mjs';
import {extractRegion} from '../utils/region.mjs';

export const generateTimeZoneMetadata = (
  timeZoneItems: TimeZoneItem[],
): Array<Omit<TimeZoneMetadatum, 'dates' | 'isRegularContinent'>> => {
  return timeZoneItems.map((tzItem) => {
    const {label} = tzItem;
    const continent = extractRegion(label);

    return {
      ...tzItem,
      continent,
    };
  });
};
