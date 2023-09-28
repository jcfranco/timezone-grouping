#!/usr/bin/env node

import { createWriteStream } from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

// @ts-ignore
import type { FinalGrouping, GroupTimeZonesOptions, SupportedDateEngine, TimeZoneMetadatum } from "./interfaces.d.ts";
import { DEFAULT_GROUPING_OPTIONS } from "./config/index.mjs";

const argv = yargs<{
  start: string,
  days: number,
  engine: string,
  debug: boolean;
}>(hideBin(process.argv)).argv;

(async () => {
  const { groupTimeZones } = await import("./auto_group.mjs");

  const options: Partial<GroupTimeZonesOptions> = {};

  if (argv.start) {
    options.startDate = argv.start;
  }

  if (argv.days) {
    options.groupDateRange = argv.days;
  }

  if (argv.debug) {
    options.debug = argv.debug;
  }

  const finalGrouping: FinalGrouping[] = await groupTimeZones(options);

  const fileName = `timezone-groups_${options.dateEngine || DEFAULT_GROUPING_OPTIONS.dateEngine}_${Date.now()}.json`;
  console.log(`Printing ${finalGrouping.length} groups into file ./${fileName}`);

  const file = createWriteStream(fileName);
  file.write(JSON.stringify(finalGrouping, undefined, 2));
  file.end();
})();

