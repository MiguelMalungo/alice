import { gsap, isTouch, reducedMotion } from '../scroll';
import { burst } from './sparkle';

/** Parchment CTAs: magnetic pull within ~90px, 3D tilt toward the cursor, sparkle burst on click. */
export function initMagnetic() {
  const btns = document.querySelectorAll<HTMLElement>('.parch');
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => burst(e.clientX, e.clientY, 14));
  });
  if (isTouch || reducedMotion) return;

  btns.forEach((btn) => {
    const img = btn.querySelector('img')!;
    const toX = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
    const toY = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
    const rx = gsap.quickTo(img, 'rotationX', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(img, 'rotationY', { duration: 0.5, ease: 'power3' });

    const move = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) * 0.9;
      if (dist < reach) {
        const k = 0.28 * (1 - dist / reach);
        toX(dx * k); toY(dy * k);
        ry((dx / r.width) * 14); rx((-dy / r.height) * 14);
      } else { toX(0); toY(0); rx(0); ry(0); }
    };
    window.addEventListener('pointermove', move, { passive: true });
  });
}
