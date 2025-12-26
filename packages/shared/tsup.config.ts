import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'], // CJS와 ESM 두 가지 포맷으로 빌드
    dts: true,              // 타입 정의 파일(.d.ts) 생성
    sourcemap: true,
    clean: true,
});
