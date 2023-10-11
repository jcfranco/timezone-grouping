import {defaultGroupingOptions, supportedTimeZones} from './config/index.js';
import {
  getGroupLabelTimeZoneIndices,
  compareDateArrs,
  generateTimeZoneMetadata,
} from './utils.js';
import type {
  FinalGrouping,
  Grouping,
  GroupTimeZonesOptions,
  TimeZoneMetadata,
} from './types/interfaces.d.js';

export async function groupTimeZones(
  options?: Partial<GroupTimeZonesOptions>,
): Promise<FinalGrouping[]> {
  const {debug, groupDateRange, hooks, startDate, dateEngine} = {
    ...defaultGroupingOptions,
    ...options,
  };
  const grouping: Grouping[] = [];

  if (!dateEngine) {
    throw new Error('dateEngine is required');
  }

  const timeZoneItems = supportedTimeZones.map((tz) => ({label: tz}));
  hooks?.onBeforeTimeZoneMetadataCreate?.(timeZoneItems);

  const timeZoneMetadata: TimeZoneMetadata = generateTimeZoneMetadata(
    timeZoneItems,
    startDate,
    groupDateRange,
    dateEngine,
    debug,
  );

  hooks?.onTimeZoneMetadataCreate?.(timeZoneMetadata);

  // We traverse the mappedDB and see if we find matches by comparing each set
  // of transformed date for that specific TZ.
  for (const tzMetadatumI of timeZoneMetadata) {
    const {label, continent, dates} = tzMetadatumI;

    // ignore if we visited this element already
    if (tzMetadatumI.visited) {
      continue;
    }

    // Mark element as already visited
    tzMetadatumI.visited = true;

    // The grouped timezone that we want as a result
    const newGroup: Grouping = {
      labelTzIndices: undefined,
      tzs: [{label}],
    };

    hooks?.onGroupCreate?.(newGroup, tzMetadatumI);

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
        hooks?.onGroupTimeZoneAdd?.(newGroup, tzItem, tzMetadatumJ);

        // Mark element as already visited
        tzMetadatumJ.visited = true;
      }
    }

    grouping.push(newGroup);
    hooks?.onGroupAdd?.(newGroup);
  }

  // Now that we have a group, we want an easy way to find a fitting label for the group
  // which is defined as the list of the most-common 7 cities, shown in alphabetical order
  const finalGrouping = grouping
    .map((group) => {
      hooks?.onBeforeFinalGroupCreate?.(group);

      group.tzs = group.tzs.sort((a, b) => a.label.localeCompare(b.label));

      const finalGrouping: FinalGrouping = {
        labelTzIndices: getGroupLabelTimeZoneIndices(group.tzs, 7),
        tzs: group.tzs.map((_) => _.label),
      };

      hooks?.onFinalGroupCreate?.(finalGrouping, group);

      return finalGrouping;
    })
    .sort((a, b) => b.tzs.length - a.tzs.length);

  if (debug) {
    const missingTzs = supportedTimeZones
      .map((tz) => (finalGrouping.some((y) => y.tzs.includes(tz)) ? null : tz))
      .filter(Boolean);

    if (missingTzs.length > 0) {
      throw new Error(
        `There are ${
          missingTzs.length
        } missing timezones: ${missingTzs.toString()}`,
      );
    }
  }

  return hooks?.onFinalGroupingCreate
    ? hooks.onFinalGroupingCreate(finalGrouping)
    : finalGrouping;
}
