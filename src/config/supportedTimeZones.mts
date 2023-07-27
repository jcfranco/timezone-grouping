import type { SupportedTimeZone } from "../interfaces.d.ts";

declare namespace Intl {
  type Key = 'calendar' | 'collation' | 'currency' | 'numberingSystem' | 'timeZone' | 'unit';

  function supportedValuesOf(input: Key): string[];
}

export const supportedTimeZones: SupportedTimeZone[] = Intl.supportedValuesOf("timeZone");
