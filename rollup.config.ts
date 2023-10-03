/* eslint-disable @typescript-eslint/no-unsafe-call -- need to make sure this plugins type is available when building */
import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import executable from 'rollup-plugin-executable';

const bundles = [
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
      chunkFileNames: 'chunks/[name]-[hash].js',
      dir: 'dist',
      entryFileNames: '[name].js',
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
      declaration: true,
    }),
    copy({
      targets: [{src: 'src/types/interfaces.d.ts', dest: 'dist/types/'}],
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
