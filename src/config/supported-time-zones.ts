import type {SupportedTimeZone} from '../types/interfaces.d.js';

export const supportedTimeZones: SupportedTimeZone[] = (() => {
  const platformTimeZones = Intl.supportedValuesOf('timeZone');

  // Not all browsers include these time zones, so we add them to ensure consistent groups
  const etcTimeZones = [
    'Etc/GMT+1',
    'Etc/GMT+10',
    'Etc/GMT+11',
    'Etc/GMT+12',
    'Etc/GMT+2',
    'Etc/GMT+3',
    'Etc/GMT+4',
    'Etc/GMT+5',
    'Etc/GMT+6',
    'Etc/GMT+7',
    'Etc/GMT+8',
    'Etc/GMT+9',
    'Etc/GMT-1',
    'Etc/GMT-10',
    'Etc/GMT-11',
    'Etc/GMT-12',
    'Etc/GMT-13',
    'Etc/GMT-14',
    'Etc/GMT-2',
    'Etc/GMT-3',
    'Etc/GMT-4',
    'Etc/GMT-5',
    'Etc/GMT-6',
    'Etc/GMT-7',
    'Etc/GMT-8',
    'Etc/GMT-9',
  ];

  return [...new Set([...platformTimeZones, ...etcTimeZones])];
})();
