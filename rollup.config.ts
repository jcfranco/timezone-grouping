/* eslint-disable @typescript-eslint/no-unsafe-call -- need to make sure this plugins type is available when building */
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import executable from 'rollup-plugin-executable';

const index = 'src/index.mts';
const umdName = 'timezone-grouping';
const fileName = 'index';

const bundles = [
  {
    input: index,
    output: {
      chunkFileNames: 'chunks/[name]-[hash].[format].js',
      dir: 'dist',
      entryFileNames: `${fileName}.esm.js`,
      format: 'esm',
    },
  },
  {
    input: index,
    output: {
      chunkFileNames: 'chunks/[name]-[hash].[format].min.js',
      dir: 'dist',
      entryFileNames: `${fileName}.esm.min.js`,
      format: 'esm',
    },
  },
  {
    input: index,
    output: {
      chunkFileNames: 'chunks/[name]-[hash].mjs',
      dir: 'dist',
      entryFileNames: `${fileName}.mjs`,
      format: 'esm',
    },
  },
  {
    input: index,
    output: {
      chunkFileNames: 'chunks/[name]-[hash].min.mjs',
      dir: 'dist',
      entryFileNames: `${fileName}.min.mjs`,
      format: 'esm',
    },
  },
  {
    input: index,
    output: {
      chunkFileNames: 'chunks/[name]-[hash].browser.mjs',
      dir: 'dist',
      entryFileNames: `${fileName}.browser.mjs`,
      format: 'esm',
      inlineDynamicImports: true,
    },
  },
  {
    input: index,
    output: {
      chunkFileNames: 'chunks/[name]-[hash].browser.min.mjs',
      dir: 'dist',
      entryFileNames: `${fileName}.browser.min.mjs`,
      format: 'esm',
      inlineDynamicImports: true,
    },
  },
  {
    input: index,
    output: {
      chunkFileNames: 'chunks/[name]-[hash].[format].js',
      dir: 'dist',
      entryFileNames: `${fileName}.browser.[format].mjs`,
      format: 'umd',
      globals: {
        'moment-timezone': 'moment',
      },
      inlineDynamicImports: true,
      name: umdName,
    },
  },
  {
    input: index,
    output: {
      chunkFileNames: 'chunks/[name]-[hash].[format].min.js',
      dir: 'dist',
      entryFileNames: `${fileName}.browser.[format].min.mjs`,
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
      chunkFileNames: 'chunks/[name]-[hash].[format]',
      dir: 'dist',
      entryFileNames: `${fileName}.[format]`,
      format: 'cjs',
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
    output.chunkFileNames?.includes('.min.') && terser(),
  ],
}));
