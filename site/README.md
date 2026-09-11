# Alice in Brewland — site

One-page site for the Alice in Brewland brunch café (Rua do Almada 334, Porto). Concept: *the scroll is the fall*. See `../DESIGN-PLAN.md`.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle in dist/
npm run preview    # serve dist/
```

## Stack

Vite 5 · TypeScript · GSAP 3.15 (ScrollTrigger, SplitText, Draggable, Inertia, MotionPath) · Lenis · three.js

## Layout of `src/`

- `main.ts` — preloader (pocket watch) and boot order
- `scroll.ts` — Lenis + ScrollTrigger sync, reduced-motion and touch flags
- `reveal.ts` — masked line reveals, chapter rules that draw in
- `cursor.ts` — ring cursor with parchment labels (`data-cursor`)
- `webgl/tunnel.ts` — the rabbit hole: shader walls, drifting props, scroll-driven camera
- `sections/hero.ts` — wordmark intro, rabbit parallax, the dive (pinned hero)
- `sections/landings.ts` — deck fan, photo ripple, menu card flips, door, map runner, lazy susan, contacts, footer, chapter nav
- `ui/watch.ts` — live Porto time and open/closed state (Mon–Thu 8h30–18h00, Fri–Sun 8h30–19h00)
- `ui/magnetic.ts`, `ui/sparkle.ts` — parchment button physics and gold sparkle bursts
- `styles/main.css` — tokens and all component styles

## Still needed from the client

Logo wordmark SVG (currently set in IM Fell English), heart ornament/star/icon SVGs, more photography, menu with prices, reservation tool link, Instagram/TikTok URLs, and confirmation of the contact email.
