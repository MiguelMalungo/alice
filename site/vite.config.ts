import { defineConfig } from 'vite';
export default defineConfig({
  // GitHub Pages serves the project at /alice/; local dev stays at /
  base: process.env.GITHUB_PAGES ? '/alice/' : '/',
  server: { port: 5173, strictPort: true },
  build: { target: 'es2020', cssMinify: true, rollupOptions: { output: { manualChunks: { three: ['three'], gsap: ['gsap'] } } } },
});
