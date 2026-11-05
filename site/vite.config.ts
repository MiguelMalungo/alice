import { defineConfig, type Plugin } from 'vite';

// Where the build is going to live. GitHub Pages serves the staging copy at /alice/;
// the café's own host (aliceinbrewland.com) and local dev serve it at the root.
const pages = !!process.env.GITHUB_PAGES;
const SITE_URL = pages ? 'https://miguelmalungo.github.io/alice' : 'https://aliceinbrewland.com';
const PUBLIC_URL = 'https://aliceinbrewland.com';

const decode = (s: string) => s
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .trim();

const offer = (price: string) => ({ '@type': 'Offer', price: price.replace(/[^\d,]/g, '').replace(',', '.'), priceCurrency: 'EUR' });

/** Reads the menu out of the page itself, so the structured data can't drift from what visitors see. */
function menuSections(html: string) {
  const sections: object[] = [];
  for (const [, body] of html.matchAll(/<section class="mnu__sec[^"]*">([\s\S]*?)<\/section>/g)) {
    const name = decode(body.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] ?? '');
    const items: object[] = [];
    for (const [, li] of body.matchAll(/<li>([\s\S]*?)<\/li>/g)) {
      const row = li.match(/<b>([\s\S]*?)<\/b><i><\/i><em>([^<]*)<\/em>/);        // food and drinks rows
      const sig = li.match(/<b>([^<]*)<em>([^<]*)<\/em><\/b><span>([\s\S]*?)<\/span>/); // signature drinks
      if (row) {
        const desc = li.match(/class=.mnu__desc.>([\s\S]*?)<\/span>/)?.[1];
        items.push({ '@type': 'MenuItem', name: decode(row[1]), ...(desc ? { description: decode(desc) } : {}), offers: offer(row[2]) });
      } else if (sig) {
        items.push({ '@type': 'MenuItem', name: decode(sig[1]), description: decode(sig[3]), offers: offer(sig[2]) });
      }
    }
    if (name && items.length) sections.push({ '@type': 'MenuSection', name, hasMenuItem: items });
  }
  return sections;
}

const structuredData = (html: string) => ({
  '@context': 'https://schema.org',
  '@type': ['Restaurant', 'CafeOrCoffeeShop'],
  '@id': `${PUBLIC_URL}/#restaurant`,
  name: 'Alice in Brewland',
  description: 'Brunch e café de especialidade no Porto, inspirado em Alice no País das Maravilhas.',
  url: `${PUBLIC_URL}/`,
  image: `${PUBLIC_URL}/img/og.jpg`,
  logo: `${PUBLIC_URL}/img/badge.webp`,
  telephone: '+351964141693',
  email: 'cabanasechoupanas@gmail.com',
  address: { '@type': 'PostalAddress', streetAddress: 'Rua do Almada 334', postalCode: '4050-033', addressLocality: 'Porto', addressCountry: 'PT' },
  servesCuisine: ['Brunch', 'Café de especialidade'],
  acceptsReservations: 'https://reserve.dish.co/337798',
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:30', closes: '18:00',
  }],
  sameAs: ['https://www.instagram.com/alice_brewland/', 'https://www.tiktok.com/@alice.in.brewland'],
  hasMenu: { '@type': 'Menu', name: 'Menu Alice in Brewland', inLanguage: 'pt-PT', hasMenuSection: menuSections(html) },
});

const seo = (): Plugin => ({
  name: 'site-seo',
  transformIndexHtml(html) {
    const ld = JSON.stringify(structuredData(html)).replace(/</g, '\\u003c');
    return html
      .replaceAll('%SITE_URL%', SITE_URL)
      // the staging copy must not compete with the real site in search results
      .replace('<!--robots-->', pages ? '<meta name="robots" content="noindex">' : '')
      .replace('</head>', `  <script type="application/ld+json">${ld}</script>\n</head>`);
  },
});

export default defineConfig({
  base: pages ? '/alice/' : '/',
  plugins: [seo()],
  server: { port: 5173, strictPort: true },
  build: { target: 'es2020', cssMinify: true, rollupOptions: { output: { manualChunks: { three: ['three'], gsap: ['gsap'] } } } },
});
