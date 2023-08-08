/* eslint-disable @typescript-eslint/no-unsafe-call -- need to make sure this plugins type is available when building */
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import executable from 'rollup-plugin-executable';

const bundles = [
  {
    input: {
      index: 'src/index.mts',
      /* eslint-disable @typescript-eslint/naming-convention -- need to match the file names */
      'strategy/date-fns/index': 'src/strategy/date-fns.mts',
      'strategy/dayjs/index': 'src/strategy/dayjs.mts',
      'strategy/luxon/index': 'src/strategy/luxon.mts',
      'strategy/moment/index': 'src/strategy/moment.mts',
      'strategy/native/index': 'src/strategy/native.mts',
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    output: {
      chunkFileNames: 'chunks/[name]-[hash].mjs',
      dir: 'dist',
      entryFileNames: '[name].mjs',
      format: 'esm',
    },
  },
  {
    input: 'src/cli.cts',
    output: {
      banner: '#!/usr/bin/env node\n\n',
      file: `dist/cli.cjs`,
      format: 'cjs',
      plugins: [executable()],
      inlineDynamicImports: true,
    },
  },
];

export default bundles.map(({input, output}) => ({
  input,
  output,
  plugins: [
    resolve({
      moduleDirectories: ['node_modules'],
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig:
        typeof input === 'string' && input.includes('cli')
          ? './tsconfig-cli.json'
          : './tsconfig.json',
    }),
    output.chunkFileNames?.includes('.min.') && terser(),
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
