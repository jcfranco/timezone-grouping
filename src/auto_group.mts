import { DEFAULT_GROUPING_OPTIONS, supportedTimeZones } from './config/index.mjs';
import { calculateGroupLabel, compareDateArrs, generateTimeZoneMetadata } from './utils.mjs';
import type { FinalGrouping, Grouping, GroupTimeZonesOptions, TimeZoneMetadata } from "./interfaces.d.ts";

export async function groupTimeZones(options?: Partial<GroupTimeZonesOptions>): Promise<FinalGrouping[]> {
  const { debug, groupDateRange, hooks, startDate, dateEngine } = { ...DEFAULT_GROUPING_OPTIONS, ...options } as GroupTimeZonesOptions;
  const grouping: Grouping[] = [];

  if (!dateEngine) {
    throw new Error("dateEngine is required");
  }

  console.time('groupTimeZones');

  const timeZoneItems = supportedTimeZones.map(tz => ({ label: tz }));
  hooks?.onBeforeTimeZoneMetadataCreate?.(timeZoneItems);

  const timeZoneMetadata: TimeZoneMetadata = generateTimeZoneMetadata(timeZoneItems, startDate, groupDateRange, dateEngine);

  hooks?.onTimeZoneMetadataCreate?.(timeZoneMetadata);
  console.timeEnd('groupTimeZones');

// we traverse the mappedDB and see if we find matches by comparing each set
// of transformed date for that specific TZ.
  timeZoneMetadata.forEach(tzMetadatumI => {
    const { label, continent, dates } = tzMetadatumI;

    // ignore if we visited this element already
    if (tzMetadatumI.visited) {
      return;
    }

    // mark element as already visited
    tzMetadatumI.visited = true;

    // the grouped timezone that we want as a result
    const newGroup = {
      label: undefined,
      rawTZs: [{ label }],
      representative: label,
    };

    hooks?.onGroupCreate?.(newGroup, tzMetadatumI);

    timeZoneMetadata
      .filter(_ => !_.visited) // only those that we have not yet visited
      .forEach(tzMetadatumJ => {
        const {
                label: labelJ,
                continent: continentJ,
                isRegularContinent: isRegularContinentJ,
                dates: datesJ
              } = tzMetadatumJ;

        // we define a matching TZ by:
        // 1) if both continents match (avoid grouping Antarctica with anything else)
        // 2) if the transformed dates match in both TZs
        if (
          (continent === continentJ || !isRegularContinentJ)
          && compareDateArrs(dates, datesJ, dateEngine)
        ) {
          const tzItem = { label: labelJ };
          newGroup.rawTZs.push(tzItem);
          hooks?.onGroupTimeZoneAdd?.(newGroup, tzItem, tzMetadatumJ);

          // mark element as already visited
          tzMetadatumJ.visited = true;
        }
      });

    grouping.push(newGroup);
    hooks?.onGroupAdd?.(newGroup);
  });

// now that we have a group, we want an easy way to find a fitting label for the group
// which is defined as the list of the most-common 7 cities, shown in alphabetical order
  const finalGrouping = grouping.map(group => {
      hooks?.onBeforeFinalGroupCreate?.(group);

      const finalGrouping = {
        label: calculateGroupLabel(group.rawTZs, 7),
        representative: group.representative,
        rawTZs: group.rawTZs.map(_ => _.label).sort(),
      };

      hooks?.onFinalGroupCreate?.(finalGrouping, group);

      return finalGrouping;
    })
    .sort((a, b) => b.rawTZs.length - a.rawTZs.length);

  if (debug) {
    const missingTZs = supportedTimeZones.map(tz => finalGrouping.find(y => y.rawTZs.indexOf(tz) > -1) ? null : tz).filter(_ => !!_);

    if (missingTZs.length !== 0) {
      throw new Error(`There are ${missingTZs.length} missing timezones: ${missingTZs}`);
    }
  }

  return hooks ? hooks.onFinalGroupingCreate?.(finalGrouping)! : finalGrouping;
}
