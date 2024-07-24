#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-unsafe-call, n/file-extension-in-import, unicorn/prefer-top-level-await */

import {createWriteStream} from 'node:fs';
import process from 'node:process';
import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';

(async function () {
  const {groupTimeZones} = await import('./auto-group.js');
  const {createDateEngine} = await import('./strategy/index.js');

  type SupportedDateEngine = Parameters<typeof createDateEngine>[0];

  type Arguments = {
    start?: string;
    days?: number;
    engine?: SupportedDateEngine;
    debug?: boolean;
  };

  const argv = yargs(hideBin(process.argv))
    .options({
      start: {type: 'string', description: 'Start date for the grouping'},
      days: {
        type: 'number',
        description: 'Number of days to group',
        default: 365,
      },
      engine: {
        type: 'string',
        description: 'Date engine to use',
        choices: ['moment', 'dayjs', 'luxon', 'date-fns', 'native'],
        default: 'moment',
      },
      debug: {
        type: 'boolean',
        description: 'Enable debug mode',
        default: false,
      },
    })
    .parseSync() as Arguments;

  const options: Parameters<typeof groupTimeZones>[0] = {};

  if (argv.start) {
    options.startDate = argv.start;
  }

  if (argv.days) {
    options.groupDateRange = argv.days;
  }

  if (argv.engine) {
    options.dateEngine = await createDateEngine(argv.engine);
  }

  if (argv.debug) {
    options.debug = argv.debug;
  }

  const finalGrouping = await groupTimeZones(options);

  const fileName = `timezone-groups_${options.dateEngine ? `${options.dateEngine.name}_` : ''}${Date.now()}.json`;
  console.log(
    `Printing ${finalGrouping.length} groups into file ./${fileName}`,
  );

  const file = createWriteStream(fileName);
  file.write(JSON.stringify(finalGrouping, undefined, 2));
  file.end();
})();
