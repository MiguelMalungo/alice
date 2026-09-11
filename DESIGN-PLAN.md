# Alice in Brewland — Website Design Plan

Brunch & specialty-coffee café, Rua do Almada 334, Porto. One-page site, Portuguese copy.
Source of truth for content and imagery: the Figma prototype "Alice-in-Brewland_One-Page" (read-only). Extracted assets live in `assets/figma-ref/`.

---

## 1. What the Figma gives us

**Brand world.** Victorian storybook: watercolour White Rabbit with a top hat, parchment scroll buttons, Queen-of-Hearts red, gold sparkles, warm cream ground, a brown Victorian-script wordmark ("ALICE in BREWLAND"). Tone of voice is playful and self-aware ("o tempo corre devagar, mas o café é rápido").

**Page order (keep it).** Hero → A Nossa História → A Experiência → O Nosso Brunch & Café → Eventos & Sala Privada → Localização & Horário → O Que Dizem Sobre Nós → Contactos & Redes Sociais → footer.

**Copy (verbatim, reuse as-is):**

- Hero: “Welcome to the rabbit hole of brunch.” / Na Alice in Brewland o tempo pára, o café desperta e as panquecas parecem saídas de um sonho. / És curioso o suficiente para provar o brunch mais mágico do Porto? / CTAs: “Seguir o Coelho Branco até ao Menu”, “Reservar a tua mesa encantada”.
- História: Tudo começou com uma chávena de café e uma ideia um pouco… maluca (mas as melhores ideias são sempre assim, não são?). Inspirados pelo mundo de Alice no País das Maravilhas, criámos um espaço onde: O tempo corre devagar, mas o café é rápido. / As paredes contam histórias, e os pratos também. / Cada visita é uma pequena aventura – sem precisares de cair num buraco no chão. / Bem-vindo ao lugar onde a imaginação se mistura com café de especialidade.
- Experiência: Não é só brunch. É um capítulo de fantasia comestível. / Um espaço instagramável, onde cada recanto parece saído de um livro ilustrado. / O sítio certo para reuniões de amigos, famílias curiosas ou despedidas de solteira com um toque de magia. / Uma decoração que te vai fazer duvidar se estás a comer panquecas ou a tomar chá com o Chapeleiro. / Bebidas e pratos que parecem dizer: “Bebe-me, come-me”… e claro, tu obedeces. / Na Alice in Brewland não vens só comer – vens atravessar o espelho e viver um bocadinho de loucura deliciosa.
- Brunch & Café: “Por aqui, o chá das cinco é quando tu quiseres – mas com panquecas, bagels e café de especialidade.” / Na nossa mesa cabem todos os personagens: Panquecas que fariam a Rainha de Copas sorrir (e isso já é dizer muito!) · Bagels artesanais dignos de um banquete de Chapeleiro Louco · Bowls tão frescas que até o Gato de Cheshire ficaria sem palavras (ou sem sorriso) · Café 100% arábica que desperta até o mais sonolento Coelho Branco. / Vegetarianos, sem glúten? Claro! Até a lagarta azul cá encontra lugar.
- Eventos: Porque nem todas as histórias se passam à mesa do costume. / Na Alice in Brewland há espaço para encontros especiais, celebrações improváveis e ideias que pedem outro cenário. / Uma sala privada, acolhedora e cheia de personalidade, pensada para quem procura um lugar diferente para celebrar, criar ou simplesmente estar. / Aniversários · Workshops & Masterclasses · Despedidas de solteira. / Pequenos eventos privados – sempre com tempo para ficar.
- Localização: “Não precisas de seguir um coelho branco para nos encontrar.” / Estamos na Rua do Almada 334, no coração do Porto – fácil de chegar, difícil de sair (porque vais querer ficar). / Horários mágicos: Segunda a Quinta 8h30–18h00 · Sexta a Domingo 8h30–19h00. / (Sim, o tempo corre de forma estranha aqui, mas garantimos que as panquecas chegam sempre na hora certa.) / CTAs: “Abrir o Mapa da Maravilha”, “Reservar já”.
- Reviews (5★): “Espaço muitíssimo agradável, ambiente fabuloso. A comida é mesmo muito boa, agradável e surpreendente.” / “A simpatia impera durante todo o dia e o outro ponto alto, são pet friendly… muito recomendável e de acesso fácil!” / “Se você procura um lugar aconchegante e charmoso para tomar um café em um lugar lindo, o Alice in Brewland é uma verdadeira jóia!”
- Contactos: Segue o rasto da magia: WhatsApp +351 964 141 693 · Email cabanasechoupanas@gmail.com (⚠ looks like a placeholder from another business — confirm) · Instagram “para veres como é cair no buraco do brunch” · TikTok “para dançar com o Chapeleiro Louco” · Google Maps “para não te perderes no País das Maravilhas”.
- Footer: “Entra no nosso mundo: onde cada café é uma poção mágica e cada brunch uma aventura sem fim.” · NIF 517 871 335.

