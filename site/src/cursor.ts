import { gsap, isTouch, reducedMotion } from './scroll';

/** Monocle cursor: the lens grows and shows a parchment label over anything with [data-cursor]. */
export function initCursor() {
  if (isTouch || reducedMotion) return;
  const el = document.getElementById('cursor')!;
  const label = el.querySelector<HTMLElement>('.cursor__label')!;
  document.body.classList.add('has-cursor');

  const chain = el.querySelector<SVGGElement>('.cursor__chain')!;
  const lens = el.querySelector<SVGGElement>('.cursor__lens')!;
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const setX = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3' });
  const setY = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3' });
  // the chain dangles: it swings against the direction of travel, then settles
  gsap.set(lens, { svgOrigin: '32 32' });
  gsap.set(chain, { svgOrigin: '55 44' });
  const swing = gsap.quickTo(chain, 'rotation', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  const tilt = gsap.quickTo(lens, 'rotation', { duration: 0.5, ease: 'power3' });
  const zoom = gsap.quickTo(lens, 'scale', { duration: 0.3, ease: 'power3' });
  let lastX = pos.x, lastT = performance.now();

  window.addEventListener('pointermove', (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    setX(pos.x); setY(pos.y);
    const now = performance.now(); const dt = Math.max(now - lastT, 8);
    const vx = (pos.x - lastX) / dt;                      // px per ms
    lastX = pos.x; lastT = now;
    swing(gsap.utils.clamp(-40, 40, -vx * 30));
    tilt(gsap.utils.clamp(-10, 10, vx * 6));
    const t = e.target as HTMLElement | null;
    const target = t?.closest ? t.closest<HTMLElement>('[data-cursor]') : null;
    if (target) {
      label.textContent = target.dataset.cursor || '';
      el.classList.add('is-hover'); zoom(1.45);
    } else { el.classList.remove('is-hover'); zoom(1); }
    // dark ground: inside the fall or the footer
    const dark = t?.closest ? t.closest('.fall, .bottom, .mcard__back, .menu-overlay, .landing--dark') : null;
    el.classList.toggle('is-dark', !!dark);
  }, { passive: true });

  const svg = el.querySelector<SVGSVGElement>('.cursor__monocle')!;
  document.addEventListener('pointerdown', () => gsap.fromTo(svg, { scale: 1 }, { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: '50% 33%' }));
  window.addEventListener('pointerleave', () => gsap.to(el, { opacity: 0, duration: 0.2 }));
  window.addEventListener('pointerenter', () => gsap.to(el, { opacity: 1, duration: 0.2 }));
}
