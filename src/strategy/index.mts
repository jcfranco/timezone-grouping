import type { SupportedDateEngine } from "../interfaces.d.ts";

export async function createDateEngine(dateEngine: SupportedDateEngine) {
  let DateEngine;

  if (dateEngine === "dayjs") {
    DateEngine = (await import("./dayjs.mjs")).DateEngine;
  } else if (dateEngine === "date-fns") {
    DateEngine = (await import("./date-fns.mjs")).DateEngine;
  } else if (dateEngine === "luxon") {
    DateEngine = (await import("./luxon.mjs")).DateEngine;
  } else if (dateEngine === "native") {
    DateEngine = (await import("./native.mjs")).DateEngine;
  } else if (dateEngine === "moment") {
    DateEngine = (await import("./moment.mjs")).DateEngine;
  }

  if (!DateEngine) {
    throw new Error(`Unsupported date engine: ${dateEngine}`);
  }

  return new DateEngine();
}
