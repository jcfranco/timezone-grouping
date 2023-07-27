import { database, DEFAULT_GROUPING_OPTIONS } from './config/index.mjs';
import { generateMappedDB, compareDateArrs, calculateGroupLabel } from './utils.mjs';
import type { GroupTimeZonesOptions, FinalGrouping, Grouping } from "./interfaces.d.ts";
import { getDateEngine } from "./adapters/index.mjs";

export async function groupTimeZones(options?: Partial<GroupTimeZonesOptions>): Promise<FinalGrouping[]> {
  const { debug, groupDateRange, startDate, dateEngine } = { ...DEFAULT_GROUPING_OPTIONS, ...options } as GroupTimeZonesOptions;
  const grouping: Grouping[] = [];

  const engine = typeof dateEngine === "string" ? new (await getDateEngine(dateEngine))() : dateEngine;
  console.time('groupTimeZones');
  const mappedDB = generateMappedDB(database, startDate, groupDateRange, engine);
  console.timeEnd('groupTimeZones');

// we traverse the mappedDB and see if we find matches by comparing each set
// of transformed date for that specific TZ.
  mappedDB.forEach(elemI => {
    const { label, continent, count = 1, dates } = elemI;

    // ignore if we visited this element already
    if (elemI.visited) {
      return;
    }

    // mark element as already visited
    elemI.visited = true;

    // the grouped timezone that we want as a result
    const newGroup = {
      label: undefined,
      rawTZs: [{ label, count }],
      representative: label,
      count,
    };

    mappedDB
      .filter(_ => !_.visited) // only those that we have not yet visited
      .forEach(elemJ => {
        const {
                label: labelJ,
                continent: continentJ,
                isRegularContinent: isRegularContinentJ,
                count: countJ = 1,
                dates: datesJ
              } = elemJ;

        // we define a matching TZ by:
        // 1) if both continents match (avoid grouping Antarctica with anything else)
        // 2) if the transformed dates match in both TZs
        if (
          (continent === continentJ || !isRegularContinentJ)
          && compareDateArrs(dates, datesJ, engine)
        ) {
          newGroup.rawTZs.push({ label: labelJ, count: countJ });
          newGroup.count += countJ;

          // mark element as already visited
          elemJ.visited = true;
        }
      });

    grouping.push(newGroup);
  });

// now that we have a group, we want an easy way to find a fitting label for the group
// which is defined as the list of the most-common 7 cities, shown in alphabetical order
  const finalGrouping = grouping.map(x => ({
    label: calculateGroupLabel(x.rawTZs, 7),
    representative: x.representative,
    count: x.count,
    rawTZs: x.rawTZs.map(_ => _.label).sort(),
  }))
    .sort((a, b) => b.count - a.count)
    .map(({ count, ...rest }) => ({ ...rest })); // remove count from list as not needed for the export

  if (debug) {
    const missingTZs = database.map(tz => finalGrouping.find(y => y.rawTZs.indexOf(tz) > -1) ? null : tz).filter(_ => !!_);

    if (missingTZs.length !== 0) {
      throw new Error(`There are ${missingTZs.length} missing timezones: ${missingTZs}`);
    }
  }

  return finalGrouping as FinalGrouping[];
}
