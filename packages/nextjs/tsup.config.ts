import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts', 'src/client.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  minify: true,
  sourcemap: true,
  clean: true,
});