**Assets extracted (`assets/figma-ref/`).**

| File | Use |
|---|---|
| white-rabbit-tophat.png (2848×3840, transparent) | Hero character, preloader, cursor companion |
| rabbit-ground-shadow.png | Soft shadow under the rabbit |
| photo-main-room-interior.png | Experiência |
| photo-private-room-red-table.jpg | Eventos & Sala Privada |
| photo-queen-of-hearts-pancake.png | Brunch hero dish |
| photo-brunch-bowl-book-matcha.jpg | Brunch / gallery |
| btn-seguir-coelho-branco-menu.png, btn-reservar-ja.png, btn-abrir-mapa-maravilha.png | Parchment CTA art (rebuild as CSS/SVG frame + live text, keep the illustrations) |
| map-rua-do-almada-334.png | Fallback static map |

**Still needed from the client / Figma owner:** logo wordmark as SVG (it is a vector in Figma; no edit access to export), Queen-of-Hearts heart ornament SVG, star rating SVG, WhatsApp/Email/Instagram/TikTok/Maps parchment icons, 6–10 more photos (drinks, interior details, people), menu (PDF or items with prices), reservation tool link, Instagram/TikTok URLs, real email.

---

## 2. The concept: *the scroll is the fall*

Alice doesn't walk into Wonderland; she falls. The site does the same. The page is a single vertical descent down the rabbit hole. Every section is a "landing" on the way down, and the transitions between sections are the fall itself: a WebGL tunnel with drifting objects (teacups, pocket watches, keys, playing cards, coffee beans) that scroll-scrubs past the camera between landings. You arrive at the tea party (the menu), the private room, the map, and finally the footer, where the rabbit is waiting at the bottom.

Why this works for an award-level site:
- It gives every section a *reason* to be animated, instead of decorating a static page.
- The story has a beginning, middle and end, so the motion has an arc.
- The metaphor is native to the brand, not imported from a template.

One aesthetic risk, taken deliberately: the hero is not a photo. It is the rabbit, the wordmark and a living hole in the ground, and the first scroll drops you into it.

---

## 3. Design system

### Colour (light = "the garden", dark = "inside the hole")

| Token | Light | Dark | Role |
|---|---|---|---|
| `--ground` | #F8ECE2 cream | #1C130E | Page background |
| `--ground-2` | #F2DFCF | #26190F | Alternate section ground |
| `--ink` | #3E2A1C cocoa | #F4E6D6 | Body text |
| `--umber` | #8B5E3C | #D9A877 | Headings, wordmark |
| `--parchment` | #F0DDB3 | #E7CF9E | Buttons, cards |
| `--parchment-edge` | #C9A96A | #A8864C | Card edges, rules |
| `--gold` | #C4933A | #E3B45A | Sparkles, stars, focus ring |
| `--hearts` | #B3302A | #D9463F | Queen red: hearts, one accent per section max |
| `--night` | #2B1D14 | #0F0906 | Footer band, tunnel void |

Rule: the cream/brown/parchment palette is the client's and stays. What makes it not-generic is the *dark* theme (the descent turns the page into the inside of the hole) and the strict rationing of red: one heart, one place, per section.

### Type

- **Display: IM Fell English** (Google Fonts). Fell types are period-correct for the 1865 Alice printing: slightly irregular, inky, unmistakably Victorian. Use for section titles and the pull-quotes; italic for the storybook lines ("Bebe-me, come-me").
- **Body: Lora** 400/600 + italic. Already the feel of the Figma; warm, readable at 17–18 px, sits well next to Fell. Tabular figures for hours and phone.
- **Labels: IM Fell English SC** for eyebrows ("CAPÍTULO II · A NOSSA HISTÓRIA"), letter-spaced 0.08em.
- Scale (desktop): 14 / 17 / 22 / 30 / 44 / 72 / hero 96–128 fluid with `clamp()`. Measure 62–68 characters.

### Layout

- 12-column fluid grid, 1440 design width, 24 px gutters, max content 1200 px.
- Landings alternate: centred storybook sections (História, Reviews, Contactos) and split image/text sections (Experiência, Brunch, Eventos, Localização), exactly as the Figma does.
- Section chapter marks: the Queen-of-Hearts heart on a hand-drawn rule, redrawn as SVG so it can animate (line draws itself, heart pops).
- The tunnel lives in a fixed full-viewport `<canvas>` behind the content, revealed only between landings.

### Components

