import type {SupportedTimeZone} from '../types/interfaces.d.js';

export const supportedTimeZones: SupportedTimeZone[] =
  Intl.supportedValuesOf('timeZone');
