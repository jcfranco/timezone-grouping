import {timeZones} from '../utils/time-zones.mjs';
import type {
  GroupTimeZonesOptions,
  IndexLabelGrouping,
} from '../types/interfaces.mjs';
import {defaultGroupingOptions} from './defaults.mjs';
import {
  compareDateArrs,
  generateTimeZoneMetadata,
  getGroupLabelTimeZoneIndices,
} from './utils.mjs';

export async function groupByOffset(options?: Partial<GroupTimeZonesOptions>) {
  const {groupDateRange, startDate, dateEngine} = {
    ...defaultGroupingOptions,
    ...options,
  };
  const grouping: IndexLabelGrouping[] = [];

  if (!dateEngine) {
    throw new Error('dateEngine is required');
  }

  const timeZoneItems = timeZones.map((tz) => ({label: tz}));

  const timeZoneMetadata = generateTimeZoneMetadata(
    timeZoneItems,
    startDate,
    groupDateRange,
    dateEngine,
  );

  // We traverse the mappedDB and see if we find matches by comparing each set
  // of transformed date for that specific TZ.
  for (const tzMetadatumI of timeZoneMetadata) {
    const {label, continent, dates} = tzMetadatumI;

    if (tzMetadatumI.visited) {
      continue;
    }

    tzMetadatumI.visited = true;

    const newGroup: IndexLabelGrouping = {
      labelIdx: [],
      tzs: [{label}],
    };

    for (const tzMetadatumJ of timeZoneMetadata.filter((_) => !_.visited)) {
      const {
        label: labelJ,
        continent: continentJ,
        isRegularContinent: isRegularContinentJ,
        dates: datesJ,
      } = tzMetadatumJ;

      // We define a matching TZ by:
      // 1) if both continents match (avoid grouping Antarctica with anything else)
      // 2) if the transformed dates match in both TZs
      if (
        (continent === continentJ || !isRegularContinentJ) &&
        compareDateArrs(dates, datesJ, dateEngine)
      ) {
        const tzItem = {label: labelJ};
        newGroup.tzs.push(tzItem);

        tzMetadatumJ.visited = true;
      }
    }

    grouping.push(newGroup);
  }

  // Now that we have a group, we want an easy way to find a fitting label for the group
  // which is defined as the list of the most-common 7 cities, shown in alphabetical order
  return grouping
    .map((group) => {
      group.tzs = group.tzs.sort((a, b) => a.label.localeCompare(b.label));

      return {
        labelTzIdx: getGroupLabelTimeZoneIndices(group.tzs, 7),
        tzs: group.tzs.map((_) => _.label),
      };
    })
    .sort((a, b) => b.tzs.length - a.tzs.length);
}
