import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  // CommonJS 빌드
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        sourceMap: true,
        rootDir: './src',
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        tsconfig: false, // tsconfig.json 사용 안 함
      }),
    ],
    external: [/node_modules/],
  },
  // ES Module 빌드
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm/index.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        sourceMap: true,
        rootDir: './src',
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        tsconfig: false, // tsconfig.json 사용 안 함
      }),
    ],
    external: [/node_modules/],
  },
];
