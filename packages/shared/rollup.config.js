import typescript from '@rollup/plugin-typescript';

export default [
  // CommonJS 빌드
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      typescript({
        declaration: false,
        declarationMap: false,
        sourceMap: true,
        rootDir: './src',
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        tsconfig: false, // tsconfig.json 사용 안 함
      }),
    ],
    external: (id) => {
      // node_modules와 절대 경로는 external로 처리
      return !id.startsWith('.') && !id.startsWith('/');
    },
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
      typescript({
        declaration: false,
        declarationMap: false,
        sourceMap: true,
        rootDir: './src',
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        tsconfig: false, // tsconfig.json 사용 안 함
      }),
    ],
    external: (id) => {
      return !id.startsWith('.') && !id.startsWith('/');
    },
  },
];