- **Parchment button**: SVG scroll frame + live HTML text (accessible, translatable), illustration slot left/right, 3D tilt on hover (±6°), magnetic pull within 80 px, gold sparkle burst on click.
- **Playing card**: menu items and event types. Front: suit corner marks + Fell title. Flip on hover/tap.
- **Storybook photo frame**: rounded-rect frame with parchment edge; image inside gets a WebGL displacement hover (ripple "through the looking glass").
- **Pocket watch**: SVG watch that shows live Porto time and today's opening state ("Aberto até às 19h00" / "Abre amanhã às 8h30"). Minute hand actually moves.
- **Chapter rule**: SVG line + heart, draws in on scroll.
- **Custom cursor**: small ring that becomes a teacup over links, a pocket watch over the hours, and a "Bebe-me" tag over the menu. Hidden on touch devices.

---

## 4. Experience map (section by section)

| # | Landing | What you see | Motion | Tech |
|---|---|---|---|---|
| 0 | Preloader | Pocket watch, hands spinning fast, percentage in Fell numerals. Rabbit peeks in from the right edge. | Watch hands ease to 12, rabbit hops out, cream curtain wipes upward. ≤1.8 s, skippable. | GSAP timeline, asset preload gate |
| 1 | Hero | Wordmark (SVG, letters draw in), rabbit standing at the edge of a dark hole in the cream ground, sparkles, headline, two parchment CTAs, scroll cue "↓ cai" | Rabbit breathes (subtle scale/rotation loop), ears react to cursor (parallax 3 layers: rabbit / shadow / sparkles). First scroll: the hole widens, camera dives, page enters the tunnel. | three.js hole = radial shader on a plane; GSAP ScrollTrigger scrubs camera z |
| ↓ | Tunnel A | Earthen tunnel walls (procedural noise texture), drifting teacups, clocks, keys, cards | Objects on Catmull-Rom paths, scrub-linked to scroll with lag (`scrub: 1.2`); slight camera roll | three.js InstancedMesh + low-poly GLTFs (≤ 300 KB total) |
| 2 | A Nossa História | Eyebrow "Capítulo I", title, intro line, the 3 rules as three playing cards fanned on the table | Lines reveal with masked SplitText (lines slide up under a clip). Cards fan out from a deck with stagger 0.08. | GSAP SplitText (free since v3.13), ScrollTrigger |
| 3 | A Experiência | Interior photo in storybook frame left, text right. Second photo (brunch bowl + book) behind as a peeking card | Photo parallax (−8%), hover ripple, "Bebe-me, come-me" line typesets itself in italic Fell | WebGL displacement on hover (small custom shader); CSS for the rest |
| 4 | O Nosso Brunch & Café | Queen-of-Hearts pancake photo right, big; four menu playing cards (♥ Panquecas, ♠ Bagels, ♦ Bowls, ♣ Café) left | Cards flip on hover to reveal the tagline. Pancake photo has a "Drink me" tag that swings on a string (CSS transform-origin). CTA to full menu. | GSAP, CSS 3D |
| ↓ | Tunnel B | Darker tunnel, a door frame drifts past (foreshadowing the private room) | Same system, warmer light | three.js |
| 5 | Eventos & Sala Privada | Red-table photo behind a door; text right; event types as three small cards | Door swings open on enter (perspective rotateY), photo revealed behind; list items slide in. | GSAP + CSS 3D |
| 6 | Localização & Horário | Left: quote, address, live pocket watch, hours; right: custom-styled map with a heart pin. | A tiny rabbit runs along the street to the pin when the section enters. Watch ticks live. Pin pulses. "Abrir o Mapa da Maravilha" opens Google Maps. | Google Maps Embed / Mapbox with parchment style; fallback static PNG; SVG rabbit sprite on `<path>` via MotionPath |
| 7 | O Que Dizem | Three tea-stained review cards on a lazy-susan | Drag to rotate; auto-rotates slowly; stars fill in gold one by one | GSAP Draggable + Inertia |
| 8 | Contactos & Redes | Two parchment panels: WhatsApp / Email; Instagram / TikTok / Maps | Icons wobble on hover; copy-to-clipboard for phone and email with a "Copiado ✓" sparkle | Vanilla |
| 9 | Footer | Dark band, quote, NIF, rabbit sitting at the bottom of the hole looking up | Rabbit blinks; if the visitor scrolls fast to the bottom, a "Chegaste ao fundo" line appears | GSAP |

Persistent: sticky mini-nav on the right (chapter dots as suit symbols), "Reservar" pill in the top-right that turns red when the café is open right now.

---

## 5. Micro-interaction library

