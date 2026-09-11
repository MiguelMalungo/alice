import { SplitText } from 'gsap/SplitText';
import { gsap, ScrollTrigger, reducedMotion } from './scroll';

gsap.registerPlugin(SplitText);

/**
 * Masked line reveals for every `.reveal`, and the chapter rules that draw themselves in.
 * Elements are left untouched under reduced motion.
 */
export function initReveals() {
  if (reducedMotion) return;

  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110, opacity: 0, duration: 0.95, ease: 'power3.out', stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });

  document.querySelectorAll<SVGPathElement>('.chapter__rule path').forEach((path) => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const heart = path.closest('.chapter')!.querySelector('.chapter__heart')!;
    gsap.set(heart, { scale: 0, transformOrigin: '50% 50%' });
    gsap.timeline({ scrollTrigger: { trigger: path, start: 'top 90%', once: true } })
      .to(path, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' })
      .to(heart, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, '-=0.5');
  });

  ScrollTrigger.refresh();
}
