import { defineConfig, type Plugin } from 'vite';

// Where the build is going to live. GitHub Pages serves the project at /alice/;
// the café's own host (aliceinbrewland.com) and local dev serve it at the root.
const pages = !!process.env.GITHUB_PAGES;
const SITE_URL = pages ? 'https://miguelmalungo.github.io/alice' : 'https://aliceinbrewland.com';

// Absolute URLs (share image, canonical) follow the deploy target.
const siteUrl = (): Plugin => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
});

export default defineConfig({
  base: pages ? '/alice/' : '/',
  plugins: [siteUrl()],
  server: { port: 5173, strictPort: true },
  build: { target: 'es2020', cssMinify: true, rollupOptions: { output: { manualChunks: { three: ['three'], gsap: ['gsap'] } } } },
});
