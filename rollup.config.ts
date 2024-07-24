import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import type {InputOption, OutputOptions, MergedRollupOptions} from 'rollup';

const bundles: Array<{input: InputOption; output: OutputOptions}> = [
  {
    input: {
      index: 'src/index.ts',
      /* eslint-disable @typescript-eslint/naming-convention -- need to match the file names */
      'strategy/date-fns/index': 'src/strategy/date-fns.ts',
      'strategy/dayjs/index': 'src/strategy/dayjs.ts',
      'strategy/luxon/index': 'src/strategy/luxon.ts',
      'strategy/moment/index': 'src/strategy/moment.ts',
      'strategy/native/index': 'src/strategy/native.ts',
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    output: {
      chunkFileNames: 'chunks/[name]-[hash].mjs',
      dir: 'dist',
      entryFileNames: '[name].mjs',
      format: 'esm',
    },
  },
];

export default bundles.map<MergedRollupOptions>(({input, output}) => ({
  input,
  output: [output],
  plugins: [
    resolve({
      moduleDirectories: ['node_modules'],
    }),
    commonjs(),
    json(),
    typescript({
      declaration: true,
    }),
    copy({
      targets: [{src: 'src/types/interfaces.d.ts', dest: 'dist/types/'}],
    }),
    // @ts-expect-error -- falsy plugins are not typed correctly in rollup
    (output.chunkFileNames as string)?.includes('.min.') && terser(),
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
}));
