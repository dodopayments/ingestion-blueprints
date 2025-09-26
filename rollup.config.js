import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
    external: ['dodopayments'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declaration: true,
        declarationDir: 'dist',
        sourceMap: true,
      }),
    ],
  },
  // CJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external: ['dodopayments'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        sourceMap: true,
      }),
    ],
  },
];
