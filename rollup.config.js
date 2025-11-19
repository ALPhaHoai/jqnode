import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const isProduction = !process.env.ROLLUP_WATCH;

export default [
  // Node.js build (CommonJS)
  {
    input: 'index.js',
    output: {
      file: 'dist/jqnode.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs()
    ],
    external: [] // Let all dependencies be bundled for simplicity
  },

  // Browser build (UMD)
  {
    input: 'browser-entry.js',
    output: {
      file: 'dist/jqnode.umd.js',
      format: 'umd',
      name: '$', // Global variable name for browsers
      sourcemap: true
    },
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      isProduction && terser()
    ]
  },

  // Browser build minified (UMD)
  {
    input: 'browser-entry.js',
    output: {
      file: 'dist/jqnode.umd.min.js',
      format: 'umd',
      name: '$',
      sourcemap: true
    },
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      terser()
    ]
  }
];
