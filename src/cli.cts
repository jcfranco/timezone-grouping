#!/usr/bin/env node

import { createWriteStream } from 'fs';
import yargs, { Arguments, Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';

// @ts-ignore
import type { FinalGrouping, GroupTimeZonesOptions, SupportedDateEngine } from "./interfaces.d.ts";

const argv: Arguments<{ start: string, days: number, engine: string}> = yargs(hideBin(process.argv)).argv;

(async () => {
  const { groupTimeZones } = await import("./auto_group.mjs");

  const options: Partial<GroupTimeZonesOptions> = {};

  if (argv.start) {
    options.startDate = argv.start;
  }

  if (argv.days) {
    options.groupDateRange = argv.days;
  }

  if (argv.engine) {
    options.dateEngine = argv.engine as SupportedDateEngine;
  }

  const finalGrouping: FinalGrouping[] = await groupTimeZones(options);

  const fileName = `result_${options.dateEngine ? `${options.dateEngine}_` : "" }${Date.now()}.json`;
  console.log(`Printing ${finalGrouping.length} groups into file ./${fileName}`);

  const file = createWriteStream(fileName);
  file.write(JSON.stringify(finalGrouping, undefined, 2));
  file.end();
})();

