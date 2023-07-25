#!/usr/bin/env node

import { createWriteStream } from 'fs';

// @ts-ignore
import type { FinalGrouping } from "./interfaces.d.ts";

(async () => {
  const { groupTimeZones } = await import("./auto_group.mjs");

  const finalGrouping: FinalGrouping[] = await groupTimeZones();

  const fileName = `result_${Date.now()}.json`;
  console.log(`Printing ${finalGrouping.length} groups into file ./${fileName}`);

  const file = createWriteStream(fileName);
  file.write(JSON.stringify(finalGrouping, undefined, 2));
  file.end();
})();

