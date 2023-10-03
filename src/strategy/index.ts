/* eslint-disable unicorn/no-await-expression-member */
import type {SupportedDateEngine} from '../types/interfaces.d.js';

export async function createDateEngine(
  supportedDateEngine: SupportedDateEngine,
) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let DateEngine;

  switch (supportedDateEngine) {
    case 'dayjs': {
      DateEngine = (await import('./dayjs.js')).DateEngine;

      break;
    }

    case 'date-fns': {
      DateEngine = (await import('./date-fns.js')).DateEngine;

      break;
    }

    case 'luxon': {
      DateEngine = (await import('./luxon.js')).DateEngine;

      break;
    }

    case 'native': {
      DateEngine = (await import('./native.js')).DateEngine;

      break;
    }

    case 'moment': {
      DateEngine = (await import('./moment.js')).DateEngine;

      break;
    }
    // No default
  }

  if (!DateEngine) {
    throw new Error(`Unsupported date engine: ${supportedDateEngine}`);
  }

  return new DateEngine();
}
