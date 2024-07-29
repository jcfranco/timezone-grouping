/* eslint-disable unicorn/no-await-expression-member */
import type {SupportedDateEngine} from '../../types/interfaces.mjs';

export async function createDateEngine(
  supportedDateEngine: SupportedDateEngine,
) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let DateEngine;

  switch (supportedDateEngine) {
    case 'dayjs': {
      DateEngine = (await import('./dayjs.mjs')).DateEngine;

      break;
    }

    case 'date-fns': {
      DateEngine = (await import('./date-fns.mjs')).DateEngine;

      break;
    }

    case 'luxon': {
      DateEngine = (await import('./luxon.mjs')).DateEngine;

      break;
    }

    case 'native': {
      DateEngine = (await import('./native.mjs')).DateEngine;

      break;
    }

    case 'moment': {
      DateEngine = (await import('./moment.mjs')).DateEngine;

      break;
    }
    // No default
  }

  if (!DateEngine) {
    throw new Error(`Unsupported date engine: ${supportedDateEngine}`);
  }

  return new DateEngine();
}
