import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import type {MergedRollupOptions} from 'rollup';

const config: MergedRollupOptions = {
  input: {
    /* eslint-disable @typescript-eslint/naming-convention -- need to match the file names */
    'groupByOffset/index': 'src/groupByOffset/index.mts',
    'groupByOffset/strategy/date-fns/index':
      'src/groupByOffset/strategy/date-fns.mts',
    'groupByOffset/strategy/dayjs/index':
      'src/groupByOffset/strategy/dayjs.mts',
    'groupByOffset/strategy/luxon/index':
      'src/groupByOffset/strategy/luxon.mts',
    'groupByOffset/strategy/moment/index':
      'src/groupByOffset/strategy/moment.mts',
    'groupByOffset/strategy/native/index':
      'src/groupByOffset/strategy/native.mts',

    'groupByRegion/index': 'src/groupByRegion/index.mts',

    'groupByName/index': 'src/groupByName/index.mts',

    'utils/continent': 'src/utils/continent.mts',
    'utils/country': 'src/utils/country.mts',
    'utils/time-zones': 'src/utils/time-zones.mts',
    /* eslint-enable @typescript-eslint/naming-convention */
  },
  output: [
    {
      chunkFileNames: 'chunks/[name]-[hash].mjs',
      dir: 'dist',
      entryFileNames: '[name].mjs',
      format: 'esm',
    },
  ],
  plugins: [
    resolve({
      moduleDirectories: ['node_modules'],
    }),
    commonjs(),
    json(),
    typescript({
      rootDir: 'src',
    }),
  ],
  onwarn(warning, warn) {
    // Suppressing based on https://github.com/moment/luxon/issues/193
    if (
      warning.code === 'CIRCULAR_DEPENDENCY' &&
      warning.message.includes('luxon')
    ) {
      return;
    }

    warn(warning);
  },
};

export default config;
