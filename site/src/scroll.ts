import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

export let lenis: Lenis | null = null;

/** Recent peak scroll velocity (px/frame), decays. Used by the footer "Chegaste ao fundo" line. */
export const velocity = { peak: 0 };

export function initScroll() {
  if (reducedMotion) return;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', (e: { velocity: number }) => {
    ScrollTrigger.update();
    const v = Math.abs(e.velocity);
    velocity.peak = Math.max(velocity.peak * 0.985, v);
  });
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollTo(target: string | HTMLElement | number, offset = 0, immediate = false) {
  if (lenis) lenis.scrollTo(target, { offset, immediate, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 3) });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
  else {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    el?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
  }
}

export function stopScroll() { lenis?.stop(); document.documentElement.style.overflow = 'hidden'; }
export function startScroll() { lenis?.start(); document.documentElement.style.overflow = ''; }

export { gsap, ScrollTrigger };
