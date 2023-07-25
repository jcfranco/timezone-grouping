/* eslint-disable @typescript-eslint/no-unsafe-call -- need to make sure this plugins type is available when building */
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import executable from 'rollup-plugin-executable';

const index = 'src/index.mts';
const umdName = 'timezone-grouping';
const fileName = 'timezone-grouping';

const bundles = [
  {
    input: index,
    output: {
      file: `dist/${fileName}.esm.js`,
      format: 'esm',
      inlineDynamicImports: true,
    },
  },
  {
    input: index,
    output: {
      file: `dist/${fileName}.mjs`,
      format: 'esm',
      inlineDynamicImports: true,
    },
  },
  {
    input: index,
    output: {
      file: `dist/${fileName}.browser.mjs`,
      format: 'esm',
      inlineDynamicImports: true,
    },
  },
  {
    input: index,
    output: {
      file: `dist/${fileName}.browser.min.mjs`,
      format: 'esm',
      inlineDynamicImports: true,
    },
  },
  {
    input: index,
    output: {
      file: `dist/${fileName}.umd.js`,
      format: 'umd',
      name: umdName,
      globals: {
        'moment-timezone': 'moment',
      },
      inlineDynamicImports: true,
    },
  },
  {
    input: index,
    output: {
      file: `dist/${fileName}.umd.min.js`,
      format: 'umd',
      name: umdName,
      globals: {
        'moment-timezone': 'moment',
      },
      inlineDynamicImports: true,
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
      tsconfig: input.includes('cli')
        ? './tsconfig-cli.json'
        : './tsconfig.json',
    }),
    output.file.includes('.min.') && terser(),
  ],
}));
