import type { SupportedDateEngine } from "../interfaces.d.ts";

export async function getDateEngine(dateEngine: SupportedDateEngine) {
  if (dateEngine === "dayjs") {
    return (await import("./dayjs.mjs")).DateEngine;
  }

  if (dateEngine === "date-fns") {
    return (await import("./date-fns.mjs")).DateEngine;
  }

  if (dateEngine === "luxon") {
    return (await import("./luxon.mjs")).DateEngine;
  }

  if (dateEngine === "native") {
    return (await import("./native.mjs")).DateEngine;
  }

  if (dateEngine === "moment") {
    return (await import("./moment.mjs")).DateEngine;
  }

  throw new Error(`Unsupported date engine: ${dateEngine}`);
}
