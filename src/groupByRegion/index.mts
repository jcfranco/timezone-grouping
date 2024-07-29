import {timeZones} from '../utils/time-zones.mjs';
import type {LabelGrouping} from '../types/interfaces.mjs';
import {generateTimeZoneMetadata} from './utils.mjs';

export async function groupByRegion() {
  const grouping: LabelGrouping[] = [];
  const timeZoneItems = timeZones.map((tz) => ({label: tz}));
  const timeZoneMetadata = generateTimeZoneMetadata(timeZoneItems);

  for (const tzMetadatum of timeZoneMetadata) {
    const {label, continent, isRegularContinent} = tzMetadatum;

    if (tzMetadatum.visited) {
      continue;
    }

    tzMetadatum.visited = true;

    if (!isRegularContinent) {
      tzMetadatum.visited = true;
      continue;
    }

    const newGroup: LabelGrouping = {
      label: continent,
      tzs: [{label}],
    };

    for (const tzMetadatumJ of timeZoneMetadata.filter((_) => !_.visited)) {
      const {
        label: labelJ,
        continent: continentJ,
        isRegularContinent: isRegularContinentJ,
      } = tzMetadatumJ;

      if (continent === continentJ) {
        const tzItem = {label: labelJ};
        newGroup.tzs.push(tzItem);
        tzMetadatumJ.visited = true;
      }
    }

    grouping.push(newGroup);
  }

  return grouping
    .map((group) => {
      group.tzs = group.tzs.sort((a, b) => a.label.localeCompare(b.label));

      return {
        label: group.label,
        tzs: group.tzs.map((_) => _.label),
      } as const;
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}
