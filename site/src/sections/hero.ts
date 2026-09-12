import { gsap, ScrollTrigger, isTouch, reducedMotion } from '../scroll';

/** Hero: wordmark draws in, rabbit breathes and follows the cursor, first scroll dives into the hole. */
export function initHero() {
  const hero = document.getElementById('hero')!;
  const inner = hero.querySelector<HTMLElement>('.hero__inner')!;
  const hole = document.getElementById('hole')!;
  const rabbit = document.getElementById('rabbit')!;
  const rabbitImg = rabbit.querySelector<HTMLElement>('.rabbit__img')!;
  const sparkles = document.getElementById('sparkles')!;
  const cue = document.getElementById('scrollcue')!;
  const veil = document.getElementById('veil')!;

  // sparkles around the rabbit
  const pts = [[12, 30], [78, 22], [88, 58], [18, 66], [50, 8], [30, 48], [70, 78]];
  pts.forEach(([x, y], i) => {
    const s = document.createElement('i');
    s.style.left = `${x}%`; s.style.top = `${y}%`; s.style.fontSize = `${10 + (i % 3) * 5}px`;
    sparkles.append(s);
  });

  if (reducedMotion) return;

  // breathing loop + twinkle
  gsap.to(rabbitImg, { scale: 1.018, rotation: -0.8, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to(sparkles.children, { opacity: 0.15, scale: 0.6, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.25, from: 'random' } });
  gsap.to(cue.querySelector('i'), { scaleY: 0.2, transformOrigin: '50% 0', duration: 1, ease: 'power2.in', yoyo: true, repeat: -1, repeatDelay: 2.4 });

  // cursor parallax: rabbit / shadow / sparkles
  if (!isTouch) {
    const rx = gsap.quickTo(rabbitImg, 'x', { duration: 0.8, ease: 'power3' });
    const ry = gsap.quickTo(rabbitImg, 'y', { duration: 0.8, ease: 'power3' });
    const sx = gsap.quickTo(sparkles, 'x', { duration: 1.2, ease: 'power3' });
    const sy = gsap.quickTo(sparkles, 'y', { duration: 1.2, ease: 'power3' });
    window.addEventListener('pointermove', (e) => {
      const nx = (e.clientX / innerWidth - 0.5), ny = (e.clientY / innerHeight - 0.5);
      rx(nx * 14); ry(ny * 8); sx(-nx * 26); sy(-ny * 18);
    }, { passive: true });
  }

  // page-load sequence (called after the preloader)
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
    // the wordmark writes itself in, left to right, like a signature
    .fromTo('.wordmark__img', { clipPath: 'inset(-10% 100% -10% 0)', opacity: 0.6, y: 10 }, { clipPath: 'inset(-10% 0% -10% 0)', opacity: 1, y: 0, duration: 1.4, ease: 'power2.inOut' })
    .from(hole, { scaleX: 0.2, scaleY: 0.1, opacity: 0, duration: 0.8, ease: 'power4.out', clearProps: 'all' }, '-=0.6')
    .from(rabbit, { y: -90, opacity: 0, duration: 0.9, ease: 'back.out(1.4)', clearProps: 'all' }, '-=0.6')
    .from(sparkles.children, { opacity: 0, scale: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(2)' }, '-=0.5')
    .from(['.hero__title', '.hero__lede', '.hero__q', '.ctas', '.scrollcue'], { opacity: 0, y: 24, duration: 0.8, stagger: 0.1 }, '-=0.5');

  // the dive: pin the hero, the hole swallows the screen, the rabbit drops in.
  // Built only after the intro has finished so the scrub records the resting values, not the intro's hidden ones.
  let armed = false;
  const armDive = () => {
    if (armed) return; armed = true;
    gsap.timeline({
      scrollTrigger: {
        trigger: hero, start: 'top top', end: '+=120%', pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => { hero.style.background = self.progress > 0.79 ? 'transparent' : ''; },
        onLeaveBack: () => { hero.style.background = ''; },
      },
    })
      .to(cue, { opacity: 0, duration: 0.1 }, 0)
      // the jump: up and to the left, then down into the hole
      .to(rabbit, { keyframes: [
          { x: '-30%', y: '-45%', rotation: -12, ease: 'power2.out', duration: 0.22 },
          { x: '-78%', y: '70%', rotation: -60, scale: 0.45, ease: 'power2.in', duration: 0.26 },
        ] }, 0)
      .set(rabbit, { zIndex: -1 }, 0.3)             // past the rim: behind the hole
      .to(rabbit, { opacity: 0, duration: 0.1, ease: 'none' }, 0.42)
      .to(sparkles, { opacity: 0, duration: 0.2 }, 0.15)
      .to(['.wordmark', '.hero__title', '.hero__lede', '.hero__q', '.ctas'], { opacity: 0, y: -40, duration: 0.35, stagger: 0.03, ease: 'power2.in' }, 0.1)
      // grow only as far as the viewport needs (a 60x layer would exhaust GPU memory)
      .to(hole, { scale: () => Math.ceil((Math.hypot(innerWidth, innerHeight) * 1.15) / hole.offsetWidth), duration: 0.5, ease: 'power3.in' }, 0.3)
      .to(inner, { scale: 1.06, duration: 0.5, ease: 'power2.in' }, 0.3)
      .to(veil, { opacity: 1, duration: 0.15, ease: 'none' }, 0.62)
      .set(hole, { opacity: 0 }, 0.78)
      .to(veil, { opacity: 0, duration: 0.2, ease: 'none' }, 0.8);
    ScrollTrigger.refresh();
  };
  intro.eventCallback('onComplete', armDive);
  // if someone scrolls before the intro ends, finish it and arm immediately
  window.addEventListener('wheel', () => { if (!armed) { intro.progress(1); armDive(); } }, { passive: true, once: true });
  window.addEventListener('touchmove', () => { if (!armed) { intro.progress(1); armDive(); } }, { passive: true, once: true });

  ScrollTrigger.addEventListener('refreshInit', () => { hero.style.background = ''; });

  return intro;
}