- **Masked line reveals** for every heading and paragraph (`clip-path` per line, `y: 100% → 0`, `power3.out`, 0.9 s, stagger 0.06).
- **Magnetic parchment buttons** (lerp toward cursor, spring back).
- **Sparkle burst** on click (8 gold particles, Canvas 2D, 400 ms).
- **Heart chapter rule** draws in (SVG `stroke-dashoffset`).
- **Photo ripple** on hover (WebGL displacement, decays in 600 ms).
- **Card flip** (rotateY 180°, `backface-visibility`).
- **Cursor morph** (ring → teacup / watch / tag).
- **Watch tick** (minute hand every 60 s, hour hand continuous; live open/closed state).
- **Rabbit ear parallax** in the hero (cursor-driven, ±12 px).
- **Scroll cue** "cai" bounces once every 4 s until first scroll.
- **Smooth scroll**: Lenis (`lerp: 0.09`), synced to ScrollTrigger.

Motion rules: one easing family (`power3` / `expo`), 0.6–1.2 s for reveals, 0.25 s for hover. Nothing loops except the rabbit breathing and the tunnel drift. `prefers-reduced-motion`: tunnel becomes a static gradient, reveals become fades, no parallax, no smooth-scroll.

---

## 6. Tech stack

- **Vite + TypeScript**, vanilla DOM (no framework needed for a one-pager; smallest bundle, easiest GSAP integration).
- **GSAP 3.13+** (all plugins free): ScrollTrigger, SplitText, MotionPathPlugin, Draggable + InertiaPlugin, Flip.
- **Lenis** smooth scroll.
- **three.js** for the hero hole + tunnel (single renderer, DPR capped at 1.5, `powerPreference: 'high-performance'`). Low-poly GLTF props (Draco). Tunnel walls = procedural noise in a fragment shader, no textures.
- **Fonts** from Google Fonts with `font-display: swap` and a preload for the display face.
- **Images**: AVIF/WebP with PNG fallback, responsive `srcset`, rabbit PNG cut to 1600 px tall for web.
- **Hosting**: Vercel or Netlify static; a tiny serverless function or client-side logic for the "open now" state (Europe/Lisbon time).
- **Analytics**: Plausible (cookie-free, no banner needed).
- **i18n-ready**: copy in a `content/pt.json`; English toggle later.

Folder sketch:

```
src/
  main.ts            boot, preloader gate
  scroll.ts          Lenis + ScrollTrigger sync
  cursor.ts
  webgl/tunnel.ts    three.js scene, scrub bindings
  webgl/ripple.ts    displacement hover
  sections/*.ts      one file per landing
  ui/button.ts ui/card.ts ui/watch.ts
content/pt.json
public/img, public/models
```

---

## 7. Performance, accessibility, mobile

Budgets: LCP < 2.5 s on 4G, JS ≤ 250 KB gzipped (three.js ~150 KB of that), models ≤ 300 KB, first-view images ≤ 400 KB, CLS 0. Lighthouse ≥ 90 on Performance and 100 on Accessibility.

- All text is real HTML; WebGL is decorative and `aria-hidden`.
- Keyboard: every card, button and the carousel focusable with a visible gold focus ring; skip link to content.
- Contrast: ink on cream ≥ 7:1, umber headings ≥ 4.5:1; red only on large text or with an icon.
- Mobile (≤ 768 px): tunnel replaced by a lighter 2D Canvas "falling objects" layer or a static illustration; no pinning; cards stack; lazy-susan becomes a swipe carousel; cursor off; tap replaces hover (flip on tap).
- WebGL unavailable or low-end (`navigator.deviceMemory < 4`, `hardwareConcurrency < 4`): graceful 2D fallback, same layout.

---

## 8. Build roadmap

1. **Foundations (week 1)**: Vite project, tokens, fonts, content JSON, all nine landings laid out statically and responsive. Deliverable: the full page with no motion, already better than the prototype.
2. **Motion pass (week 2)**: Lenis, ScrollTrigger reveals, buttons, cards, chapter rules, cursor, watch, preloader.
3. **WebGL (week 3)**: hero hole, tunnel A/B, ripple hover, props modelled and optimised; fallbacks.
4. **Polish & QA (week 4)**: reduced-motion path, mobile tuning, Safari/iOS checks, Lighthouse, copy proofing with the client, OpenGraph image, launch.

Definition of "award-level" for this project: a jury member should be able to name the idea in one sentence ("the scroll is the fall"), the type should be recognisably Victorian without being a costume, and nothing should move without a reason tied to the story.

---

## 9. Open questions

- Reservations: which tool (TheFork, Zenchef, WhatsApp only)? This decides whether "Reservar" is a modal or a link.
- Menu: link to PDF, or do we build a real menu page/overlay (recommended, with prices)?
- Email address in the Figma looks like it belongs to another business; confirm.
- Photography: we have 4 usable photos; the tunnel props and the private-room "door" want 6–10 more (drinks, details, people).
- Logo: need the SVG export from Figma.
